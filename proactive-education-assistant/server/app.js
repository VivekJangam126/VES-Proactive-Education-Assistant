import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import organisationRoutes from "./routes/organisation.routes.js";
import classRoutes from "./routes/class.routes.js";
import studentRoutes from "./routes/student.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import marksRoutes from "./routes/marks.routes.js";
import behaviourRoutes from "./routes/behaviour.routes.js";
import riskRoutes from "./routes/risk.routes.js";

dotenv.config();

const app = express();

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/organisations", organisationRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/behaviour", behaviourRoutes);
app.use("/api/risk", riskRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;
