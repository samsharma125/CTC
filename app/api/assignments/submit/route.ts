import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  // ❌ Only student allowed
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const userId = session.user.id;
  const { assignmentId, answers } = await req.json();

  // 🔥 CHECK if already submitted
  const existing = await Assignment.findOne({
    userId,
    assignmentId,
    isSubmission: true,
  });

  if (existing) {
    return NextResponse.json({ message: "Already submitted" });
  }

  // ✅ SAVE SUBMISSION
  await Assignment.create({
    userId,
    assignmentId,
    answers,
    isSubmission: true,
  });

  // 🔥 ADD POINTS HERE (THIS IS THE CORRECT PLACE)
  await User.findByIdAndUpdate(userId, {
    $inc: { points: 20 },
  });

  return NextResponse.json({ message: "Submitted successfully" });
}