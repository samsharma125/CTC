"use client";

import { useEffect, useState } from "react";

export default function TeacherDashboard() {

  // 🔥 ADD THIS (state)
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  // 🔥 ADD THIS (fetch feedback)
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("/api/feedback");
        const data = await res.json();

        setFeedbacks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Feedback error:", err);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="bg-[#050014] min-h-screen text-white">

      <div className="p-8 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard 🧑‍🏫</h1>
          <p className="text-gray-400 mt-2">
            Manage courses, students and assignments 🚀
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-400 text-sm">Courses Created</h2>
            <p className="text-2xl font-bold mt-2">4</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-400 text-sm">Total Students</h2>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-400 text-sm">Assignments Given</h2>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>

        </div>

        {/* ACTIONS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl cursor-pointer">
              ➕ Create Course
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-xl cursor-pointer">
              📝 Create Assignment
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl cursor-pointer">
              👨‍🎓 Manage Students
            </div>

          </div>
        </div>

        {/* 🔥 ADD THIS NEW SECTION (FEEDBACK) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Student Feedback 💬
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">

            {feedbacks.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No feedback yet
              </p>
            ) : (
              feedbacks.map((f, i) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold">
                      {f.studentName}
                    </h3>

                    {f.rating && (
                      <span className="text-yellow-400 text-sm">
                        ⭐ {f.rating}/5
                      </span>
                    )}
                  </div>

                  {f.subject && (
                    <p className="text-xs text-purple-400 mt-1">
                      {f.subject}
                    </p>
                  )}

                  <p className="text-gray-300 mt-2 text-sm">
                    {f.message}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(f.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
}