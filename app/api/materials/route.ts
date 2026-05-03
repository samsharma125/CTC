import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getToken } from "next-auth/jwt";

import { connectDB } from "@/lib/db";
import Material from "@/models/Material";

import Notification from "@/models/Notification";
import User from "@/models/User";

// ======================
// ✅ GET MATERIALS
// ======================
export async function GET(req: any) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json([]);
    }

    let query: any = {};

    // ✅ STUDENT → all materials
    if (token.role === "student") {
      query = {};
    }

    // ✅ TEACHER → only their materials
    if (token.role === "teacher") {
      query.teacherId = token.id;
    }

    // 🔥 FIX: case-insensitive subject filter
    if (subject) {
      query.subject = {
        $regex: new RegExp(`^${subject}$`, "i"),
      };
    }

    const materials = await Material.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json(materials);
  } catch (err) {
    console.log(err);
    return NextResponse.json([]);
  }
}

// ======================
// ✅ POST MATERIAL
// ======================
export async function POST(req: any) {
  try {
    await connectDB();

    // ✅ Get NextAuth token
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

    // ✅ Only teacher allowed
    if (token.role !== "teacher") {
      return NextResponse.json(
        { error: "Only teachers can upload" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const subject = formData.get("subject") as string;

    if (!file || !subject) {
      return NextResponse.json(
        { error: "Missing file or subject" },
        { status: 400 }
      );
    }

    const teacherId = token.id; // ✅ IMPORTANT

    // 📦 Convert file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 📁 Upload directory
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 🧾 Safe filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    // 💾 Save in DB
    const newMaterial = await Material.create({
      name: file.name,
      url: `/uploads/${fileName}`,
      subject,
      teacherId,
    });

    // 🔔 Notifications
    const students = await User.find({ role: "student" });

    await Promise.all(
      students.map((s) =>
        Notification.create({
          userId: s._id,
          role: "student",
          type: "material",
          title: "New Study Material",
          message: `${subject} material uploaded`,
        })
      )
    );

    // ✅ SINGLE RETURN (FIXED)
    return NextResponse.json(newMaterial);

  } catch (err) {
    console.log("POST ERROR:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}