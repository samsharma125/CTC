import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { password, token } = await req.json();

    if (!password || !token) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // 🔥 FIND USER BY RESET TOKEN
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // 🔐 HASH PASSWORD (VERY IMPORTANT)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 UPDATE PASSWORD + CLEAR TOKEN
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}