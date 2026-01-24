import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD format
    status: { type: String, enum: ["PRESENT", "ABSENT"], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Unique constraint: one entry per student per day
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);
