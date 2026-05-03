import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ======================
// ✅ GET NOTIFICATIONS
// ======================
export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20);

  return NextResponse.json(notifications);
}

// ======================
// 🔥 MARK AS READ
// ======================
export async function PATCH(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await req.json();

  await Notification.findByIdAndUpdate(id, {
    isRead: true,
  });

  return NextResponse.json({ success: true });
}