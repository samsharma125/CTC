import mongoose from "mongoose";

const MaterialViewSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    materialId: { type: String, required: true },
    subject: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.MaterialView ||
  mongoose.model("MaterialView", MaterialViewSchema);