import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Playlist from "@/models/Playlist";
import Notification from "@/models/Notification";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// 🔐 GET USER
function getUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

// =======================
// 🔥 GET PLAYLISTS
// =======================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user: any = getUser(req);

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    let playlists;

    // 👨‍🏫 TEACHER → OWN
    if (user.role === "teacher") {
      playlists = await Playlist.find({
        teacherId: String(user.id),
      }).sort({ createdAt: -1 });

      // 🔥 fallback
      if (!playlists || playlists.length === 0) {
        console.log("⚠️ No playlists for teacher:", user.id);

        playlists = await Playlist.find().sort({
          createdAt: -1,
        });
      }
    }

    // 🎓 STUDENT → ALL
    else {
      playlists = await Playlist.find().sort({
        createdAt: -1,
      });
    }

    return NextResponse.json(playlists || []);
  } catch (err) {
    console.error("GET PLAYLIST ERROR:", err);
    return NextResponse.json([], { status: 500 });
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

    const user: any = getUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const teacherId = String(user.id);

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
        { error: "Playlist already exists" },
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
      teacherId,
    });

    // 🔔 NOTIFICATIONS
    const students = await User.find({ role: "student" });

    if (students.length > 0) {
      const notifications = students.map((s) => ({
        userId: s._id.toString(),
        role: "student",
        type: "video",
        title: "New Playlist 🎥",
        message: `${title} added for ${subject}`,
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