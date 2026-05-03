import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    studentId: String,
    studentName: String,

    message: String,
    rating: Number, // optional (1–5)

    // optional: link to subject / playlist
    subject: String,
  },
  { timestamps: true }
);

export default mongoose.models.Feedback ||
  mongoose.model("Feedback", FeedbackSchema);