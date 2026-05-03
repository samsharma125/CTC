import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, role, secretCode } = await req.json();

    const cleanEmail = email.trim().toLowerCase();

    // 🔍 check existing user
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // 🔐 teacher check
      if (role === "teacher") {
        if (secretCode !== process.env.TEACHER_SECRET) {
          return NextResponse.json(
            { error: "Invalid teacher code" },
            { status: 400 }
          );
        }
      }

      // ✅ create new user
      user = await User.create({
        name,
        email: cleanEmail,
        role,
        isVerified: true,
      });
    }

    return NextResponse.json({
      message: "Login successful",
      role: user.role,
    });

  } catch (error) {
    console.log("❌ GOOGLE LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}