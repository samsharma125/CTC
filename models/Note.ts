import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    playlistId: { type: String, required: true, index: true },
    videoId: { type: String, required: true },

    text: { type: String, required: true },
    timestamp: { type: Number, required: true }, // seconds

    // ✅ ADD THIS (you are already using it in frontend)
    isBookmark: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Optional: fast query for notes per user + playlist
NoteSchema.index({ userId: 1, playlistId: 1 });

export default mongoose.models.Note ||
  mongoose.model("Note", NoteSchema);