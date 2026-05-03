// app/api/set-role/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const { email, role, secretCode } = await req.json();

  if (role === "teacher") {
    if (secretCode !== process.env.TEACHER_SECRET) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
  }

  const user = await User.findOneAndUpdate(
    { email },
    { role },
    { new: true }
  );

  return NextResponse.json({ message: "Role updated", role: user.role });
}