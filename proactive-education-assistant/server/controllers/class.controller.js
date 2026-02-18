import { validationResult } from "express-validator";
import ClassModel from "../models/Class.js";

const hasValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

// Create Class (Admin only)
export const createClass = async (req, res) => {
  if (hasValidationErrors(req, res)) return;
  const { name, subjects } = req.body;

  try {
    // Enforce org isolation
    const orgId = req.user.orgId;

    // Prevent duplicate names per org
    const existing = await ClassModel.findOne({ name: name.trim(), orgId });
    if (existing) {
      return res.status(400).json({ message: "Class name already exists in this organisation" });
    }

    const cls = await ClassModel.create({ name: name.trim(), subjects, orgId });

    return res.status(201).json({
      class: {
        id: cls._id,
        name: cls.name,
        subjects: cls.subjects,
        orgId: cls.orgId,
        isActive: cls.isActive,
        createdAt: cls.createdAt,
      },
    });
  } catch (error) {
    console.error("Create class error", error);
    return res.status(500).json({ message: "Failed to create class" });
  }
};

// Get All Classes (Org scoped)
export const getClasses = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const classes = await ClassModel.find({ orgId }).select("name subjects orgId isActive createdAt");
    return res.json({ classes });
  } catch (error) {
    console.error("Get classes error", error);
    return res.status(500).json({ message: "Failed to fetch classes" });
  }
};

// Get Class by ID (Org scoped)
export const getClassById = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const { id } = req.params;
    const cls = await ClassModel.findOne({ _id: id, orgId }).select("name subjects orgId isActive createdAt");
    if (!cls) {
      return res.status(404).json({ message: "Class not found in your organisation" });
    }
    return res.json({
      class: {
        id: cls._id,
        name: cls.name,
        subjects: cls.subjects,
        orgId: cls.orgId,
        isActive: cls.isActive,
        createdAt: cls.createdAt,
      },
    });
  } catch (error) {
    console.error("Get class by id error", error);
    return res.status(500).json({ message: "Failed to fetch class" });
  }
};

// Update Class (Admin only)
export const updateClass = async (req, res) => {
  if (hasValidationErrors(req, res)) return;

  const { id } = req.params;
  const { name, subjects, isActive } = req.body;

  try {
    const orgId = req.user.orgId;

    const cls = await ClassModel.findOne({ _id: id, orgId });
    if (!cls) {
      return res.status(404).json({ message: "Class not found in your organisation" });
    }

    // If renaming, ensure uniqueness per org
    if (name && name.trim() !== cls.name) {
      const dupe = await ClassModel.findOne({ name: name.trim(), orgId });
      if (dupe) {
        return res.status(400).json({ message: "Another class with this name already exists" });
      }
      cls.name = name.trim();
    }

    if (Array.isArray(subjects)) {
      cls.subjects = subjects;
    }

    if (typeof isActive === "boolean") {
      cls.isActive = isActive;
    }

    await cls.save();

    return res.json({
      class: {
        id: cls._id,
        name: cls.name,
        subjects: cls.subjects,
        orgId: cls.orgId,
        isActive: cls.isActive,
        createdAt: cls.createdAt,
      },
    });
  } catch (error) {
    console.error("Update class error", error);
    return res.status(500).json({ message: "Failed to update class" });
  }
};
