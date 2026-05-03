import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import jwt from "jsonwebtoken";

function getUserId(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id;
  } catch {
    return null;
  }
}

// ✅ GET NOTES
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const playlistId = searchParams.get("playlistId");
    const videoId = searchParams.get("videoId");

    if (!playlistId) {
      return NextResponse.json(
        { error: "playlistId is required" },
        { status: 400 }
      );
    }

    const query: any = { userId, playlistId };
    if (videoId) query.videoId = videoId;

    const notes = await Note.find(query).sort({ createdAt: -1 });

    return NextResponse.json(notes);
  } catch (err) {
    console.error("GET NOTES ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// ✅ ADD NOTE
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { playlistId, videoId, text, timestamp, isBookmark } =
      await req.json();

    if (!playlistId || !videoId || timestamp === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const note = await Note.create({
      userId,
      playlistId,
      videoId,
      text: text || "",
      timestamp,
      isBookmark: isBookmark || false,
    });

    return NextResponse.json(note);
  } catch (err) {
    console.error("ADD NOTE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save note" },
      { status: 500 }
    );
  }
}