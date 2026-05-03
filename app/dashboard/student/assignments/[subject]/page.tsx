"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function SubjectAssignments() {
  const { subject } = useParams();
  const router = useRouter();

  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/assignments").then((res) => {
      const filtered = res.data.filter(
        (a: any) => a.subject === subject
      );
      setAssignments(filtered);
    });
  }, [subject]);

  return (
    <div className="p-6 text-white space-y-6">

      <button
        onClick={() =>
          router.push("/dashboard/student/assignments")
        }
        className="text-blue-400"
      >
        ← Back
      </button>

      <h1 className="text-2xl text-pink-400">
        {subject} Assignments
      </h1>

      {assignments.length === 0 ? (
        <p>No assignments</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => (
            <div
              key={a._id}
              onClick={() =>
                router.push(
                  `/dashboard/student/assignments/${subject}/${a._id}`
                )
              }
              className="cursor-pointer bg-white/5 p-5 rounded-xl"
            >
              <h2>
                Assignment #{a._id.slice(-4)}
              </h2>
              <p>{a.questions.length} questions</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}