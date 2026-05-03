"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function AssignmentDetail() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const subject = Array.isArray(params?.subject)
    ? params.subject[0]
    : params?.subject;

  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/assignments/${id}`)
      .then((res) => {
        setAssignment(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load assignment");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-white p-6">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-400 p-6">{error}</p>;
  }

  if (!assignment) {
    return <p className="text-red-400 p-6">Assignment not found</p>;
  }

  if (!assignment.questions || assignment.questions.length === 0) {
    return <p className="text-gray-400 p-6">No questions available</p>;
  }

  return (
    <div className="p-6 text-white min-h-screen space-y-6">

      {/* 🔙 BACK */}
      <button
        onClick={() => router.back()}
        className="text-blue-400 hover:underline"
      >
        ← Back
      </button>

      {/* 🧠 HEADER */}
      <h1 className="text-2xl font-bold text-pink-400">
        📝 {subject} - Assignment #{assignment._id.slice(-4)}
      </h1>

      {/* QUESTIONS */}
      <div className="space-y-6">
        {assignment.questions.map((q: any, i: number) => (
          <div
            key={i}
            className="bg-gradient-to-br from-[#14033a] to-[#050014] 
            border border-white/10 rounded-xl p-5"
          >
            {/* QUESTION */}
            <p className="font-semibold mb-4">
              Q{i + 1}. {q.question}
            </p>

            {/* OPTIONS */}
            <div className="space-y-2">
              {q.options.map((opt: string, oi: number) => {
                const isCorrect = opt === q.correctAnswer;

                return (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                      isCorrect
                        ? "border-green-400 bg-green-400/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={isCorrect}
                      readOnly
                      className="accent-green-500"
                    />
                    {opt}
                  </label>
                );
              })}
            </div>

            {/* ✅ CORRECT ANSWER */}
            <p className="mt-3 text-sm text-green-400">
              ✔ Correct Answer: {q.correctAnswer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}