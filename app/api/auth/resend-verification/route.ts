import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.isVerified) {
    return NextResponse.json({ error: "Already verified" });
  }

  // 🔁 generate new token
  const verifyToken = crypto.randomBytes(32).toString("hex");
  user.verifyToken = verifyToken;
  await user.save();

  const verifyLink = `http://localhost:3000/verify-email?token=${verifyToken}`;

  await resend.emails.send({
  from: "CollegeToCareer <onboarding@resend.dev>",
    to: email,
    subject: "Verify your account",
  html: `
  <div style="font-family: Arial, sans-serif; background: #0c0128; padding: 40px; color: white;">
    
    <div style="max-width: 500px; margin: auto; background: #14033a; padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">

      <h2 style="text-align: center; margin-bottom: 10px;">
        🎓 CollegeToCareer
      </h2>

      <p style="text-align: center; color: #aaa; font-size: 14px;">
        Verify your email to continue
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyLink}" 
           style="
             display: inline-block;
             padding: 12px 24px;
             border-radius: 8px;
             text-decoration: none;
             font-weight: bold;
             background: linear-gradient(90deg, #ec4899, #8b5cf6);
             color: white;
           ">
          ✅ Verify Email
        </a>
      </div>

      <p style="font-size: 12px; color: #888; text-align: center;">
        If you did not request this, you can safely ignore this email.
      </p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid rgba(255,255,255,0.1);" />

      <p style="font-size: 11px; color: #666; text-align: center;">
        © ${new Date().getFullYear()} CollegeToCareer
      </p>

    </div>
  </div>
`
  });

  return NextResponse.json({ message: "Verification email sent again" });
}