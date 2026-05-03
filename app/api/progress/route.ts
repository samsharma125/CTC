import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Progress from "@/models/Progress";
import jwt from "jsonwebtoken";
import User from "@/models/User";

// 🔐 Get user from JWT
function getUserId(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id;
  } catch (err) {
    console.log("JWT ERROR:", err);
    return null;
  }
}

// ======================
// ✅ GET PROGRESS
// ======================
export async function GET(req: NextRequest) {
  await connectDB();

  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const playlistId = searchParams.get("playlistId");

  // 🔥 ADD THIS (for dashboard charts)
  if (!playlistId) {
    const allProgress = await Progress.find({ userId });

    return NextResponse.json(allProgress);
  }

  // ✅ EXISTING LOGIC (UNCHANGED)
  const progress = await Progress.findOne({ userId, playlistId });

  return NextResponse.json({
    completedVideos: progress?.completedVideos || [],
    lastVideoId: progress?.lastVideoId || "",
    totalCompleted: progress?.completedVideos?.length || 0,
    startedAt: progress?.startedAt || null,
  });
}

// ======================
// ✅ POST UPDATE PROGRESS
// ======================
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

  let progress = await Progress.findOne({ userId, playlistId });

  // 🆕 CREATE
  if (!progress) {
    progress = await Progress.create({
      userId,
      playlistId,
      completedVideos: completed
        ? [
            {
              videoId,
              completedAt: new Date(),
            },
          ]
        : [],
      lastVideoId: videoId,
    });

    return NextResponse.json(progress);
  }

  // 🔁 UPDATE
  if (completed) {
    const alreadyExists = progress.completedVideos.some(
      (v: any) => v.videoId === videoId
    );

    if (!alreadyExists) {
      progress.completedVideos.push({
        videoId,
        completedAt: new Date(),
      });

      // 🎯 add reward points
      await User.findByIdAndUpdate(userId, {
        $inc: { points: 10 },
      });
    }
  }

  progress.lastVideoId = videoId;
  await progress.save();

  return NextResponse.json(progress);
}