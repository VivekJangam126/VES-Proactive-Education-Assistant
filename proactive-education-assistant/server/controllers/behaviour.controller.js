import { validationResult } from "express-validator";
import Behaviour from "../models/Behaviour.js";
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

// Create Behaviour (manual)
export const createBehaviour = async (req, res) => {
  if (hasValidationErrors(req, res)) return;
  const { studentId, classId, type, date } = req.body;
  const orgId = req.user.orgId;

  try {
    if (!isValidDateFormat(date)) {
      return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
    }

    const { ok, reason } = await validateStudentInClass(studentId, classId, orgId);
    if (!ok) return res.status(400).json({ message: reason });

    const canAccess = await teacherCanAccessClass(req.user, classId);
    if (!canAccess) return res.status(403).json({ message: "Not allowed to record behaviour for this class" });

    const behaviour = await Behaviour.create({ studentId, classId, orgId, type, date });

    return res.status(201).json({
      behaviour: {
        id: behaviour._id,
        studentId: behaviour.studentId,
        classId: behaviour.classId,
        type: behaviour.type,
        date: behaviour.date,
        createdAt: behaviour.createdAt,
      },
    });
  } catch (error) {
    console.error("Create behaviour error", error);
    return res.status(500).json({ message: "Failed to record behaviour" });
  }
};

// Import Behaviour (CSV)
// Expected headers: studentId, classId, type, date
export const importBehaviourCSV = async (req, res) => {
  try {
    const orgId = req.user.orgId;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "CSV file is required under field 'file'" });
    }

    const csvText = req.file.buffer.toString("utf-8");
    const records = parse(csvText, { columns: true, skip_empty_lines: true, trim: true });

    const validTypes = ["frequent_absence", "class_disengagement", "late_submission", "home_issues_reported", "disciplinary_notice"];

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
      const type = (row.type || "").trim().toLowerCase();
      const date = (row.date || "").trim();

      if (!studentId || !classId || !type || !date) {
        skipped++;
        errors.push({ row: rowNum, error: "Missing studentId, classId, type, or date" });
        continue;
      }

      if (!validTypes.includes(type)) {
        skipped++;
        errors.push({ row: rowNum, error: `Invalid type. Must be one of: ${validTypes.join(", ")}` });
        continue;
      }

      if (!isValidDateFormat(date)) {
        skipped++;
        errors.push({ row: rowNum, error: "Date must be in YYYY-MM-DD format" });
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

        await Behaviour.create({ studentId, classId, orgId, type, date });
        inserted++;
      } catch (e) {
        skipped++;
        errors.push({ row: rowNum, error: e.message || "Unknown error" });
      }
    }

    return res.json({ inserted, skipped, errors });
  } catch (error) {
    console.error("Import behaviour CSV error", error);
    return res.status(500).json({ message: "Failed to import behaviour" });
  }
};
