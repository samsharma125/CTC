"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function LeaderboardPage() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/leaderboard").then((res) => {
      setStudents(res.data || []);
    });
  }, []);

  const getMedal = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `#${i + 1}`;
  };

  return (
    <div className="p-6 text-white bg-[#07001a] min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r 
      from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        🏆 Leaderboard
      </h1>

      {/* EMPTY STATE */}
      {students.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          No leaderboard data yet
        </div>
      ) : (

        <div className="space-y-4">

          {students.map((s, i) => (
            <div
              key={s._id || i}
              className={`flex justify-between items-center p-4 rounded-xl border transition
              ${
                i === 0
                  ? "bg-yellow-500/10 border-yellow-400"
                  : i === 1
                  ? "bg-gray-400/10 border-gray-300"
                  : i === 2
                  ? "bg-orange-500/10 border-orange-400"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* RANK / MEDAL */}
                <span className="text-lg font-bold w-10">
                  {getMedal(i)}
                </span>

                {/* NAME */}
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-gray-400">
                    Rank #{i + 1}
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-green-400 font-bold text-lg">
                  {s.points || 0}
                </p>
                <p className="text-xs text-gray-400">
                  points
                </p>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}