import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
videoId: { type: String, required: true },
title: { type: String, required: true },
});

const PlaylistSchema = new mongoose.Schema(
{
title: { type: String, required: true },
subject: { type: String, required: true },
playlistId: { type: String, required: true },


// ✅ STRING (as per your DB)
teacherId: { type: String, required: true },

videos: [VideoSchema],


},
{ timestamps: true }
);

export default mongoose.models.Playlist ||
mongoose.model("Playlist", PlaylistSchema);
