import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";

export async function GET() {
  await connectDB();
  const data = await Submission.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const { assignmentId, answers } = await req.json();

    const submission = await Submission.create({
      assignmentId,
      answers,
    });

    return NextResponse.json(submission);
  } catch (err) {
    return NextResponse.json(
      { error: "Submission failed" },
      { status: 500 }
    );
  }
}