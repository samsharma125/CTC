import mongoose from "mongoose";

const AttemptSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    assignmentId: { type: String, required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Attempt ||
  mongoose.model("Attempt", AttemptSchema);