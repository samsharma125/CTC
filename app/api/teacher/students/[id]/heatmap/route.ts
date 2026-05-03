import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Progress from "@/models/Progress";

// ✅ FIXED TYPE
type ParamsType = {
  params: Promise<{ id: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: ParamsType
) {
  try {
    await connectDB();

    // ✅ unwrap params
    const { id } = await params;

    const progress = await Progress.find({ userId: id });

    const heatmap: Record<string, number> = {};

    progress.forEach((p: any) => {
      if (!Array.isArray(p.completedVideos)) return;

      p.completedVideos.forEach((v: any) => {
        if (!v.completedAt) return;

        const date = new Date(v.completedAt)
          .toISOString()
          .split("T")[0];

        heatmap[date] = (heatmap[date] || 0) + 1;
      });
    });

    return NextResponse.json(heatmap);
  } catch (err) {
    console.log("HEATMAP ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}