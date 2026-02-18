
import express from "express";
import multer from "multer";
import { body, query } from "express-validator";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createStudent, getStudentsByClass, importStudentsCSV, getStudentById } from "../controllers/student.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();


router.use(authMiddleware);

// Get Student by ID
router.get(
  "/:id",
  getStudentById
);


// Create Student (manual)
router.post(
  "/",
  [
    body("name").isString().trim().notEmpty().withMessage("Student name is required"),
    body("classId").isMongoId().withMessage("Valid classId is required"),
  ],
  createStudent
);

// Get Students (by class)
router.get(
  "/",
  [query("classId").isMongoId().withMessage("Valid classId query param is required")],
  getStudentsByClass
);

// Import Students (CSV file field 'file')
router.post(
  "/import",
  upload.single("file"),
  importStudentsCSV
);

export default router;
