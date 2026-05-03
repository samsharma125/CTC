import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Progress from "@/models/Progress";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const progress = await Progress.find({ userId: id })
      .populate("playlistId", "name")
      .lean();

    return NextResponse.json(progress);
  } catch (err) {
    console.log("PROGRESS ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}