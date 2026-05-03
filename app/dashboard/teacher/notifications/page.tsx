"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/notifications")
      .then((res) => setNotifications(res.data || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 text-white max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          👨‍🏫 Teacher Notifications
        </h1>
        <p className="text-gray-400 text-sm">
          New students and activity updates
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400">Loading...</p>
      )}

      {/* EMPTY */}
      {!loading && notifications.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No notifications yet 📭
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">

        {notifications.map((n: any, i: number) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${
              n.isRead
                ? "bg-white/5 border-white/5"
                : "bg-green-500/10 border-green-500/30"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-white">
                {n.title}
              </p>

              {!n.isRead && (
                <span className="text-xs bg-green-500/20 px-2 py-1 rounded">
                  NEW
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400 mt-1">
              {n.message}
            </p>

            {n.createdAt && (
              <p className="text-xs text-gray-500 mt-2">
                🕒 {new Date(n.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}