"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, X } from "lucide-react";
import StudentSidebar from "../sidebar/StudentSidebar";
import TeacherSidebar from "../sidebar/TeacherSidebar";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const role = session?.user?.role || "student";

  const router = useRouter();
  const pathname = usePathname();

  // 🔔 FETCH NOTIFICATIONS
  useEffect(() => {
    if (!session) return;

    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data || []))
      .catch(() => setNotifications([]));
  }, [session]);

  // 🔒 CLOSE PROFILE DROPDOWN
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdown(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="fixed top-0 left-0 w-full h-24 bg-black/40 backdrop-blur animate-pulse z-50" />
    );
  }

  return (
    <>
     <div className="fixed top-0 left-0 w-full h-24 
backdrop-blur-xl bg-black/50 border-b border-white/10
flex items-center justify-between px-6 md:px-10 z-50 shadow-lg">
        {/* LEFT */}
       <div className="flex items-center gap-5">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            {open ? (
              <X className="text-white w-6 h-6" />
            ) : (
              <Menu className="text-gray-300 w-6 h-6" />
            )}
          </button>

          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r 
          from-pink-400 via-purple-400 to-indigo-500 
          bg-clip-text text-transparent">
            CollegeToCareer
          </h1>
        </div>

        {/* RIGHT */}
       <div className="flex items-center gap-4 md:gap-5">

          {/* 🔔 NOTIFICATION BUTTON (FIXED) */}
          <button
            onClick={() => {
              router.push(
                role === "student"
                  ? "/dashboard/student/notifications"
                  : "/dashboard/teacher/notifications"
              );
            }}
            className="relative p-2 rounded-lg hover:bg-white/10 transition"
          >
            🔔
            {notifications.some((n: any) => !n.isRead) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* 🏆 LEADERBOARD */}
          <button
            onClick={() => router.push("/dashboard/leaderboard")}
            className="text-xs md:text-sm px-3 py-1 rounded-full 
            bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 
            text-yellow-300 transition"
          >
            🏆 Leaderboard
          </button>

          {/* 🔙 BACK BUTTON */}
          {pathname !== "/dashboard/student" &&
            pathname !== "/dashboard/teacher" && (
              <button
                onClick={() => router.back()}
                className="text-xs md:text-sm px-3 py-1 rounded-full 
                bg-white/5 hover:bg-white/10 border border-white/10 
                text-gray-300 hover:text-white transition"
              >
                ← Back
              </button>
            )}

          {/* ROLE */}
          <span className="hidden sm:block text-xs md:text-sm px-3 py-1 rounded-full 
          bg-white/10 text-gray-300 capitalize border border-white/10">
            {role}
          </span>

          {/* PROFILE */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdown((prev) => !prev);
              }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg 
              hover:bg-white/10 transition"
            >
              <div className="w-9 h-9 rounded-full 
              bg-gradient-to-tr from-pink-500 to-purple-600 
              flex items-center justify-center 
              text-white font-semibold text-sm">
                {session?.user?.name?.charAt(0) || "U"}
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition ${
                  dropdown ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {dropdown && (
              <div className="absolute right-0 mt-3 w-60 z-[999]
              bg-[#111] border border-white/10 rounded-xl shadow-xl">

                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-white">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {role}
                  </p>
                </div>

                <button
              onClick={() => signOut({ callbackUrl: "/signup" })}
                  className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      {role === "teacher" ? (
        <TeacherSidebar open={open} setOpen={setOpen} />
      ) : (
        <StudentSidebar open={open} setOpen={setOpen} />
      )}
    </>
  );
}