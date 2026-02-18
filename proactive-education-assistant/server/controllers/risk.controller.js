import Student from "../models/Student.js";
import ClassModel from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import { computeStudentRisk } from "../services/riskEngine.js";

const validateStudentInOrg = async (studentId, orgId) => {
  const student = await Student.findById(studentId);
  if (!student) return { ok: false, reason: "Student not found" };
  if (String(student.orgId) !== String(orgId)) return { ok: false, reason: "Student not in your organisation" };
  return { ok: true, student };
};

const teacherCanAccessStudent = async (user, studentId, orgId) => {
  if (user.role !== "TEACHER") return true;

  const { ok, student } = await validateStudentInOrg(studentId, orgId);
  if (!ok) return false;

  const teacher = await Teacher.findById(user.userId).select("assignedClasses");
  if (!teacher) return false;

  return teacher.assignedClasses.map(String).includes(String(student.classId));
};

// Get Risk for Single Student
export const getStudentRisk = async (req, res) => {
  const { studentId } = req.params;
  const orgId = req.user.orgId;

  try {
    const { ok, reason, student } = await validateStudentInOrg(studentId, orgId);
    if (!ok) return res.status(404).json({ message: reason });

    const canAccess = await teacherCanAccessStudent(req.user, studentId, orgId);
    if (!canAccess) return res.status(403).json({ message: "Not allowed to view risk for this student" });

    const risk = await computeStudentRisk(studentId, student.classId);

    return res.json({
      student: {
        id: student._id,
        name: student.name,
        classId: student.classId,
      },
      risk,
    });
  } catch (error) {
    console.error("Get student risk error", error);
    return res.status(500).json({ message: "Failed to compute risk" });
  }
};

// Get Risk for All Students in Class
export const getClassRisk = async (req, res) => {
  const { classId } = req.query;
  const orgId = req.user.orgId;

  try {
    if (!classId) {
      return res.status(400).json({ message: "classId query parameter is required" });
    }

    const cls = await ClassModel.findById(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });
    if (String(cls.orgId) !== String(orgId)) return res.status(403).json({ message: "Class not in your organisation" });

    const canAccess = await (async () => {
      if (req.user.role !== "TEACHER") return true;
      const teacher = await Teacher.findById(req.user.userId).select("assignedClasses");
      if (!teacher) return false;
      return teacher.assignedClasses.map(String).includes(String(classId));
    })();

    if (!canAccess) return res.status(403).json({ message: "Teacher not assigned to this class" });

    const students = await Student.find({ classId, orgId }).select("name");

    const risks = await Promise.all(
      students.map(async (student) => {
        const risk = await computeStudentRisk(student._id, classId);
        return {
          student: { id: student._id, name: student.name },
          risk,
        };
      })
    );

    return res.json({
      class: { id: cls._id, name: cls.name },
      risks,
      summary: {
        total: risks.length,
        high: risks.filter((r) => r.risk.riskLevel === "HIGH").length,
        medium: risks.filter((r) => r.risk.riskLevel === "MEDIUM").length,
        low: risks.filter((r) => r.risk.riskLevel === "LOW").length,
      },
    });
  } catch (error) {
    console.error("Get class risk error", error);
    return res.status(500).json({ message: "Failed to compute class risk" });
  }
};
