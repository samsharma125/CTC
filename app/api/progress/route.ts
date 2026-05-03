import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Progress from "@/models/Progress";
import jwt from "jsonwebtoken";
import User from "@/models/User"; // 🔥 add at top

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

// ✅ GET: fetch progress by playlist
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

  const progress = await Progress.findOne({ userId, playlistId });

  return NextResponse.json(progress || {});
}

// ✅ POST: create/update progress
export async function POST(req: NextRequest) {
  await connectDB();

  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { playlistId, videoId, completed } = await req.json();

  if (!playlistId || !videoId) {
    return NextResponse.json(
      { error: "playlistId and videoId required" },
      { status: 400 }
    );
  }

  // find existing
  let progress = await Progress.findOne({ userId, playlistId });

  if (!progress) {
    progress = await Progress.create({
      userId,
      playlistId,
      completedVideos: completed ? [videoId] : [],
      lastVideoId: videoId,
    });
  } else {
    // add to completed if needed
   if (completed && !progress.completedVideos.includes(videoId)) {
  progress.completedVideos.push(videoId);

  // 🔥 ADD POINTS
  await User.findByIdAndUpdate(userId, {
    $inc: { points: 10 },
  });
}

    progress.lastVideoId = videoId;
    await progress.save();
  }

  return NextResponse.json(progress);
}