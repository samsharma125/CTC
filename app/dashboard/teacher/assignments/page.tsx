"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/assignments").then((res) => {
      setAssignments(res.data || []);
    });
  }, []);

  const subjects = [...new Set(assignments.map((a) => a.subject))];

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">📘 Assignments</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub}
            onClick={() =>
              router.push(`/dashboard/teacher/assignments/${sub}`)
            }
            className="cursor-pointer bg-gradient-to-br 
            from-[#14033a] to-[#050014] p-6 rounded-xl 
            hover:scale-105 transition"
          >
            <h2 className="text-lg font-semibold">{sub}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}