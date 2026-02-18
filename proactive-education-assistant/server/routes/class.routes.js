import express from "express";
import { body, param } from "express-validator";
import { createClass, getClasses, getClassById, updateClass } from "../controllers/class.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create Class (Admin only)
router.post(
  "/",
  [
    adminOnly,
    body("name").isString().trim().notEmpty().withMessage("Class name is required"),
    body("subjects")
      .isArray({ min: 1 })
      .withMessage("Subjects must be a non-empty array"),
    body("subjects.*").isString().trim().notEmpty().withMessage("Subject must be a non-empty string"),
  ],
  createClass
);

// Get All Classes (Org scoped)
router.get("/", getClasses);
router.get("/:id", getClassById);

// Update Class (Admin only)
router.patch(
  "/:id",
  [
    adminOnly,
    param("id").isMongoId().withMessage("Valid class id is required"),
    body("name").optional().isString().trim().notEmpty().withMessage("If provided, class name must be non-empty"),
    body("subjects").optional().isArray({ min: 1 }).withMessage("If provided, subjects must be non-empty array"),
    body("subjects.*").optional().isString().trim().notEmpty().withMessage("Subjects must be non-empty strings"),
    body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  ],
  updateClass
);

export default router;
