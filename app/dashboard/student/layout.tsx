"use client";

import Navbar from "@/components/Navbar/page";

export default function StudentLayout({ children }: any) {
  return (
    <div className="flex flex-col min-h-screen">

      <Navbar />

      <div className="pt-16 p-4">
        {children}
      </div>

    </div>
  );
}