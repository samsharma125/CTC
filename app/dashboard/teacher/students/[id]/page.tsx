"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ ADD router

export default function StudentProfile() {
  const { id } = useParams();
  const router = useRouter(); // ✅ ADD

  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await fetch(`/api/teacher/students/${id}`);
      const data = await res.json();
      setStudent(data);
    };

    fetchStudent();
  }, [id]);

  if (!student) {
    return <p className="text-white p-6">Loading...</p>;
  }

  return (
    <div className="p-6 text-white">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">
          👤 {student.name}
        </h1>

        <p className="text-gray-400">{student.email}</p>

        <p className="mt-2 text-sm text-gray-500">
          Joined:{" "}
          {new Date(student.createdAt).toLocaleDateString()}
        </p>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            📄 Assignment Stats
          </h2>

          <p className="text-purple-300">
            Total Submissions: {student.submissions}
          </p>
        </div>

        {/* 🔥 ADD THIS BUTTON */}
        <div className="mt-6">
          <button
            onClick={() =>
              router.push(
                `/dashboard/teacher/students/${id}/analytics`
              )
            }
            className="px-5 py-2 bg-purple-500 hover:bg-purple-600 transition rounded-lg text-white font-semibold"
          >
            📊 View Full Analytics
          </button>
        </div>

      </div>
    </div>
  );
}