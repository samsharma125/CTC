"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/notifications")
      .then((res) => {
        setNotifications(res.data || []);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          🔔 Notifications
        </h1>
        <p className="text-gray-400 text-sm">
          Stay updated with your activity
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-gray-400">
          Loading notifications...
        </div>
      )}

      {/* EMPTY */}
      {!loading && notifications.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          📭 No notifications yet
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">

        {notifications.map((n: any, i: number) => (
          <div
            key={i}
            className={`p-4 rounded-xl border transition ${
              n.isRead
                ? "bg-white/5 border-white/5"
                : "bg-purple-500/10 border-purple-500/20"
            }`}
          >
            {/* TOP */}
            <div className="flex justify-between items-start">
              <p className="font-semibold text-white">
                {n.title}
              </p>

              {!n.isRead && (
                <span className="w-2 h-2 bg-purple-400 rounded-full mt-1" />
              )}
            </div>

            {/* MESSAGE */}
            <p className="text-sm text-gray-400 mt-1">
              {n.message}
            </p>

            {/* TIME */}
            {n.createdAt && (
              <p className="text-xs text-gray-500 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}