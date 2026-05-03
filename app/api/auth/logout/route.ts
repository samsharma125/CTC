import { NextResponse } from "next/server";

export async function POST() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = NextResponse.redirect(new URL("/signup", baseUrl));

  // ✅ CLEAR COOKIE PROPERLY
  res.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/", // 🔥 FIXED (global)
  });

  return res;
}