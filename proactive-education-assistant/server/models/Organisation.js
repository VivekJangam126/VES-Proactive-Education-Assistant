import mongoose from "mongoose";

const OrganisationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ["School", "NGO", "Trust"], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Organisation", OrganisationSchema);
