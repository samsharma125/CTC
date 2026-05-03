"use client";

import { useState } from "react";
import axios from "axios";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message) return;

    setLoading(true);

    await axios.post("/api/feedback", {
      message,
      rating,
    });

    setMessage("");
    setRating(5);
    setLoading(false);

    alert("Feedback submitted ✅");
  };

  return (
    <div className="p-6 text-white min-h-screen bg-[#07001a]">

      <h1 className="text-2xl font-bold text-pink-400 mb-6">
        💬 Give Feedback
      </h1>

      <div className="bg-[#0c0128] p-5 rounded-xl space-y-4">

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full h-32 bg-transparent border border-white/10 rounded p-3 outline-none"
        />

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="bg-black border border-white/10 p-2 rounded"
        >
          {[1,2,3,4,5].map((r) => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-pink-500 px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>

      </div>
    </div>
  );
}