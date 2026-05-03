import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import jwt from "jsonwebtoken";

// 🔐 get user from cookie
function getUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

// ✅ POST → student sends feedback
export async function POST(req: NextRequest) {
  await connectDB();

  const user: any = getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, rating, subject } = await req.json();

  if (!message) {
    return NextResponse.json(
      { error: "Message required" },
      { status: 400 }
    );
  }

  const feedback = await Feedback.create({
    studentId: user.id,
    studentName: user.name,
    message,
    rating,
    subject,
  });

  return NextResponse.json(feedback);
}

// ✅ GET → teacher + student both supported
export async function GET(req: NextRequest) {
  await connectDB();

  const user: any = getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let feedbacks;

  if (user.role === "teacher") {
    // 🔥 teacher → all feedback
    feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(50);
  } else {
    // 🔥 student → only their feedback
    feedbacks = await Feedback.find({ studentId: user.id })
      .sort({ createdAt: -1 });
  }

  return NextResponse.json(feedbacks);
}