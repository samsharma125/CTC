"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ EXISTING STATES
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);

  // ✅ FORGOT PASSWORD STATES
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [loading, setLoading] = useState(false); // ✅ ADDED

  const router = useRouter();

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      setError("");
      setShowResend(false);

      const res = await axios.post(
        "/api/auth/login",
        {
          email: email.trim().toLowerCase(),
          password,
        },
        {
          withCredentials: true,
        }
      );

      const { role } = res.data;

      if (role === "teacher") {
        router.replace("/dashboard/teacher");
      } else {
        router.replace("/dashboard/student");
      }

    } catch (err: any) {
      const msg = err.response?.data?.error || "Login failed";

      setError(msg);

      if (msg.toLowerCase().includes("verify")) {
        setShowResend(true);
      }
    }
  };

  // 📩 RESEND EMAIL
  const handleResend = async () => {
    try {
      await axios.post("/api/auth/resend-verification", { email });
      alert("Verification email sent again 📩");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to resend");
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#050014] via-[#0c0128] to-[#14033a] text-white overflow-hidden">

      {/* Glow Background */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[150px] rounded-full"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 relative z-10">
        <h1 className="text-lg font-semibold tracking-wide">CollegeToCarrier</h1>

        <div className="flex gap-6 items-center text-sm">
          <a className="hover:text-pink-400 transition">Support</a>
          <a className="hover:text-pink-400 transition">About</a>
          <a className="bg-white/10 px-4 py-1 rounded-md backdrop-blur-md border border-white/10">
            Sign in
          </a>
          <a href="/signup" className="hover:text-pink-400 transition">
            Sign up
          </a>
        </div>
      </nav>

      {/* Main */}
      <div className="flex items-center justify-center px-6 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl w-full">

          {/* LEFT */}
          <div className="flex flex-col justify-center">
            <p className="text-xs bg-pink-600/20 text-pink-400 w-fit px-3 py-1 rounded-full mb-4 backdrop-blur-md border border-pink-400/20">
              ELITE ACCESS ONLY
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Navigate the <br />
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
                Professional
              </span>{" "}
              Cosmos.
            </h1>

            <p className="mt-5 text-gray-400 max-w-md">
              Secure your trajectory from the lecture hall to the boardroom.
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 blur opacity-30"></div>

            <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">

              <h2 className="text-xl font-semibold mb-2">
                Institution Login
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Enter your academic credentials
              </p>

              {/* EMAIL */}
              <input
                type="email"
                autoComplete="new-email"
                placeholder="name@university.edu"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {/* PASSWORD */}
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Access Token"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-2 p-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* FORGOT PASSWORD */}
              <div className="text-right mb-4">
                <button
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-gray-400 hover:text-pink-400"
                >
                  Forgot Password?
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 py-3 rounded-lg font-semibold"
              >
                LAUNCH INTERFACE 🚀
              </button>

              {/* ERROR */}
              {error && (
                <p className="text-red-400 text-sm mt-4 text-center">
                  {error}
                </p>
              )}

              {/* RESEND */}
              {showResend && (
                <button
                  onClick={handleResend}
                  className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-2 rounded-lg text-sm"
                >
                  Resend Verification 📩
                </button>
              )}

              <p className="text-xs text-gray-500 mt-6 text-center">
                By continuing, you agree to Terms & Privacy
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 🔥 FORGOT PASSWORD MODAL */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0c0128] p-6 rounded-xl w-80 space-y-4 border border-white/10">

            <h2 className="text-lg font-bold text-white">
              Reset Password 🔐
            </h2>

            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-3 rounded bg-black/40 border border-white/10 text-white"
            />

            <button
              disabled={loading}
              onClick={async () => {
                try {
                  setResetMsg("");
                  setLoading(true);

                  const res = await axios.post("/api/auth/forgot-password", {
                    email: resetEmail.trim().toLowerCase(),
                  });

                  setResetMsg(res.data.message);

                  setTimeout(() => {
                    setShowForgot(false);
                    setResetEmail("");
                    setResetMsg("");
                  }, 2000);

                } catch (err: any) {
                  setResetMsg(
                    err.response?.data?.error || "Email is not registered"
                  );
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {resetMsg && (
              <p
                className={`text-sm ${
                  resetMsg.toLowerCase().includes("not")
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {resetMsg}
              </p>
            )}

            <button
              onClick={() => setShowForgot(false)}
              className="text-xs text-gray-400"
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
}