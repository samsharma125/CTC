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
      setMaterials(res.data);
    });
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">
        📚 My Materials
      </h1>

      <div className="grid md:grid-cols-4 gap-6">
        {subjects.map((sub) => {
          const count = materials.filter(
            (m) => m.subject === sub
          ).length;

          return (
            <div
              key={sub}
              onClick={() =>
                router.push(
                  `/dashboard/teacher/materials/${sub}`
                )
              }
              className="cursor-pointer bg-purple-500/10 p-6 rounded-xl hover:scale-105"
            >
              <h2>{sub}</h2>
              <p>{count} materials</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}