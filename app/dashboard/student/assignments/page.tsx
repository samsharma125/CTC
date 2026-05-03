"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const subjects = ["DSA", "SQL", "JS", "Networking"];

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/assignments").then((res) => {
      setAssignments(res.data);
    });
  }, []);

  return (
    <div className="p-6 text-white space-y-8">

      <h1 className="text-3xl font-bold text-pink-500">
        📘 Assignments
      </h1>

      <div className="grid md:grid-cols-4 gap-5">
        {subjects.map((sub) => {
          const count = assignments.filter(
            (a) => a.subject === sub
          ).length;

          return (
            <div
              key={sub}
              onClick={() =>
                router.push(
                  `/dashboard/student/assignments/${sub}`
                )
              }
              className="cursor-pointer p-5 rounded-xl bg-white/5 border border-white/10 hover:scale-105"
            >
              <h2>{sub}</h2>
              <p>{count} assignments</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}