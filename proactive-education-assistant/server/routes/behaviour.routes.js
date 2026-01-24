import express from "express";
import multer from "multer";
import { body, param } from "express-validator";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createBehaviour, importBehaviourCSV } from "../controllers/behaviour.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.use(authMiddleware);

// Create Behaviour (manual)
router.post(
  "/",
  [
    body("studentId").isMongoId().withMessage("Valid studentId is required"),
    body("classId").isMongoId().withMessage("Valid classId is required"),
    body("type")
      .isIn(["frequent_absence", "class_disengagement", "late_submission", "home_issues_reported", "disciplinary_notice"])
      .withMessage("Invalid behaviour type"),
    body("date").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Date must be in YYYY-MM-DD format"),
  ],
  createBehaviour
);

// Import Behaviour (CSV)
router.post(
  "/import",
  upload.single("file"),
  importBehaviourCSV
);

export default router;
