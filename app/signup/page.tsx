"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// 🔥 Separate component for search params (REQUIRED)
function ErrorMessage({ error }: { error: string }) {
  const params = useSearchParams();
  const urlError = params.get("error");

  if (!error && !urlError) return null;

  return (
    <p className="text-red-400 text-sm mb-4 text-center">
      {error ||
        (urlError === "ROLE_MISMATCH"
          ? "❌ This email is registered with a different role"
          : urlError === "wrong-code"
          ? "❌ Invalid teacher secret code"
          : urlError === "unauthorized"
          ? "❌ Access denied"
          : "❌ Something went wrong")}
    </p>
  );
}

export default function SignupPage() {
  const [form, setForm] = useState({
    role: "student",
    secretCode: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");

    if (form.role === "teacher" && form.secretCode !== "teach123") {
      setError("❌ Invalid teacher secret code");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/auth/role?role=${encodeURIComponent(
          form.role
        )}&code=${encodeURIComponent(form.secretCode)}`
      );

      if (!res.ok) {
        setError("❌ Invalid teacher secret code");
        setLoading(false);
        return;
      }

      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (err) {
      setError("❌ Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-[#050014] via-[#0c0128] to-[#14033a] text-white">
      <div className="grid md:grid-cols-2 gap-16 max-w-6xl w-full">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight">
            Elevate from <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Lecture to Leadership.
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-sm max-w-md">
            Join a platform where students learn smarter and teachers manage everything seamlessly 🚀
          </p>
        </div>

        {/* RIGHT CARD */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">

          <h2 className="text-2xl font-semibold mb-6">
            🚀 Begin Your Journey
          </h2>

          {/* ROLE SELECT */}
          <div className="grid grid-cols-2 gap-4 mb-6">

            <div
              onClick={() => setForm({ ...form, role: "student" })}
              className={`cursor-pointer p-4 rounded-xl border transition ${
                form.role === "student"
                  ? "border-blue-400 bg-blue-400/10"
                  : "border-white/10 hover:bg-white/5"
              }`}
            >
              🎓 Student
              <p className="text-xs text-gray-400 mt-1">
                Learn & track progress
              </p>
            </div>

            <div
              onClick={() => setForm({ ...form, role: "teacher" })}
              className={`cursor-pointer p-4 rounded-xl border transition ${
                form.role === "teacher"
                  ? "border-purple-400 bg-purple-400/10"
                  : "border-white/10 hover:bg-white/5"
              }`}
            >
              🧑‍🏫 Teacher
              <p className="text-xs text-gray-400 mt-1">
                Manage courses & students
              </p>
            </div>

          </div>

          {/* SECRET CODE */}
          {form.role === "teacher" && (
            <input
              placeholder="Enter Teacher Secret Code"
              value={form.secretCode}
              onChange={(e) =>
                setForm({ ...form, secretCode: e.target.value })
              }
              className="w-full mb-4 p-3 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:border-purple-400 transition"
            />
          )}

          {/* 🔥 ERROR DISPLAY (Suspense Wrapped) */}
          <Suspense fallback={null}>
            <ErrorMessage error={error} />
          </Suspense>

          {/* GOOGLE BUTTON */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:scale-[1.02] active:scale-95"
            }`}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            {loading ? "Redirecting..." : "Continue with Google"}
          </button>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Secure login powered by Google OAuth 🔐
          </p>

        </div>
      </div>
    </div>
  );
}