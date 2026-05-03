"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TeacherSidebar({
  open,
  setOpen,
}: any) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `group relative flex items-center gap-3 px-4 py-3 rounded-xl 
    transition-all duration-200 ${
      pathname === path
        ? "bg-purple-500/15 text-purple-300"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <>
      {/* 🔥 OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-72 
        bg-gradient-to-b from-[#07001a] to-[#050014] 
        px-6 py-6 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition duration-300 z-50 border-r border-white/5`}
      >
        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-pink-400 tracking-wide">
            🧑‍🏫 Teacher Panel
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your content
          </p>
        </div>

        {/* NAV LINKS */}
        <div className="flex flex-col space-y-1.5">

          {/* DASHBOARD */}
          <Link
            href="/dashboard/teacher"
            className={linkClass("/dashboard/teacher")}
            onClick={() => setOpen(false)}
          >
            {pathname === "/dashboard/teacher" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full" />
            )}
            📊 Dashboard
          </Link>

          {/* ASSIGNMENTS */}
          <Link
            href="/dashboard/teacher/assignments"
            className={linkClass("/dashboard/teacher/assignments")}
            onClick={() => setOpen(false)}
          >
            {pathname === "/dashboard/teacher/assignments" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full" />
            )}
            📄 View Assignments
          </Link>

          {/* UPLOAD MCQ */}
          <Link
            href="/dashboard/teacher/assignments/create"
            className={linkClass("/dashboard/teacher/assignments/create")}
            onClick={() => setOpen(false)}
          >
            {pathname === "/dashboard/teacher/assignments/create" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full" />
            )}
            🧠 Upload MCQ
          </Link>

          {/* UPLOAD MATERIAL */}
          <Link
            href="/dashboard/teacher/materials/upload"
            className={linkClass("/dashboard/teacher/materials/upload")}
            onClick={() => setOpen(false)}
          >
            {pathname === "/dashboard/teacher/materials/upload" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full" />
            )}
            ⬆️ Upload Study Material
          </Link>

          {/* MY MATERIALS */}
          <Link
            href="/dashboard/teacher/materials/"
            className={linkClass("/dashboard/teacher/materials/")}
            onClick={() => setOpen(false)}
          >
            {pathname === "/dashboard/teacher/materials/" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full" />
            )}
            📚 My Materials
          </Link>

          {/* DIVIDER */}
          <div className="my-3 border-t border-white/5" />

          {/* PLAYLIST */}
          <Link
            href="/dashboard/teacher/playlists/import"
            className={linkClass("/dashboard/teacher/playlists/import")}
            onClick={() => setOpen(false)}
          >
            {pathname === "/dashboard/teacher/playlists/import" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full" />
            )}
            ➕ Import Playlist
          </Link>

          {/* VIDEOS */}
          <Link
            href="/dashboard/teacher/videos"
            className={linkClass("/dashboard/teacher/videos")}
            onClick={() => setOpen(false)}
          >
            {pathname === "/dashboard/teacher/videos" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full" />
            )}
            🎥 Video Lectures
          </Link>

          {/* LEADERBOARD */}
          <Link
            href="/dashboard/teacher/leaderboard"
            className={linkClass("/dashboard/teacher/leaderboard")}
            onClick={() => setOpen(false)}
          >
            {pathname === "/dashboard/teacher/leaderboard" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full" />
            )}
            🏆 Leaderboard
          </Link>

          {/* STUDENTS */}
          <Link
            href="/dashboard/teacher/students"
            className={linkClass("/dashboard/teacher/students")}
            onClick={() => setOpen(false)}
          >
            {pathname === "/dashboard/teacher/students" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-400 rounded-r-full" />
            )}
            👨‍🎓 Students
          </Link>

        </div>

        {/* FOOTER */}
        <div className="absolute bottom-6 left-6 text-xs text-gray-500">
          Teacher Dashboard v1.0
        </div>
      </div>
    </>
  );
}