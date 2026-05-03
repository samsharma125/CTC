"use client";

import Navbar from "@/components/Navbar/page";
import Providers from "../providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers> {/* ✅ WRAP EVERYTHING */}

      <div className="bg-[#050014] min-h-screen text-white">

        <Navbar />

        <div className="flex">
          <div className="hidden md:block w-72" />
          
          <div className="flex-1 p-6">
            {children}
          </div>
        </div>

      </div>

    </Providers>
  );
}