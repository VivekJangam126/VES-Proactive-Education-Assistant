// Get Student by ID
export const getStudentById = async (req, res) => {
  const { id } = req.params;
  const orgId = req.user.orgId;
  try {
    const student = await Student.findOne({ _id: id, orgId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.json({
      student: {
        id: student._id,
        name: student.name,
        classId: student.classId,
        orgId: student.orgId,
        isActive: student.isActive,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error("Get student by ID error", error);
    return res.status(500).json({ message: "Failed to fetch student" });
  }
};
import { validationResult } from "express-validator";
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

const ensureClassInOrg = async (classId, orgId) => {
  const cls = await ClassModel.findById(classId);
  if (!cls) return { ok: false, reason: "Class not found" };
  if (String(cls.orgId) !== String(orgId)) return { ok: false, reason: "Class not in your organisation" };
  return { ok: true, cls };
};

const teacherCanAccessClass = async (user, classId) => {
  if (user.role !== "TEACHER") return true; // Admin checked elsewhere
  const teacher = await Teacher.findById(user.userId).select("assignedClasses orgId");
  if (!teacher) return false;
  return teacher.assignedClasses.map(String).includes(String(classId));
};

// Create Student (manual)
export const createStudent = async (req, res) => {
  if (hasValidationErrors(req, res)) return;
  const { name, classId } = req.body;
  const orgId = req.user.orgId;

  try {
    const { ok, reason } = await ensureClassInOrg(classId, orgId);
    if (!ok) return res.status(400).json({ message: reason });

    // Teacher can add only to assigned classes
    const canAccess = await teacherCanAccessClass(req.user, classId);
    if (!canAccess) return res.status(403).json({ message: "Not allowed to add students to this class" });

    const student = await Student.create({ name: name.trim(), classId, orgId });

    return res.status(201).json({
      student: {
        id: student._id,
        name: student.name,
        classId: student.classId,
        orgId: student.orgId,
        isActive: student.isActive,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error("Create student error", error);
    return res.status(500).json({ message: "Failed to create student" });
  }
};

// Get Students (by class)
export const getStudentsByClass = async (req, res) => {
  if (hasValidationErrors(req, res)) return;
  const { classId } = req.query;
  const orgId = req.user.orgId;

  try {
    const { ok, reason } = await ensureClassInOrg(classId, orgId);
    if (!ok) return res.status(400).json({ message: reason });

    const students = await Student.find({ classId, orgId }).select(
      "name classId orgId isActive createdAt"
    );
    return res.json({ students });
  } catch (error) {
    console.error("Get students error", error);
    return res.status(500).json({ message: "Failed to fetch students" });
  }
};

// Import Students (CSV)
// CSV expected headers include at least: name, className
// Column order independent; extra columns ignored
export const importStudentsCSV = async (req, res) => {
  try {
    const orgId = req.user.orgId;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "CSV file is required under field 'file'" });
    }

    const csvText = req.file.buffer.toString("utf-8");

    // Parse CSV with headers
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    // If TEACHER, load assigned classes once
    let teacherAssigned = null;
    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findById(req.user.userId).select("assignedClasses");
      teacherAssigned = teacher ? teacher.assignedClasses.map(String) : [];
    }

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNum = i + 1;
      const name = (row.name || row.studentName || "").trim();
      const className = (row.className || row.class || "").trim();

      if (!name || !className) {
        skipped++;
        errors.push({ row: rowNum, error: "Missing name or className" });
        continue;
      }

      try {
        const cls = await ClassModel.findOne({ name: className, orgId });
        if (!cls) {
          skipped++;
          errors.push({ row: rowNum, error: `Class '${className}' not found in organisation` });
          continue;
        }

        // Teacher can add only to assigned classes
        if (req.user.role === "TEACHER" && !teacherAssigned.includes(String(cls._id))) {
          skipped++;
          errors.push({ row: rowNum, error: "Teacher not assigned to this class" });
          continue;
        }

        await Student.create({ name, classId: cls._id, orgId });
        inserted++;
      } catch (e) {
        skipped++;
        errors.push({ row: rowNum, error: e.message || "Unknown error" });
      }
    }

    return res.json({ inserted, skipped, errors });
  } catch (error) {
    console.error("Import students CSV error", error);
    return res.status(500).json({ message: "Failed to import students" });
  }
};
