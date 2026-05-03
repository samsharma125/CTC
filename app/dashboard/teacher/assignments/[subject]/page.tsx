"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SubjectAssignments() {
  const params = useParams();
  const router = useRouter();

  const subject = Array.isArray(params?.subject)
    ? params.subject[0]
    : params?.subject;

  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (!subject) return;

    axios
      .get(`/api/assignments?subject=${subject}`)
      .then((res) => setAssignments(res.data));
  }, [subject]);

  return (
    <div className="p-6 text-white space-y-6">

      <button
        onClick={() => router.back()}
        className="text-blue-400"
      >
        ← Back
      </button>

      <h1 className="text-2xl text-pink-400">
        {subject} Assignments
      </h1>

      {assignments.map((a) => (
        <div
          key={a._id}
          onClick={() =>
            router.push(
              `/dashboard/teacher/assignments/${subject}/${a._id}`
            )
          }
          className="cursor-pointer bg-white/5 p-5 rounded-xl hover:bg-white/10"
        >
          Assignment #{a._id.slice(-4)}  
          ({a.questions.length} questions)
        </div>
      ))}
    </div>
  );
}