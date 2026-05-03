"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SubjectPage() {
  const { subject } = useParams();
  const router = useRouter();

  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (!subject) return;

    axios.get("/api/playlists").then((res) => {
      const filtered = res.data.filter(
        (p: any) =>
          (p.subject || "")
            .toLowerCase()
            .trim() === (subject as string).toLowerCase().trim()
      );

      setPlaylists(filtered);
    });
  }, [subject]);

  return (
    <div className="p-6 text-white space-y-6">

      <h1 className="text-2xl font-bold capitalize">
        {subject} Playlists
      </h1>

      {playlists.length === 0 ? (
        <p className="text-gray-400">No playlists found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {playlists.map((p) => (
            <div
              key={p._id}
              onClick={() =>
                router.push(
                  `/dashboard/student/videos/${subject}/${p._id}`
                )
              }
              className="cursor-pointer bg-white/5 p-5 rounded-xl hover:scale-105 transition"
            >
              <h2>{p.title}</h2>
              <p className="text-sm text-gray-400 mt-2">
                {p.videos.length} videos
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}