import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Attempt from "@/models/Attempt";
import MaterialView from "@/models/MaterialView";

export async function GET(req: any) {
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

    const attempts = await Attempt.find({
      studentId: token.id,
    }).sort({ createdAt: 1 });

    const materials = await MaterialView.find({
      studentId: token.id,
    });

    return NextResponse.json({ attempts, materials });
  } catch (err) {
    console.log("ANALYTICS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}