import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  assignmentId: String,
  answers: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Submission ||
  mongoose.model("Submission", SubmissionSchema);