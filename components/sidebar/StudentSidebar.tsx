"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StudentSidebar({
  open,
  setOpen,
}: any) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded transition ${
      pathname === path
        ? "bg-pink-500/20 text-pink-400"
        : "text-gray-300 hover:bg-white/10"
    }`;

  // ✅ ADD THIS (close on click)
  const handleClick = () => setOpen(false);

  return (
    <>
      {/* 🔥 OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#07001a] p-6 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition duration-300 z-50`}
      >
        {/* TITLE */}
        <h2 className="text-xl mb-6 text-purple-400">
          🎓 Student Panel
        </h2>

        {/* LINKS */}
        <div className="space-y-2">

          <Link href="/dashboard/student" onClick={handleClick} className={linkClass("/dashboard/student")}>
            📊 Dashboard
          </Link>

          <Link href="/dashboard/student/assignments" onClick={handleClick} className={linkClass("/dashboard/student/assignments")}>
            📝 Assignments
          </Link>

          <Link href="/dashboard/student/materials" onClick={handleClick} className={linkClass("/dashboard/student/materials")}>
            📚 Study Materials
          </Link>

          <Link href="/dashboard/student/videos" onClick={handleClick} className={linkClass("/dashboard/student/videos")}>
            🎥 Lectures
          </Link>
              
              

          {/* 🤖 AI CHATBOT */}
          <Link
            href="/dashboard/student/ai"
            onClick={handleClick}
            className={`block px-4 py-2 rounded transition font-medium
            ${
              pathname === "/dashboard/student/chatbot"
                ? "bg-purple-500/20 text-purple-400"
                : "text-purple-300 hover:bg-purple-500/10"
            }`}
          >
            🤖 AI Tutor
   
             </Link>
   
                
 
         <a
  href="https://drive.google.com/drive/u/0/folders/1V5-NWPj1JhfBBf6wpU4rV7Ebar2ShSi5"
  target="_blank"
  rel="noopener noreferrer"
  onClick={handleClick}
  className="block px-4 py-2 rounded transition font-medium text-purple-300 hover:bg-purple-500/10"
>
  📂 Study Material  <br /> (Company Placement)
</a>
 <Link
            href="/dashboard/student/feedback"
            onClick={handleClick}
            className={`block px-4 py-2 rounded transition font-medium
            ${
              pathname === "/dashboard/student/feedback"
                ? "bg-purple-500/20 text-purple-400"
                : "text-purple-300 hover:bg-purple-500/10"
            }`}
          >
            💬 Feedback
   
             </Link>
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-6 left-6 text-xs text-gray-500">
          Powered by AI 🚀
        </div>
      </div>
    </>
  );
}