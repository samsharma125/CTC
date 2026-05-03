import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import jwt from "jsonwebtoken";

// 🔐 Read user from JWT cookie
function getUserId(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id as string;
  } catch (err) {
    console.log("JWT ERROR:", err);
    return null;
  }
}

// ✅ GET: fetch notes for playlist
export async function GET(req: NextRequest) {
  await connectDB();

  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const playlistId = searchParams.get("playlistId");

  if (!playlistId) {
    return NextResponse.json({ error: "playlistId required" }, { status: 400 });
  }

  const notes = await Note.find({ userId, playlistId }).sort({
    createdAt: -1,
  });

  return NextResponse.json(notes);
}

// ✅ POST: create note / bookmark
export async function POST(req: NextRequest) {
  await connectDB();

  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { playlistId, videoId, text, timestamp, isBookmark } =
    await req.json();

  if (!playlistId || !videoId || !text) {
    return NextResponse.json(
      { error: "playlistId, videoId and text required" },
      { status: 400 }
    );
  }

  const note = await Note.create({
    userId,
    playlistId,
    videoId,
    text,
    timestamp: typeof timestamp === "number" ? timestamp : 0,
    isBookmark: !!isBookmark,
  });

  return NextResponse.json(note);
}