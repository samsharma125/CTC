import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// 🔐 GET USER FROM TOKEN
function getUser(req: any) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

export async function GET(req: any) {
  try {
    await connectDB();

    const user: any = getUser(req);

    // ❌ REMOVE THIS BLOCK
    // if (!user || user.role !== "teacher") { ... }

    // ✅ OPTIONAL: only check login (not role)
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const users = await User.find({
      role: "student",
    })
      .select("_id name points")
      .sort({ points: -1 })
      .limit(20);

    return NextResponse.json(users || []);
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}