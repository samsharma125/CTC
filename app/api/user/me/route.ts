import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { jwtVerify } from "jose";

export async function GET(req: any) {
  await connectDB();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: any = await jwtVerify(token, secret);

    const user = await User.findById(payload.id).select("name email"); // ✅ better

    // ❗ IMPORTANT CHECK
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name || "",
      email: user.email || "", // ✅ ensure not undefined
    });

  } catch (err) {
    console.log("JWT ERROR:", err);

    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}