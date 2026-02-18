import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    role: { type: String, default: "ADMIN", enum: ["ADMIN"] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Admin", AdminSchema);
