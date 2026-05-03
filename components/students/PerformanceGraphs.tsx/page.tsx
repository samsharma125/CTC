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

export default function PerformanceGraphs() {
  // 📈 Weekly Points (Line Chart)
  const weeklyData = [
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 20 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: 10 },
  ];

  // 📊 Activity Breakdown (Bar Chart)
  const activityData = [
    { name: "Practice", value: 80 },
    { name: "Assignments", value: 70 },
    { name: "Tests", value: 50 },
  ];

  // 🌊 Growth Trend (Area Chart)
  const growthData = weeklyData;

  return (
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
            <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🌊 AREA CHART (FULL WIDTH) */}
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
  );
}