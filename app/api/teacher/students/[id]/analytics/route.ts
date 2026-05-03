import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Progress from "@/models/Progress";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIX
) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX (IMPORTANT)

    const progress = await Progress.find({ userId: id });

    return NextResponse.json(progress);
  } catch (err) {
    console.log("ANALYTICS ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}