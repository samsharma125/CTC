import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const AssignmentSchema = new mongoose.Schema({
  subject: String,
  questions: [QuestionSchema],

  // ✅ teacher info
  teacherEmail: String,

  // 🔥 ADD THESE (for student submissions)
  userId: {
    type: String, // student id
  },

  assignmentId: {
    type: String, // original assignment reference
  },

  answers: {
    type: [String], // student answers
  },

  isSubmission: {
    type: Boolean,
    default: false,
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", AssignmentSchema);