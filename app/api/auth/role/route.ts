import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;

  const role = url.searchParams.get("role") || "student";
  const code = url.searchParams.get("code");

  // ❌ Wrong teacher code
  if (role === "teacher" && code !== "teach123") {
    return NextResponse.json(
      { error: "wrong-code" },
      { status: 400 }
    );
  }

  // ✅ Just set cookie (NO redirect)
  const res = NextResponse.json({ success: true });

  res.cookies.set("role", role, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}