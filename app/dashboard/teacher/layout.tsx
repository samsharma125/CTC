"use client";

import { useState } from "react";
import TeacherSidebar from "@/components/sidebar/TeacherSidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050014] text-white">

      {/* SIDEBAR */}
      <TeacherSidebar open={open} setOpen={setOpen} />

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* 🔥 TOGGLE BUTTON */}
      

        {children}
      </div>
    </div>
  );
}