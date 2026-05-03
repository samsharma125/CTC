"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const subjects = ["DSA", "SQL", "JS", "Networking"];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/materials").then((res) => {
      setMaterials(res.data || []);
    });
  }, []);

  return (
    <div className="p-6 text-white space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-pink-500">
          📚 Study Materials
        </h1>
        <p className="text-gray-400 text-sm">
          Access notes & resources uploaded by teachers
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        {subjects.map((s) => {
          const count = materials.filter(
            (m) => m.subject === s
          ).length;

          return (
            <div
              key={s}
              onClick={() =>
                router.push(
                  `/dashboard/student/materials/${s}`
                )
              }
              className="cursor-pointer bg-white/5 border border-white/10 rounded-xl p-5 hover:scale-105"
            >
              <h2>{s}</h2>
              <p className="text-gray-400 text-sm">
                {count} materials
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}