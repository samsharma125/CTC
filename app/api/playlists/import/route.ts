import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Playlist from "@/models/Playlist";
import Notification from "@/models/Notification";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// 🔐 GET USER
function getUserId(req: NextRequest) {
const token = req.cookies.get("token")?.value;
if (!token) return null;

try {
const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
return decoded.id; // ✅ string
} catch {
return null;
}
}

// =======================
// 🔥 GET ALL PLAYLISTS
// =======================
export async function GET(req: NextRequest) {
try {
await connectDB();


const playlists = await Playlist.find().sort({ createdAt: -1 });

return NextResponse.json(playlists);


} catch (err) {
console.error("GET PLAYLIST ERROR:", err);


return NextResponse.json(
  { error: "Failed to fetch playlists" },
  { status: 500 }
);


}
}

// =======================
// 🔥 CREATE PLAYLIST
// =======================
export async function POST(req: NextRequest) {
try {
await connectDB();


const { url, subject, title } = await req.json();

if (!url || !subject || !title) {
  return NextResponse.json(
    { error: "URL, subject, title required" },
    { status: 400 }
  );
}

const teacherId = getUserId(req);

if (!teacherId) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

// 🔥 Extract playlistId
const match = url.match(/[?&]list=([^&]+)/);
const playlistId = match ? match[1] : null;

if (!playlistId) {
  return NextResponse.json(
    { error: "Invalid playlist URL" },
    { status: 400 }
  );
}

const exists = await Playlist.findOne({ playlistId });

if (exists) {
  return NextResponse.json(
    { error: "Playlist already imported" },
    { status: 400 }
  );
}

const API_KEY = process.env.YOUTUBE_API_KEY;

let videos: any[] = [];
let nextPageToken = "";

do {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}&pageToken=${nextPageToken}`
  );

  const data = await res.json();

  const fetched = (data.items || [])
    .map((item: any) => {
      const videoId = item?.snippet?.resourceId?.videoId;
      if (!videoId) return null;

      return {
        videoId,
        title: item.snippet.title,
      };
    })
    .filter(Boolean);

  videos.push(...fetched);
  nextPageToken = data.nextPageToken || "";

} while (nextPageToken);

const playlist = await Playlist.create({
  title,
  subject,
  playlistId,
  videos,
  teacherId, // ✅ string
});

// 🔔 Notifications
const students = await User.find({ role: "student" });

if (students.length > 0) {
  const notifications = students.map((s) => ({
    userId: s._id.toString(),
    role: "student",
    type: "video",
    title: "New Lecture Playlist 🎥",
    message: `New playlist "${title}" added for ${subject}`,
  }));

  await Notification.insertMany(notifications);
}

return NextResponse.json(playlist);


} catch (err) {
console.error("POST PLAYLIST ERROR:", err);


return NextResponse.json(
  { error: "Import failed" },
  { status: 500 }
);


}
}
