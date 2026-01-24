import express from "express";
import { body } from "express-validator";
import {
  adminLogin,
  adminRegister,
  teacherLogin,
  teacherRegister,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post(
  "/admin/register",
  [
    body("orgName").notEmpty().withMessage("Organisation name is required"),
    body("orgType").isIn(["School", "NGO", "Trust"]).withMessage("Invalid organisation type"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  adminRegister
);

router.post(
  "/admin/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  adminLogin
);

router.post(
  "/teacher/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("orgId").isMongoId().withMessage("Valid organisation id is required"),
  ],
  teacherRegister
);

router.post(
  "/teacher/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  teacherLogin
);

export default router;
