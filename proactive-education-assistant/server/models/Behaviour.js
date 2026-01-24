import mongoose from "mongoose";

const BehaviourSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    type: {
      type: String,
      enum: ["frequent_absence", "class_disengagement", "late_submission", "home_issues_reported", "disciplinary_notice"],
      required: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD format
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Behaviour", BehaviourSchema);
