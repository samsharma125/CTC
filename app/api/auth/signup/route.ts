import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password, role, secretCode } = await req.json();

    // ✅ normalize email
    const cleanEmail = email.trim().toLowerCase();

    // ❌ check existing user
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 🔐 teacher validation
    if (role === "teacher") {
      if (secretCode !== process.env.TEACHER_SECRET) {
        return NextResponse.json(
          { error: "Invalid teacher code" },
          { status: 400 }
        );
      }
    }

    // 🔒 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 create user (NO email verification now)
    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role,
      isVerified: true, // ✅ IMPORTANT (no email system)
    });

    return NextResponse.json(
      {
        message: "Signup successful",
        userId: user._id,
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("❌ SIGNUP ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}