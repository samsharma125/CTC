import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ======================
// ✅ GET (FETCH ASSIGNMENT)
// ======================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(assignment);
  } catch (err) {
    console.log("GET ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ======================
// ✅ POST (SUBMIT ASSIGNMENT + POINTS)
// ======================
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const { id } = await context.params;

    const { answers } = await req.json();

    if (!id || !answers) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // 🔥 CHECK IF ALREADY SUBMITTED
    const existing = await Assignment.findOne({
      userId,
      assignmentId: id,
      isSubmission: true,
    });

    if (existing) {
      return NextResponse.json({
        message: "Already submitted",
      });
    }

    // ✅ SAVE SUBMISSION
    await Assignment.create({
      userId,
      assignmentId: id,
      answers,
      isSubmission: true,
    });

    // 🔥 ADD POINTS
    await User.findByIdAndUpdate(userId, {
      $inc: { points: 20 },
    });

    return NextResponse.json({
      message: "Submitted successfully",
    });

  } catch (err) {
    console.log("POST ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}