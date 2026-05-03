import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import User from "@/models/User";
import Progress from "@/models/Progress";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type AssignmentProgress = {
  title: string;
  assignedAt: Date;
  submittedAt?: Date;
  status: "pending" | "submitted";
  daysTaken?: number | null;
};

// ======================
// ✅ GET SINGLE
// ======================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  const assignment = await Assignment.findById(id);

  return NextResponse.json(assignment);
}

// ======================
// ✅ SUBMIT
// ======================
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const userId = session.user.id;
  const { id } = await context.params;

  const { answers } = await req.json();

  const existing = await Assignment.findOne({
    userId,
    assignmentId: id,
    isSubmission: true,
  });

  if (existing) {
    return NextResponse.json({ message: "Already submitted" });
  }

  await Assignment.create({
    userId,
    assignmentId: id,
    answers,
    isSubmission: true,
  });

  await User.findByIdAndUpdate(userId, {
    $inc: { points: 20 },
  });

  // 🔥 Progress update
  const assignmentData = await Assignment.findById(id);

  if (assignmentData) {
    const progress = await Progress.findOne({
      userId,
      playlistId: assignmentData.subject,
    });

    if (progress && Array.isArray(progress.assignments)) {
      const existingAssignment = (progress.assignments as AssignmentProgress[]).find(
        (a) => a.title === assignmentData.subject
      );

      if (existingAssignment) {
        existingAssignment.status = "submitted";
        existingAssignment.submittedAt = new Date();

        if (
          existingAssignment.assignedAt &&
          existingAssignment.submittedAt
        ) {
          existingAssignment.daysTaken = Math.floor(
            (existingAssignment.submittedAt.getTime() -
              new Date(existingAssignment.assignedAt).getTime()) /
              (1000 * 60 * 60 * 24)
          );
        }
      }

      await progress.save();
    }
  }

  return NextResponse.json({ message: "Submitted successfully" });
}