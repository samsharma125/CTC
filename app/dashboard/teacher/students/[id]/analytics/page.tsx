"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function StudentAnalytics() {
  const { id } = useParams();

  const [student, setStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await fetch(`/api/teacher/students/${id}`);
      const data1 = await res1.json();

      const res2 = await fetch(`/api/teacher/students/${id}/analytics`);
      const data2 = await res2.json();

      const res3 = await fetch(`/api/teacher/students/${id}/progress`);
      const data3 = await res3.json();

      const res4 = await fetch(`/api/teacher/students/${id}/heatmap`);
      const data4 = await res4.json();

      const formatted = Object.entries(data4).map(([date, count]) => ({
        date,
        count,
      }));

      setStudent(data1);
      setSubjects(data2);
      setProgressData(data3);
      setHeatmapData(formatted);
    };

    fetchData();
  }, [id]);

  if (!student) return <p className="p-6">Loading...</p>;

  const chartData = progressData.map((p: any) => {
    const totalVideos = p.totalVideos || 20;
    const completed = p.completedVideos?.length || 0;

    return {
      name: p.playlistName || p.playlistId || "Unknown",
      progress: totalVideos
        ? Math.round((completed / totalVideos) * 100)
        : 0,
    };
  });

  const avg =
    chartData.reduce((a, b) => a + b.progress, 0) /
      chartData.length || 0;

  const pieData = [
    { name: "Completed", value: avg },
    { name: "Remaining", value: 100 - avg },
  ];

  const weakSubjects = progressData.filter((p: any) => {
    const percent = ((p.completedVideos?.length || 0) / 20) * 100;
    return percent < 50;
  });

  const strongSubjects = progressData.filter((p: any) => {
    const percent = ((p.completedVideos?.length || 0) / 20) * 100;
    return percent >= 80;
  });

  const lastActivity = progressData[0]?.updatedAt
    ? new Date(progressData[0].updatedAt)
    : null;

  const daysInactive = lastActivity
    ? Math.floor(
        (Date.now() - lastActivity.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="min-h-screen bg-[#050014] text-white p-6 space-y-8 relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Student Analytics</h1>
        <p className="text-gray-400 mt-1">
          Performance insights and activity tracking
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg hover:scale-105 transition hover:shadow-green-500/30">
          <h2 className="text-sm text-white/80">Lectures Completed</h2>
          <p className="text-3xl font-bold mt-2">
            {progressData.reduce(
              (a, b) => a + (b.completedVideos?.length || 0),
              0
            )}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl shadow-lg hover:scale-105 transition hover:shadow-blue-500/30">
          <h2 className="text-sm text-white/80">Subjects</h2>
          <p className="text-3xl font-bold mt-2">
            {progressData.length}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-lg hover:scale-105 transition hover:shadow-purple-500/30">
          <h2 className="text-sm text-white/80">Avg Progress</h2>
          <p className="text-3xl font-bold mt-2">
            {avg.toFixed(0)}%
          </p>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 rounded-2xl shadow-lg hover:scale-105 transition hover:shadow-red-500/30">
          <h2 className="text-sm text-white/80">Last Active</h2>
          <p className="text-sm mt-2">
            {lastActivity
              ? lastActivity.toLocaleDateString()
              : "N/A"}
          </p>
        </div>

      </div>

      {/* MAIN */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition">
          <h2 className="mb-4 font-semibold text-lg">
            Lecture Progress
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/30">
            {student.name.charAt(0)}
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            {student.name}
          </h2>

          <p className="text-gray-400 text-sm">
            {student.email}
          </p>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
        <h2 className="mb-4 font-semibold">Subject Progress</h2>

        <table className="w-full text-sm">
          <tbody>
            {progressData.map((p: any, i: number) => {
              const percent =
                ((p.completedVideos?.length || 0) / 20) * 100;

              return (
                <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-2 font-semibold text-purple-300">
                    {p.playlistId?.name}
                  </td>

                  <td className="text-center">{percent.toFixed(0)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* HEATMAP */}
      {/* <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition">
        <h2 className="mb-4 font-semibold">Study Activity</h2>

        <CalendarHeatmap
          startDate={new Date(new Date().getFullYear(), 0, 1)}
          endDate={new Date()}
          values={heatmapData}
        />
      </div> */}

      {/* INSIGHTS */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
        <h2 className="mb-4 font-semibold">Student Insights</h2>

        <p className="text-red-400 font-semibold">
          Weak: {weakSubjects.map((s) => s.playlistId).join(", ") || "None"}
        </p>

        <p className="text-green-400 font-semibold">
          Strong: {strongSubjects.map((s) => s.playlistId).join(", ") || "None"}
        </p>

        <p className="text-yellow-400 font-semibold mt-2">
          {daysInactive
            ? `Inactive for ${daysInactive} days`
            : "Active recently"}
        </p>
      </div>

    </div>
  );
}