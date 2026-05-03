"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VideosPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/playlists").then((res) => {
      setPlaylists(res.data || []);
    });
  }, []);

  const subjects = [
    ...new Set(
      playlists.map((p) => (p.subject || "").trim())
    ),
  ];

  return (
    <div className="p-6 text-white space-y-6">

      <h1 className="text-3xl font-bold text-pink-500">
        🎥 Video Lectures
      </h1>

      {subjects.length === 0 ? (
        <p className="text-gray-400">No subjects found</p>
      ) : (
        <div className="grid md:grid-cols-4 gap-5">
          {subjects.map((s) => (
            <div
              key={s}
              onClick={() =>
                router.push(`/dashboard/student/videos/${s}`)
              }
              className="cursor-pointer bg-white/5 p-5 rounded-xl hover:scale-105 transition"
            >
              <h2 className="text-lg">{s}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}