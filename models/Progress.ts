import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    playlistId: { type: String, required: true, index: true },

    // ✅ Track each lecture with date
    completedVideos: [
      {
        videoId: String,
        completedAt: Date,
      },
    ],

    lastVideoId: { type: String, default: "" },

    // ✅ NEW: Assignments tracking
    assignments: [
      {
        title: String,
        assignedAt: Date,
        submittedAt: Date,
        status: {
          type: String,
          enum: ["pending", "submitted"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

ProgressSchema.index(
  { userId: 1, playlistId: 1 },
  { unique: true }
);

export default mongoose.models.Progress ||
  mongoose.model("Progress", ProgressSchema);