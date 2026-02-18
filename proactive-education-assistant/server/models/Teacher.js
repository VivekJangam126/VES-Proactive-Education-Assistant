import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId }],
    subjects: { type: [String], default: [] },
    role: { type: String, default: "TEACHER", enum: ["TEACHER"] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Teacher", TeacherSchema);
