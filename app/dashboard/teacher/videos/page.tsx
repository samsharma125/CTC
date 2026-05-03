"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/page";

export default function SubjectsPage() {
const [playlists, setPlaylists] = useState<any[]>([]);
const router = useRouter();

useEffect(() => {
axios.get("/api/playlists").then((res) => {
setPlaylists(res.data || []);
});
}, []);

const subjects = [...new Set(playlists.map((p) => p.subject))];

return (
<> <Navbar />


  <div className="min-h-screen bg-[#07001a] text-white p-6">

    <h1 className="text-2xl font-bold mb-6">
      📚 Subjects
    </h1>

    <div className="grid md:grid-cols-3 gap-6">

      {subjects.map((subject) => (
        <div
          key={subject}
          onClick={() =>
            router.push(`/dashboard/teacher/videos/${subject}`)
          }
          className="cursor-pointer bg-white/5 p-8 rounded-xl hover:bg-white/10 text-center"
        >
          <h2 className="text-xl font-semibold">
            {subject}
          </h2>
        </div>
      ))}

    </div>

  </div>
</>


);
}
