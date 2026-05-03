import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Attempt from "@/models/Attempt";

export async function POST(req: any) {
  try {
    await connectDB();

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const attempt = await Attempt.create({
      studentId: token.id,
      assignmentId: body.assignmentId,
      subject: body.subject,
      score: body.score,
      total: body.total,
    });

    return NextResponse.json(attempt);
  } catch (err) {
    console.log("ATTEMPT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save attempt" },
      { status: 500 }
    );
  }
}