import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Playlist from "@/models/Playlist";

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    await connectDB();

    // ✅ FIX HERE
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(playlist);
  } catch (err) {
    console.error("GET PLAYLIST BY ID ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}