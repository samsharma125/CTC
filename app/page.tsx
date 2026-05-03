"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupPage from "./signup/page";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const role = session.user?.role;

    if (role === "teacher") {
      router.replace("/dashboard/teacher");
    } else if (role === "student") {
      router.replace("/dashboard/student");
    }
  }, [session, status, router]);

  return <SignupPage />;
}