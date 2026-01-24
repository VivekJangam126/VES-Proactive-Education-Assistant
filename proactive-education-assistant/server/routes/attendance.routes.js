import express from "express";
import multer from "multer";
import { body } from "express-validator";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createAttendance, importAttendanceCSV } from "../controllers/attendance.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.use(authMiddleware);

// Create Attendance (manual)
router.post(
  "/",
  [
    body("studentId").isMongoId().withMessage("Valid studentId is required"),
    body("classId").isMongoId().withMessage("Valid classId is required"),
    body("date").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Date must be in YYYY-MM-DD format"),
    body("status").isIn(["PRESENT", "ABSENT"]).withMessage("Status must be PRESENT or ABSENT"),
  ],
  createAttendance
);

// Import Attendance (CSV)
router.post(
  "/import",
  upload.single("file"),
  importAttendanceCSV
);

export default router;
