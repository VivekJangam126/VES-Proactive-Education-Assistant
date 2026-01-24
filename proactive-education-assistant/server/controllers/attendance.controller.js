import { validationResult } from "express-validator";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import ClassModel from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import { parse } from "csv-parse/sync";

const hasValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

const isValidDateFormat = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

const validateStudentInClass = async (studentId, classId, orgId) => {
  const student = await Student.findById(studentId);
  if (!student) return { ok: false, reason: "Student not found" };
  if (String(student.orgId) !== String(orgId)) return { ok: false, reason: "Student not in your organisation" };
  if (String(student.classId) !== String(classId)) return { ok: false, reason: "Student not in this class" };
  return { ok: true };
};

const teacherCanAccessClass = async (user, classId) => {
  if (user.role !== "TEACHER") return true;
  const teacher = await Teacher.findById(user.userId).select("assignedClasses");
  if (!teacher) return false;
  return teacher.assignedClasses.map(String).includes(String(classId));
};

// Create Attendance (manual)
export const createAttendance = async (req, res) => {
  if (hasValidationErrors(req, res)) return;
  const { studentId, classId, date, status } = req.body;
  const orgId = req.user.orgId;

  try {
    if (!isValidDateFormat(date)) {
      return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
    }

    const { ok, reason } = await validateStudentInClass(studentId, classId, orgId);
    if (!ok) return res.status(400).json({ message: reason });

    const canAccess = await teacherCanAccessClass(req.user, classId);
    if (!canAccess) return res.status(403).json({ message: "Not allowed to record attendance for this class" });

    const attendance = await Attendance.create({ studentId, classId, orgId, date, status });

    return res.status(201).json({
      attendance: {
        id: attendance._id,
        studentId: attendance.studentId,
        classId: attendance.classId,
        date: attendance.date,
        status: attendance.status,
        createdAt: attendance.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Attendance already recorded for this student on this date" });
    }
    console.error("Create attendance error", error);
    return res.status(500).json({ message: "Failed to create attendance" });
  }
};

// Import Attendance (CSV)
// Expected headers: studentId, classId, date, status (or roll_number, date, status for later)
export const importAttendanceCSV = async (req, res) => {
  try {
    const orgId = req.user.orgId;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "CSV file is required under field 'file'" });
    }

    const csvText = req.file.buffer.toString("utf-8");
    const records = parse(csvText, { columns: true, skip_empty_lines: true, trim: true });

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    let teacherAssigned = null;
    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findById(req.user.userId).select("assignedClasses");
      teacherAssigned = teacher ? teacher.assignedClasses.map(String) : [];
    }

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNum = i + 1;
      const studentId = (row.studentId || row.student_id || "").trim();
      const classId = (row.classId || row.class_id || "").trim();
      const date = (row.date || "").trim();
      const status = (row.status || "").trim().toUpperCase();

      if (!studentId || !classId || !date || !status) {
        skipped++;
        errors.push({ row: rowNum, error: "Missing studentId, classId, date, or status" });
        continue;
      }

      if (!isValidDateFormat(date)) {
        skipped++;
        errors.push({ row: rowNum, error: "Date must be in YYYY-MM-DD format" });
        continue;
      }

      if (!["PRESENT", "ABSENT"].includes(status)) {
        skipped++;
        errors.push({ row: rowNum, error: "Status must be PRESENT or ABSENT" });
        continue;
      }

      try {
        const { ok, reason } = await validateStudentInClass(studentId, classId, orgId);
        if (!ok) {
          skipped++;
          errors.push({ row: rowNum, error: reason });
          continue;
        }

        if (req.user.role === "TEACHER" && !teacherAssigned.includes(String(classId))) {
          skipped++;
          errors.push({ row: rowNum, error: "Teacher not assigned to this class" });
          continue;
        }

        await Attendance.create({ studentId, classId, orgId, date, status });
        inserted++;
      } catch (e) {
        skipped++;
        const msg = e.code === 11000 ? "Duplicate: attendance already recorded for this student on this date" : e.message;
        errors.push({ row: rowNum, error: msg });
      }
    }

    return res.json({ inserted, skipped, errors });
  } catch (error) {
    console.error("Import attendance CSV error", error);
    return res.status(500).json({ message: "Failed to import attendance" });
  }
};
