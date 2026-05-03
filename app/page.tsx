"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupPage from "./signup/page";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    if (session.user.role === "teacher") {
      router.replace("/dashboard/teacher");
    } else {
      router.replace("/dashboard/student");
    }
  }, [session, status, router]);

  return <SignupPage />;
}