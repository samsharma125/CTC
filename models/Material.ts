import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Material ||
  mongoose.model("Material", MaterialSchema);