import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { jwtVerify } from "jose";

export async function PUT(req: any) {
  await connectDB();

  // ✅ CORRECT WAY
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload }: any = await jwtVerify(token, secret);

    const { name } = await req.json();

    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.name = name;
    await user.save();

    return NextResponse.json({
      message: "Name updated successfully",
      newName: user.name,
    });

  } catch (err) {
    console.log("JWT ERROR:", err);

    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}