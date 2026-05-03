import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import MaterialView from "@/models/MaterialView";

export async function POST(req: any) {
  try {
    await connectDB();

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await MaterialView.create({
      studentId: token.id,
      materialId: body.materialId,
      subject: body.subject,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("MATERIAL VIEW ERROR:", err);
    return NextResponse.json(
      { error: "Failed to track material" },
      { status: 500 }
    );
  }
}