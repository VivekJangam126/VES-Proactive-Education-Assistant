import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import Admin from "../models/Admin.js";
import Organisation from "../models/Organisation.js";
import Teacher from "../models/Teacher.js";
import { generateToken } from "../utils/generateToken.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

export const adminRegister = async (req, res) => {
  if (handleValidation(req, res)) return;

  const { orgName, orgType, name, email, password } = req.body;

  try {
    const existingOrg = await Organisation.findOne({ name: orgName.trim() });
    if (existingOrg) {
      return res.status(400).json({ message: "Organisation name already exists" });
    }

    const adminEmailExists = await Admin.findOne({ email });
    if (adminEmailExists) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const teacherEmailExists = await Teacher.findOne({ email });
    if (teacherEmailExists) {
      return res.status(400).json({ message: "Email already in use by a teacher" });
    }

    const organisation = await Organisation.create({ name: orgName.trim(), type: orgType });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      orgId: organisation._id,
    });

    const token = generateToken({ userId: admin._id, role: admin.role, orgId: admin.orgId });

    return res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        orgId: admin.orgId,
      },
      organisation,
    });
  } catch (error) {
    console.error("Admin registration error", error);
    return res.status(500).json({ message: "Failed to register admin" });
  }
};

export const adminLogin = async (req, res) => {
  if (handleValidation(req, res)) return;

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: admin._id, role: admin.role, orgId: admin.orgId });

    return res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        orgId: admin.orgId,
      },
    });
  } catch (error) {
    console.error("Admin login error", error);
    return res.status(500).json({ message: "Failed to login" });
  }
};

export const teacherRegister = async (req, res) => {
  if (handleValidation(req, res)) return;

  const { name, email, password, orgId } = req.body;

  try {
    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      return res.status(400).json({ message: "Organisation not found" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher with this email already exists" });
    }

    const adminEmailConflict = await Admin.findOne({ email });
    if (adminEmailConflict) {
      return res.status(400).json({ message: "Email already in use by an admin" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      orgId,
      status: "PENDING",
    });

    return res.status(201).json({
      message: "Teacher registered. Await admin approval.",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        orgId: teacher.orgId,
        status: teacher.status,
        role: teacher.role,
      },
    });
  } catch (error) {
    console.error("Teacher registration error", error);
    return res.status(500).json({ message: "Failed to register teacher" });
  }
};

export const teacherLogin = async (req, res) => {
  if (handleValidation(req, res)) return;

  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (teacher.status !== "APPROVED") {
      return res.status(403).json({ message: "Teacher not approved yet" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: teacher._id, role: teacher.role, orgId: teacher.orgId });

    return res.json({
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        orgId: teacher.orgId,
        status: teacher.status,
        assignedClasses: (teacher.assignedClasses || []).map((id) => String(id)),
        subjects: teacher.subjects || [],
      },
    });
  } catch (error) {
    console.error("Teacher login error", error);
    return res.status(500).json({ message: "Failed to login" });
  }
};
