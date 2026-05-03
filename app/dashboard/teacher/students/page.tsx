"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/teacher/students");
        const data = await res.json();

        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        console.log("Error fetching students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  if (loading) {
    return <p className="text-white p-6">Loading students...</p>;
  }

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-wide">
          👨‍🎓 Students
        </h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:border-purple-400 w-full md:w-80 transition"
        />
      </div>

      {/* EMPTY */}
      {filteredStudents.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg">No students found 😕</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              onClick={() =>
                router.push(
                  `/dashboard/teacher/students/${student._id}`
                )
              }
              className="cursor-pointer group bg-gradient-to-br from-[#14033a] to-[#050014] border border-white/10 rounded-2xl p-5 shadow-lg hover:scale-[1.04] hover:border-purple-400 transition-all duration-300"
            >
              {/* TOP */}
              <div className="flex items-center gap-4">
                {/* AVATAR */}
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-lg font-bold">
                  {student.name?.charAt(0)}
                </div>

                <div>
                  <h2 className="text-lg font-semibold group-hover:text-purple-300">
                    {student.name}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* JOIN DATE */}
              <p className="text-xs text-gray-500 mt-4">
                Joined:{" "}
                {new Date(student.createdAt).toLocaleDateString()}
              </p>

              {/* FOOTER */}
              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs bg-blue-500/20 px-3 py-1 rounded-full">
                  Student
                </span>

                {/* 🔥 SUBMISSION COUNT */}
                <span className="text-sm text-purple-300">
                  📄 {student.submissions || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}