import express from "express";
import multer from "multer";
import { body } from "express-validator";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createMarks, importMarksCSV } from "../controllers/marks.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.use(authMiddleware);

// Create Marks (manual)
router.post(
  "/",
  [
    body("studentId").isMongoId().withMessage("Valid studentId is required"),
    body("classId").isMongoId().withMessage("Valid classId is required"),
    body("subject").isString().trim().notEmpty().withMessage("Subject is required"),
    body("score")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Score must be a number between 0 and 100"),
    body("date").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Date must be in YYYY-MM-DD format"),
  ],
  createMarks
);

// Import Marks (CSV)
router.post(
  "/import",
  upload.single("file"),
  importMarksCSV
);

export default router;
