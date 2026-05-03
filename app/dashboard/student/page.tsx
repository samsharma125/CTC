"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

export default function StudentDashboard() {

  // 📈 Weekly Points
  const weeklyData = [
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 20 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: 10 },
  ];

  // 📊 Activity Breakdown
  const activityData = [
    { name: "Practice", value: 80 },
    { name: "Assignments", value: 70 },
    { name: "Tests", value: 50 },
  ];

  // 🌊 Growth Trend
  const growthData = weeklyData;



  
  return (
    <div className="bg-[#050014] min-h-screen text-white">

      <div className="p-8 space-y-8">

        {/* 🔥 HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard 🎓</h1>
          <p className="text-gray-400 mt-2">
            Welcome back! Track your progress and stay ahead 🚀
          </p>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-400 text-sm">Courses Enrolled</h2>
            <p className="text-2xl font-bold mt-2">5</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-400 text-sm">Assignments Pending</h2>
            <p className="text-2xl font-bold mt-2">3</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-400 text-sm">Leaderboard Rank</h2>
            <p className="text-2xl font-bold mt-2">#12</p>
          </div>

        </div>

        {/* ⚡ QUICK ACTIONS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl cursor-pointer hover:opacity-90">
              📚 View Courses
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-xl cursor-pointer hover:opacity-90">
              📝 Submit Assignment
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl cursor-pointer hover:opacity-90">
              🏆 View Leaderboard
            </div>

          </div>
        </div>

        {/* 📈 PERFORMANCE GRAPHS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Performance Insights 📊
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* 📈 LINE CHART */}
            <div className="bg-gradient-to-br from-[#0f172a] to-[#020617]
            p-5 rounded-xl border border-white/10">

              <p className="mb-3 text-sm text-gray-300">
                📈 Weekly Points
              </p>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData}>
                  <XAxis dataKey="day" stroke="#aaa" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 📊 BAR CHART */}
            <div className="bg-gradient-to-br from-[#0f172a] to-[#020617]
            p-5 rounded-xl border border-white/10">

              <p className="mb-3 text-sm text-gray-300">
                📊 Activity Breakdown
              </p>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityData}>
                  <XAxis dataKey="name" stroke="#aaa" />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#22c55e"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 🌊 AREA CHART */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#0f172a] to-[#020617]
            p-5 rounded-xl border border-white/10">

              <p className="mb-3 text-sm text-gray-300">
                📈 Growth Trend
              </p>

              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={growthData}>
                  <XAxis dataKey="day" stroke="#aaa" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

        {/* 📜 RECENT ACTIVITY */}
        {/* <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">

            <p className="text-gray-300">
              ✅ Assignment "React Basics" submitted
            </p>

            <p className="text-gray-300">
              📚 New course "Cyber Security Intro" added
            </p>

            <p className="text-gray-300">
              🏆 You moved up to rank #12
            </p>

          </div>
        </div> */}

      </div>
      

    </div>
    
  );
}