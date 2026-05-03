import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ======================
// ✅ CREATE (TEACHER)
// ======================
export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { subject, questions } = await req.json();

  const assignment = await Assignment.create({
    subject,
    questions,
    teacherEmail: session.user.email,
  });

  // 🔔 Notifications
  const students = await User.find({ role: "student" });

  if (students.length > 0) {
    const notifications = students.map((s) => ({
      userId: s._id.toString(),
      role: "student",
      type: "assignment",
      title: "New MCQ Assignment 📚",
      message: `New MCQ added for ${subject}`,
    }));

    await Notification.insertMany(notifications);
  }

  return NextResponse.json(assignment);
}

// ======================
// ✅ GET ALL (STUDENT)
// ======================
export async function GET() {
  await connectDB();

  const assignments = await Assignment.find().sort({ createdAt: -1 });

  return NextResponse.json(assignments);
}