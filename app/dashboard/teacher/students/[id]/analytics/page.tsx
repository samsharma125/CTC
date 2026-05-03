"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function StudentAnalytics() {

  // 📈 activity
  const lineData = [
    { day: "Mon", value: 10 },
    { day: "Tue", value: 30 },
    { day: "Wed", value: 25 },
    { day: "Thu", value: 60 },
    { day: "Fri", value: 40 },
    { day: "Sat", value: 80 },
  ];

  // 🍩 donut
  const pieData = [
    { name: "Completed", value: 65 },
    { name: "Remaining", value: 35 },
  ];

  const COLORS = ["#8b5cf6", "#1f2937"];

  return (
    <div className="p-6 text-white space-y-6 bg-[#050014] min-h-screen">

      {/* 🔥 HEADER */}
      <h1 className="text-2xl font-bold">
        📊 Student Performance Dashboard
      </h1>

      {/* TOP SECTION */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* 📈 LINE */}
        <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="mb-4 text-gray-300">Activity</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="day" stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🍩 DONUT */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
          <h2 className="mb-4 text-gray-300">Completion</h2>

          <PieChart width={200} height={200}>
            <Pie
              data={pieData}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>

          <p className="text-2xl font-bold -mt-28">65%</p>
        </div>

      </div>

      {/* 📊 STATS */}
      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white/5 p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Assignments</p>
          <h2 className="text-xl font-bold">12</h2>
        </div>

        <div className="bg-white/5 p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Lectures</p>
          <h2 className="text-xl font-bold">45</h2>
        </div>

        <div className="bg-white/5 p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Tests</p>
          <h2 className="text-xl font-bold">8</h2>
        </div>

        <div className="bg-white/5 p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Points</p>
          <h2 className="text-xl font-bold">340</h2>
        </div>

      </div>

      {/* 📚 SUBJECT PROGRESS */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">

        <h2 className="mb-4">📚 Subject Performance</h2>

        {["DSA", "SQL", "JS"].map((sub, i) => (
          <div key={i} className="mb-4">

            <div className="flex justify-between text-sm mb-1">
              <span>{sub}</span>
              <span>{60 + i * 10}%</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded">
              <div
                className="h-2 bg-purple-500 rounded"
                style={{ width: `${60 + i * 10}%` }}
              />
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}