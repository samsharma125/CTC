import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: String, // who will receive it
    role: String,   // student / teacher

    type: String,   // assignment | video | material | student

    title: String,
    message: String,

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);