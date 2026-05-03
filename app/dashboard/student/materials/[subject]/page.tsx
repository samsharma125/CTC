"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function SubjectMaterials() {
  const params = useParams();
  const router = useRouter();

  const subject = Array.isArray(params?.subject)
    ? params.subject[0]
    : params?.subject;

  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    if (!subject) return; // ✅ prevent wrong API call

    axios
      .get(`/api/materials?subject=${subject}`)
      .then((res) => setMaterials(res.data))
      .catch(() => setMaterials([]));
  }, [subject]);

  return (
    <div className="p-6 text-white space-y-6">

      {/* BACK */}
      <button
        onClick={() => router.push("/dashboard/student/materials")}
        className="text-blue-400 hover:underline"
      >
        ← Back to Subjects
      </button>

      {/* TITLE */}
      <h1 className="text-2xl text-pink-400 capitalize">
        {subject} Materials
      </h1>

      {/* DATA */}
      {materials.length === 0 ? (
        <p className="text-gray-400">No materials found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {materials.map((m) => (
            <div
              key={m._id}
              className="bg-white/5 p-5 rounded-xl hover:bg-white/10 transition"
            >
              <h2 className="font-medium">{m.name}</h2>

              {/* IMAGE */}
              {/\.(jpg|jpeg|png|gif)$/i.test(m.url) && (
                <img
                  src={m.url}
                  className="w-full h-40 object-cover mt-3 rounded"
                />
              )}

              {/* PDF */}
              {m.url.endsWith(".pdf") && (
                <iframe
                  src={m.url}
                  className="w-full h-40 mt-3 rounded"
                />
              )}

              {/* LINK */}
              <a
                href={m.url}
                target="_blank"
                className="text-blue-400 block mt-3 hover:underline"
              >
                Open File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}