"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function SubjectMaterials() {
  const { subject } = useParams();
  const router = useRouter();

  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`/api/materials?subject=${subject}`)
      .then((res) => setMaterials(res.data));
  }, [subject]);

  return (
    <div className="p-6 text-white">
      <button onClick={() => router.back()}>
        ← Back
      </button>

      <h1 className="text-2xl mb-6">
        {subject} Materials
      </h1>

      {materials.length === 0 ? (
        <p>No materials</p>
      ) : (
        materials.map((m) => (
          <div
            key={m._id}
            className="p-4 bg-white/5 mb-3 rounded"
          >
            <h2>{m.name}</h2>

            <a
              href={m.url}
              target="_blank"
              className="text-blue-400"
            >
              Open
            </a>
          </div>
        ))
      )}
    </div>
  );
}