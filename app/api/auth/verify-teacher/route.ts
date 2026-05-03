import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, secretCode } = await req.json();

  if (!email || !secretCode) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  if (secretCode !== process.env.TEACHER_SECRET_CODE) {
    return NextResponse.json(
      { error: "❌ Wrong secret code" },
      { status: 401 }
    );
  }

  // ✅ Create temporary token (VERY IMPORTANT)
  const tempToken = jwt.sign(
    { email, role: "teacher" },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" }
  );

  return NextResponse.json({ tempToken });
}