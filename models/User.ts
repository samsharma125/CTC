import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },

    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    // 🔥 ADD THIS
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);