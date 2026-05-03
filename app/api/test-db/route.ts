import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "MongoDB Connected ✅" });
  } catch (error) {
    return NextResponse.json({ error: "DB Connection Failed ❌" });
  }
}