import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    date: { type: String, required: true }, // YYYY-MM-DD format
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Marks", MarksSchema);
