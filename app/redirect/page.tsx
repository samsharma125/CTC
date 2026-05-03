"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    // ✅ ROLE BASED REDIRECT
    if (session.user.role === "teacher") {
      router.push("/dashboard/teacher");
    } else {
      router.push("/dashboard/student");
    }
  }, [session, status]);

  return <p>Redirecting...</p>;
}