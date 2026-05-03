import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email not registered" },
        { status: 404 }
      );
    }

    // 🔥 GENERATE TOKEN
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 🔥 ALWAYS OVERWRITE OLD TOKEN
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    console.log("🆕 NEW TOKEN SAVED:", resetToken);

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // 🔥 SEND EMAIL
    try {
      const data = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset Password 🔐",
        html: `
          <div style="font-family:sans-serif;">
            <h2>Reset Password</h2>
            <p>Click below to reset your password:</p>
            <a href="${resetLink}" style="color:blue;">
              Reset Password
            </a>
            <p>This link expires in 1 hour.</p>
          </div>
        `,
      });

      console.log("📧 EMAIL SENT:", data);

    } catch (err: any) {
      console.log("❌ EMAIL ERROR:", err);

      return NextResponse.json(
        { error: "Email sending failed" },
        { status: 500 }
      );
    }

    // ✅ ALSO RETURN LINK FOR DEBUG (VERY USEFUL)
    return NextResponse.json({
      message: "Reset link sent to your email",
      debugLink: resetLink, // remove in production
    });

  } catch (err) {
    console.log("❌ FORGOT ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}