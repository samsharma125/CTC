import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow public/internal routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // ✅ Only protect dashboard
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ❌ Not logged in
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signup"; // ✅ FIXED
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // ❗ STRICT ROLE (no fallback)
  const role = (token as any)?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  // 🔁 Redirect /dashboard → correct role dashboard
  if (pathname === "/dashboard") {
    return NextResponse.redirect(
      new URL(`/dashboard/${role}`, req.url)
    );
  }

  // ❌ Teacher route protection
  if (
    pathname.startsWith("/dashboard/teacher") &&
    role !== "teacher"
  ) {
    return NextResponse.redirect(
      new URL(`/dashboard/${role}`, req.url)
    );
  }

  // ❌ Student route protection
  if (
    pathname.startsWith("/dashboard/student") &&
    role !== "student"
  ) {
    return NextResponse.redirect(
      new URL(`/dashboard/${role}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};