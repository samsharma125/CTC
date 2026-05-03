"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => setListening(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("API not working");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "No response" },
      ]);

    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Server error or API not found" },
      ]);
    }

    setLoading(false);
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0b0122] via-[#0c0128] to-black text-white">

    {/* ✅ CENTER BOX */}
   <div className="w-full max-w-3xl h-[75vh] flex flex-col border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
      {/* 🔥 HEADER */}
      <div className="px-6 py-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h1 className="text-sm font-semibold">🤖 AI Tutor</h1>

        <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Smart AI
        </span>
      </div>

      {/* 💬 CHAT (NO SCROLL) */}
      <div className="flex-1 px-6 py-4 space-y-3 overflow-hidden">

        {messages.length === 0 && (
          <div className="text-center mt-10 text-gray-400 text-sm">
            Ask anything about DSA, SQL, JS, Networking 📚
          </div>
        )}

        {messages.slice(-6).map((msg, i) => ( // 👈 only last messages
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-purple-600 to-pink-500"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-gray-400 text-xs animate-pulse">
            AI is thinking...
          </p>
        )}

      </div>

      {/* ✨ INPUT */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 border border-white/10">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something..."
            className="flex-1 bg-transparent outline-none text-sm"
          />

          <button
            onClick={startListening}
            className={`p-2 rounded ${
              listening ? "bg-red-500 animate-pulse" : "bg-white/10"
            }`}
          >
            🎤
          </button>

          <button
            onClick={sendMessage}
            className="px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-pink-500 text-sm"
          >
            ➤
          </button>

        </div>
      </div>

    </div>
  </div>
);
}