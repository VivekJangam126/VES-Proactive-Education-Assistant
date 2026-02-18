import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Student", StudentSchema);
