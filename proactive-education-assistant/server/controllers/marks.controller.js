import { validationResult } from "express-validator";
import Marks from "../models/Marks.js";
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

const validateSubjectInClass = async (classId, subject) => {
  const cls = await ClassModel.findById(classId).select("subjects");
  if (!cls) return { ok: false, reason: "Class not found" };
  if (!cls.subjects.includes(subject)) return { ok: false, reason: `Subject '${subject}' not in class subjects` };
  return { ok: true };
};

const teacherCanAccessClass = async (user, classId) => {
  if (user.role !== "TEACHER") return true;
  const teacher = await Teacher.findById(user.userId).select("assignedClasses");
  if (!teacher) return false;
  return teacher.assignedClasses.map(String).includes(String(classId));
};

// Create Marks (manual)
export const createMarks = async (req, res) => {
  if (hasValidationErrors(req, res)) return;
  const { studentId, classId, subject, score, date } = req.body;
  const orgId = req.user.orgId;

  try {
    if (!isValidDateFormat(date)) {
      return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
    }

    const { ok: studentOk, reason: studentReason } = await validateStudentInClass(studentId, classId, orgId);
    if (!studentOk) return res.status(400).json({ message: studentReason });

    const { ok: subjectOk, reason: subjectReason } = await validateSubjectInClass(classId, subject);
    if (!subjectOk) return res.status(400).json({ message: subjectReason });

    const canAccess = await teacherCanAccessClass(req.user, classId);
    if (!canAccess) return res.status(403).json({ message: "Not allowed to record marks for this class" });

    const marks = await Marks.create({ studentId, classId, orgId, subject, score, date });

    return res.status(201).json({
      marks: {
        id: marks._id,
        studentId: marks.studentId,
        classId: marks.classId,
        subject: marks.subject,
        score: marks.score,
        date: marks.date,
        createdAt: marks.createdAt,
      },
    });
  } catch (error) {
    console.error("Create marks error", error);
    return res.status(500).json({ message: "Failed to create marks" });
  }
};

// Import Marks (CSV)
// Expected headers: studentId, classId, subject, score, date
export const importMarksCSV = async (req, res) => {
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
      const subject = (row.subject || "").trim();
      const scoreStr = (row.score || "").trim();
      const date = (row.date || "").trim();

      if (!studentId || !classId || !subject || !scoreStr || !date) {
        skipped++;
        errors.push({ row: rowNum, error: "Missing studentId, classId, subject, score, or date" });
        continue;
      }

      if (!isValidDateFormat(date)) {
        skipped++;
        errors.push({ row: rowNum, error: "Date must be in YYYY-MM-DD format" });
        continue;
      }

      const score = parseFloat(scoreStr);
      if (isNaN(score) || score < 0 || score > 100) {
        skipped++;
        errors.push({ row: rowNum, error: "Score must be a number between 0 and 100" });
        continue;
      }

      try {
        const { ok: studentOk, reason: studentReason } = await validateStudentInClass(studentId, classId, orgId);
        if (!studentOk) {
          skipped++;
          errors.push({ row: rowNum, error: studentReason });
          continue;
        }

        const { ok: subjectOk, reason: subjectReason } = await validateSubjectInClass(classId, subject);
        if (!subjectOk) {
          skipped++;
          errors.push({ row: rowNum, error: subjectReason });
          continue;
        }

        if (req.user.role === "TEACHER" && !teacherAssigned.includes(String(classId))) {
          skipped++;
          errors.push({ row: rowNum, error: "Teacher not assigned to this class" });
          continue;
        }

        await Marks.create({ studentId, classId, orgId, subject, score, date });
        inserted++;
      } catch (e) {
        skipped++;
        errors.push({ row: rowNum, error: e.message || "Unknown error" });
      }
    }

    return res.json({ inserted, skipped, errors });
  } catch (error) {
    console.error("Import marks CSV error", error);
    return res.status(500).json({ message: "Failed to import marks" });
  }
};
