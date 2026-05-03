import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    // ❌ No token
    if (!token) {
      return NextResponse.json(
        { error: "Token missing" },
        { status: 400 }
      );
    }

    
    const user = await User.findOne({ verifyToken: token });

    // ❌ Invalid token
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // ✅ Already verified
    if (user.isVerified) {
      return NextResponse.json(
        { message: "Already verified" },
        { status: 200 }
      );
    }

    // ✅ Verify user
    user.isVerified = true;
    user.verifyToken = null;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}