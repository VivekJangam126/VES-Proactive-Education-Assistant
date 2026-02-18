import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import { computeStudentRisk } from "../services/riskEngine.js";
import { parse } from "csv-parse/sync";

export const getPendingTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ orgId: req.user.orgId, status: "PENDING" })
      .select("name email orgId status assignedClasses createdAt")
      .lean();

    // Map to frontend-friendly shape
    const teacherDtos = teachers.map((t) => ({
      id: t._id,
      name: t.name,
      email: t.email,
      status: t.status.toLowerCase(),
      assignedClasses: t.assignedClasses?.map((id) => String(id)) || [],
      joinedDate: t.createdAt?.toISOString?.() || t.createdAt,
      subject: "N/A",
    }));

    return res.json({ teachers: teacherDtos });
  } catch (error) {
    console.error("Fetch pending teachers error", error);
    return res.status(500).json({ message: "Failed to fetch pending teachers" });
  }
};

export const approveTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { assignedClasses } = req.body;

  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (String(teacher.orgId) !== String(req.user.orgId)) {
      return res.status(403).json({ message: "Cannot approve teacher from another organisation" });
    }

    const classIds = (assignedClasses || []).map((cid) => new mongoose.Types.ObjectId(cid));

    // Fetch subjects from all assigned classes in a single query
    const classes = await Class.find({ _id: { $in: classIds }, orgId: req.user.orgId }).select("subjects").lean();
    const subjects = [...new Set(classes.flatMap((c) => c.subjects))];

    // Single save operation
    teacher.assignedClasses = classIds;
    teacher.subjects = subjects;
    teacher.status = "APPROVED";
    await teacher.save();

    return res.json({
      message: "Teacher approved successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        status: teacher.status.toLowerCase(),
        assignedClasses: teacher.assignedClasses.map((id) => String(id)),
        subjects: teacher.subjects,
        orgId: teacher.orgId,
        role: teacher.role,
      },
    });
  } catch (error) {
    console.error("Approve teacher error", error);
    return res.status(500).json({ message: "Failed to approve teacher" });
  }
};

export const rejectTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (String(teacher.orgId) !== String(req.user.orgId)) {
      return res.status(403).json({ message: "Cannot reject teacher from another organisation" });
    }
    teacher.status = "REJECTED";
    await teacher.save();
    return res.json({
      message: "Teacher rejected",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        status: teacher.status.toLowerCase(),
        assignedClasses: teacher.assignedClasses.map((id) => String(id)),
      },
    });
  } catch (error) {
    console.error("Reject teacher error", error);
    return res.status(500).json({ message: "Failed to reject teacher" });
  }
};

export const assignTeacherClasses = async (req, res) => {
  const { id } = req.params;
  const { assignedClasses } = req.body; // array of classIds
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (String(teacher.orgId) !== String(req.user.orgId)) {
      return res.status(403).json({ message: "Cannot update teacher from another organisation" });
    }
    const classIds = (assignedClasses || []).map((cid) => new mongoose.Types.ObjectId(cid));
    const classes = await Class.find({ _id: { $in: classIds }, orgId: req.user.orgId }).select("subjects").lean();
    const subjects = [...new Set(classes.flatMap((c) => c.subjects))];

    teacher.assignedClasses = classIds;
    teacher.subjects = subjects;
    await teacher.save();
    return res.json({
      message: "Classes assigned successfully",
      teacher: {
        id: teacher._id,
        assignedClasses: teacher.assignedClasses.map((id) => String(id)),
        subjects: teacher.subjects,
      },
    });
  } catch (error) {
    console.error("Assign classes error", error);
    return res.status(500).json({ message: "Failed to assign classes" });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const [teachers, classes] = await Promise.all([
      Teacher.find({ orgId: req.user.orgId }).select("name email status assignedClasses subjects createdAt").lean(),
      Class.find({ orgId: req.user.orgId }).select("_id name").lean(),
    ]);

    const classMap = new Map(classes.map((c) => [String(c._id), c.name]));

    const data = teachers.map((t) => ({
      id: t._id,
      name: t.name,
      email: t.email,
      subject: Array.isArray(t.subjects) && t.subjects.length ? t.subjects[0] : "N/A",
      subjects: t.subjects || [],
      status: t.status.toLowerCase(),
      assignedClasses: (t.assignedClasses || []).map((cid) => classMap.get(String(cid)) || String(cid)),
      joinedDate: t.createdAt?.toISOString?.() || t.createdAt,
    }));

    return res.json({ teachers: data });
  } catch (error) {
    console.error("Get all teachers error", error);
    return res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

export const getClasses = async (req, res) => {
  try {
    const [classes, teachers, students] = await Promise.all([
      Class.find({ orgId: req.user.orgId }).lean(),
      Teacher.find({ orgId: req.user.orgId }).select("name assignedClasses").lean(),
      Student.aggregate([
        { $match: { orgId: new mongoose.Types.ObjectId(req.user.orgId) } },
        { $group: { _id: "$classId", count: { $sum: 1 } } },
      ]),
    ]);

    const studentCountMap = new Map(students.map((s) => [String(s._id), s.count]));

    const data = classes.map((cls) => {
      const assignedTeachers = teachers
        .filter((t) => (t.assignedClasses || []).some((cid) => String(cid) === String(cls._id)))
        .map((t) => t.name);
      return {
        id: cls._id,
        name: cls.name,
        description: "",
        grade: null,
        status: cls.isActive ? "active" : "inactive",
        subjects: cls.subjects || [],
        studentCount: studentCountMap.get(String(cls._id)) || 0,
        assignedTeachers,
      };
    });

    return res.json({ classes: data });
  } catch (error) {
    console.error("Get classes error", error);
    return res.status(500).json({ message: "Failed to fetch classes" });
  }
};

export const createClass = async (req, res) => {
  const { name, subjects } = req.body;
  if (!name) return res.status(400).json({ message: "Class name is required" });
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ message: "Subjects must be a non-empty array" });
  }
  try {
    const cls = await Class.create({ name, subjects, orgId: req.user.orgId });
    return res.status(201).json({
      id: cls._id,
      name: cls.name,
      description: "",
      grade: null,
      status: cls.isActive ? "active" : "inactive",
      subjects: cls.subjects,
      assignedTeachers: [],
      studentCount: 0,
    });
  } catch (error) {
    console.error("Create class error", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Class with this name already exists" });
    }
    return res.status(500).json({ message: "Failed to create class" });
  }
};

export const updateClass = async (req, res) => {
  const { id } = req.params;
  const { name, subjects, isActive } = req.body;
  try {
    const cls = await Class.findOne({ _id: id, orgId: req.user.orgId });
    if (!cls) return res.status(404).json({ message: "Class not found" });
    if (name !== undefined) cls.name = name;
    if (Array.isArray(subjects)) cls.subjects = subjects;
    if (typeof isActive === "boolean") cls.isActive = isActive;
    await cls.save();
    return res.json({ message: "Class updated" });
  } catch (error) {
    console.error("Update class error", error);
    return res.status(500).json({ message: "Failed to update class" });
  }
};

export const deactivateClass = async (req, res) => {
  const { id } = req.params;
  try {
    const cls = await Class.findOne({ _id: id, orgId: req.user.orgId });
    if (!cls) return res.status(404).json({ message: "Class not found" });
    cls.isActive = false;
    await cls.save();
    return res.json({ message: "Class deactivated" });
  } catch (error) {
    console.error("Deactivate class error", error);
    return res.status(500).json({ message: "Failed to deactivate class" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);
    const [totalTeachers, pendingApprovals, totalClasses, totalStudents] = await Promise.all([
      Teacher.countDocuments({ orgId }),
      Teacher.countDocuments({ orgId, status: "PENDING" }),
      Class.countDocuments({ orgId }),
      Student.countDocuments({ orgId }),
    ]);

    // High risk students (compute by sampling all students; may be heavy but accurate)
    const students = await Student.find({ orgId }).select("_id classId").lean();
    let highRiskStudents = 0;
    for (const s of students) {
      const risk = await computeStudentRisk(s._id, s.classId);
      if (risk.riskLevel === "HIGH") highRiskStudents++;
    }

    return res.json({
      data: { totalTeachers, pendingApprovals, totalClasses, totalStudents, highRiskStudents },
    });
  } catch (error) {
    console.error("Get dashboard error", error);
    return res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);
    const students = await Student.find({ orgId }).select("_id classId").lean();
    let high = 0, med = 0, low = 0;
    for (const s of students) {
      const risk = await computeStudentRisk(s._id, s.classId);
      if (risk.riskLevel === "HIGH") high++;
      else if (risk.riskLevel === "MEDIUM") med++;
      else low++;
    }

    // Attendance trend for last 7 days (percentage present across all records)
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      return d.toISOString().split("T")[0];
    });

    const attendanceTrend = [];
    for (const day of days) {
      const records = await Attendance.find({ orgId, date: day }).select("status").lean();
      if (records.length === 0) {
        attendanceTrend.push(0);
      } else {
        const present = records.filter((r) => r.status === "PRESENT").length;
        attendanceTrend.push(Math.round((present / records.length) * 100));
      }
    }

    const activeClasses = await Class.countDocuments({ orgId, isActive: true });

    return res.json({
      data: {
        riskDistribution: { high, medium: med, low },
        attendanceTrend,
        improvementRate: 0, // placeholder until improvement logic is defined
        totalStudents: students.length,
        activeClasses,
      },
    });
  } catch (error) {
    console.error("Get analytics error", error);
    return res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

export const getStudents = async (req, res) => {
  try {
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);
    const classes = await Class.find({ orgId }).select("_id name").lean();
    const classMap = new Map(classes.map((c) => [String(c._id), c.name]));
    const students = await Student.find({ orgId }).select("name classId createdAt").lean();

    const data = [];
    for (const s of students) {
      const risk = await computeStudentRisk(s._id, s.classId);
      data.push({
        id: s._id,
        name: s.name,
        class: classMap.get(String(s.classId)) || "",
        riskLevel: risk.riskLevel.toLowerCase(),
        attendance: risk.metrics.attendance.attendancePercent !== null
          ? Math.round(risk.metrics.attendance.attendancePercent)
          : 0,
        lastUpdate: s.createdAt?.toISOString?.() || s.createdAt,
      });
    }

    return res.json({ students: data });
  } catch (error) {
    console.error("Get students error", error);
    return res.status(500).json({ message: "Failed to fetch students" });
  }
};

export const importData = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const type = (req.body.type || '').toLowerCase();
    if (!['students', 'attendance', 'marks'].includes(type)) {
      return res.status(400).json({ message: "Invalid import type" });
    }

    // CSV only
    const content = req.file.buffer.toString('utf-8');
    const records = parse(content, { columns: true, skip_empty_lines: true, trim: true });

    let successful = 0;
    const errors = [];

    if (type === 'students') {
      for (let i = 0; i < records.length; i++) {
        const row = records[i];
        const name = row.name || row.Name || row["Student Name"] || row["Student"];
        const className = row.class || row.Class || row["Class Name"] || row["Class"];
        if (!name || !className) {
          errors.push({ row: i + 2, reason: 'Missing name or class' });
          continue;
        }
        try {
          // Ensure class exists
          let cls = await Class.findOne({ name: className, orgId: req.user.orgId });
          if (!cls) {
            cls = await Class.create({ name: className, subjects: ['General'], orgId: req.user.orgId });
          }
          await Student.create({ name, classId: cls._id, orgId: req.user.orgId });
          successful++;
        } catch (e) {
          errors.push({ row: i + 2, reason: e.message || 'Insert failed' });
        }
      }
    } else {
      return res.status(400).json({ message: `Import type '${type}' not supported yet` });
    }

    return res.json({
      summary: {
        total: records.length,
        successful,
        failed: errors.length,
        errors,
        type,
      },
    });
  } catch (error) {
    console.error('Import data error', error);
    return res.status(500).json({ message: 'Failed to import data' });
  }
};
