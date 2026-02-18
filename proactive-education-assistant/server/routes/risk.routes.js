import express from "express";
import { param, query } from "express-validator";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getStudentRisk, getClassRisk } from "../controllers/risk.controller.js";

const router = express.Router();

router.use(authMiddleware);

// Get Risk for Single Student
router.get(
  "/:studentId",
  [param("studentId").isMongoId().withMessage("Valid studentId is required")],
  getStudentRisk
);

// Get Risk for All Students in Class
router.get(
  "/",
  [query("classId").optional().isMongoId().withMessage("Valid classId is required if provided")],
  getClassRisk
);

export default router;
