"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StudentGraphs() {
  // 🔵 PIE (overall progress)
  const pieData = [
    { name: "Completed", value: 65 },
    { name: "Remaining", value: 35 },
  ];

  // 📊 BAR (subject performance)
  const barData = [
    { subject: "DSA", score: 80 },
    { subject: "SQL", score: 60 },
    { subject: "JS", score: 75 },
    { subject: "Networking", score: 50 },
  ];

  const COLORS = ["#8b5cf6", "#1f2937"]; // purple + dark

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">

      {/* 🔵 PIE CHART */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] 
      p-6 rounded-2xl border border-white/10 shadow-xl text-center">

        <h2 className="text-white mb-4 text-lg font-semibold">
          Overall Progress
        </h2>

        <div className="relative flex justify-center">
          <PieChart width={220} height={220}>
            <Pie
              data={pieData}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>

          {/* CENTER TEXT */}
          <div className="absolute top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2 
          text-white text-2xl font-bold">
            65%
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-2">
          Course Completion
        </p>
      </div>

      {/* 📊 BAR CHART */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] 
      p-6 rounded-2xl border border-white/10 shadow-xl">

        <h2 className="text-white mb-4 text-lg font-semibold">
          Subject Performance
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="subject" stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}