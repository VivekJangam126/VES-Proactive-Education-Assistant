import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subjects: {
      type: [String],
      required: true,
      validate: {
        validator: (s) => Array.isArray(s) && s.length > 0,
        message: "Subjects must be a non-empty array",
      },
    },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent duplicate class names per organisation
ClassSchema.index({ name: 1, orgId: 1 }, { unique: true });

export default mongoose.model("Class", ClassSchema);
