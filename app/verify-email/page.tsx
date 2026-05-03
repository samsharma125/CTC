"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyPage() {
  const [msg, setMsg] = useState("Verifying...");
  const [count, setCount] = useState(3);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    axios.get(`/api/auth/verify?token=${token}`)
      .then(() => {
        setMsg("Email verified ✅");

        // 🔥 START COUNTDOWN
        let timer = 3;
        const interval = setInterval(() => {
          timer--;
          setCount(timer);

          if (timer === 0) {
            clearInterval(interval);
            window.location.href = "/login";
          }
        }, 1000);

      })
      .catch(() => setMsg("Invalid or expired link ❌"));
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white gap-3">

      <h1 className="text-xl">{msg}</h1>

      {msg.includes("verified") && (
        <p className="text-gray-400">
          Redirecting to login in {count}...
        </p>
      )}

    </div>
  );
}