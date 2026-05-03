"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AIChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // 🔥 Listen to sidebar trigger
  useEffect(() => {
    const handler = () => setOpen(true);

    window.addEventListener("open-ai-chat", handler);
    return () => window.removeEventListener("open-ai-chat", handler);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await axios.post("/api/ai-chat", {
        message: input,
      });

      const botMsg = {
        role: "bot",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, botMsg]);
      setInput("");
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-[#0c0128] border border-white/10 rounded-xl p-3 text-white shadow-xl z-[9999]">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">🤖 AI Tutor</h2>

        <button
          onClick={() => setOpen(false)}
          className="text-red-400"
        >
          ✕
        </button>
      </div>

      {/* CHAT */}
      <div className="h-60 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-purple-500/30 text-right"
                : "bg-white/10"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <p className="text-gray-400 text-sm">Typing...</p>
        )}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 p-2 rounded bg-black/30 text-sm"
        />

        <button
          onClick={sendMessage}
          className="bg-pink-500 px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}