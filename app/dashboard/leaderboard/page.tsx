"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const { data: session } = useSession();

  const currentUserId = session?.user?.id;

  useEffect(() => {
    axios.get("/api/leaderboard").then((res) => {
      setUsers(res.data || []);
    });
  }, []);

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <div className="p-6 text-white space-y-6">

      <h1 className="text-3xl font-bold bg-gradient-to-r 
      from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        🏆 Leaderboard
      </h1>

      <div className="bg-gradient-to-br from-[#14052c] to-[#0c0128] 
      border border-white/10 rounded-2xl p-5 space-y-3">

        {users.map((user, i) => {
          const isMe = user._id === currentUserId;

          return (
            <div
              key={user._id}
              className={`flex justify-between items-center p-4 rounded-xl transition ${
                isMe
                  ? "bg-purple-500/20 border border-purple-500 scale-[1.02]"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">

                {/* RANK / MEDAL */}
                <span className="text-lg font-bold w-10">
                  {getMedal(i) || `#${i + 1}`}
                </span>

                {/* NAME */}
                <div>
                  <p className="font-medium">
                    {user.name}
                    {isMe && (
                      <span className="text-xs ml-2 text-purple-300">
                        (You)
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-gray-400">
                    Rank #{i + 1}
                  </p>
                </div>
              </div>

              {/* RIGHT (POINTS) */}
              <div className="text-right">
                <p className="text-green-400 font-semibold text-lg">
                  {user.points || 0}
                </p>
                <p className="text-xs text-gray-400">points</p>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}