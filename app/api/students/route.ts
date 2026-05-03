import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Submission from "@/models/Submission";

export async function GET() {
  await connectDB();

  const students = await User.find({ role: "student" });

  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      const submissions = await Submission.countDocuments({
        studentId: student._id,
      });

      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        createdAt: student.createdAt,
        submissions,
      };
    })
  );

  return NextResponse.json(studentsWithStats);
}