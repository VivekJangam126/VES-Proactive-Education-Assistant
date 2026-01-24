import express from "express";
import { body } from "express-validator";
import {
  approveTeacher,
  getPendingTeachers,
  getAllTeachers,
  rejectTeacher,
  assignTeacherClasses,
  getClasses,
  createClass,
  updateClass,
  deactivateClass,
  getDashboard,
  getAnalytics,
  getStudents,
  importData,
} from "../controllers/admin.controller.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.use(authMiddleware, adminOnly);

// Dashboard & analytics
router.get("/dashboard", getDashboard);
router.get("/analytics", getAnalytics);

// Teachers
router.get("/teachers", getAllTeachers);
router.get("/teachers/pending", getPendingTeachers);

router.patch(
  "/teachers/:id/approve",
  [body("assignedClasses").isArray({ min: 1 }).withMessage("assignedClasses must be a non-empty array")],
  approveTeacher
);

router.patch("/teachers/:id/reject", rejectTeacher);
router.patch(
  "/teachers/:id/assign-classes",
  [body("assignedClasses").isArray().withMessage("assignedClasses must be an array")],
  assignTeacherClasses
);

// Classes
router.get("/classes", getClasses);
router.post(
  "/classes",
  [
    body("name").isString().trim().notEmpty().withMessage("name is required"),
    body("subjects").isArray({ min: 1 }).withMessage("subjects must be a non-empty array"),
    body("subjects.*").isString().trim().notEmpty().withMessage("subject must be non-empty string"),
  ],
  createClass
);
router.patch(
  "/classes/:id",
  [
    body("name").optional().isString().trim().notEmpty().withMessage("If provided, name must be non-empty"),
    body("subjects").optional().isArray({ min: 1 }).withMessage("If provided, subjects must be a non-empty array"),
    body("subjects.*").optional().isString().trim().notEmpty().withMessage("Subjects must be non-empty strings"),
    body("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
  ],
  updateClass
);
router.patch("/classes/:id/deactivate", deactivateClass);

// Students
router.get("/students", getStudents);

// Import (CSV only for now)
router.post("/import", upload.single('file'), importData);

export default router;
