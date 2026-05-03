import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    playlistId: { type: String, required: true, index: true },

    completedVideos: { type: [String], default: [] },
    lastVideoId: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate progress per user + playlist
ProgressSchema.index(
  { userId: 1, playlistId: 1 },
  { unique: true }
);

export default mongoose.models.Progress ||
  mongoose.model("Progress", ProgressSchema);