"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/page";

export default function SubjectPlaylistsPage() {
const params = useParams();
const router = useRouter();
const subject = params?.subject as string;

const [playlists, setPlaylists] = useState<any[]>([]);

useEffect(() => {
axios.get("/api/playlists").then((res) => {
const filtered = res.data.filter(
(p: any) => p.subject === subject
);
setPlaylists(filtered);
});
}, [subject]);

return (
<> <Navbar />


  <div className="min-h-screen bg-[#07001a] text-white p-6">

    <h1 className="text-2xl font-bold mb-6">
      🎥 {subject} Playlists
    </h1>

    <button
      onClick={() => router.push("/dashboard/teacher/videos")}
      className="mb-4 text-blue-400"
    >
      ← Back
    </button>

    <div className="grid md:grid-cols-3 gap-4">

      {playlists.map((playlist) => (
        <div
          key={playlist._id}
          onClick={() =>
            router.push(
              `/dashboard/teacher/videos/${subject}/${playlist._id}`
            )
          }
          className="cursor-pointer bg-white/5 p-5 rounded-xl hover:bg-white/10"
        >
          <h3>{playlist.title}</h3>
          <p className="text-sm text-gray-400">
            {playlist.videos?.length} lectures
          </p>
        </div>
      ))}

    </div>

  </div>
</>


);
}
