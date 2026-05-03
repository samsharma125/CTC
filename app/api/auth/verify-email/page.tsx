"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    axios
      .get(`/api/auth/verify?token=${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.error || "Verification failed");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0320] via-[#12053a] to-[#1b064a] text-white px-4">

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-xl max-w-md w-full text-center">

        {/* ⏳ Loading */}
        {status === "loading" && (
          <>
            <h2 className="text-2xl font-semibold mb-4 animate-pulse">
              Verifying your email...
            </h2>
            <p className="text-gray-400 text-sm">
              Please wait while we confirm your account.
            </p>
          </>
        )}

        {/* ✅ Success */}
        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              Email Verified ✅
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              {message}
            </p>

            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Go to Login →
            </button>
          </>
        )}

        {/* ❌ Error */}
        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Verification Failed ❌
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              {message}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/signup")}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 py-3 rounded-lg font-semibold hover:opacity-90"
              >
                Create Account Again
              </button>

              <button
                onClick={() => router.push("/login")}
                className="text-sm text-gray-400 hover:text-white"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}