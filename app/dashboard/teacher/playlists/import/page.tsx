"use client";

import { useState } from "react";
import axios from "axios";

const subjects = ["DSA", "SQL", "JS", "Networking"];

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [subject, setSubject] = useState("DSA");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 Extract playlistId for preview
  const extractPlaylistId = (url: string) => {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : null;
  };

  const playlistId = extractPlaylistId(url);

  const handleImport = async () => {
    if (!url || !title) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await axios.post("/api/playlists/import", {
        url,
        subject,
        title,
      });

      setMessage("✅ Playlist Imported Successfully 🚀");

      setUrl("");
      setTitle("");

    } catch (err: any) {
      setMessage(err?.response?.data?.error || "❌ Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white space-y-6 max-w-xl">

      {/* HEADER */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        🎥 Import Playlist
      </h1>

      {/* URL INPUT */}
      <div className="space-y-1">
        <input
          placeholder="Paste YouTube Playlist URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 bg-black/30 rounded border border-white/10"
        />

        {/* 🔍 Preview */}
        {playlistId && (
          <p className="text-xs text-green-400">
            Playlist ID detected: {playlistId}
          </p>
        )}
      </div>

      {/* TITLE */}
      <input
        placeholder="Playlist Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 bg-black/30 rounded border border-white/10"
      />

      {/* SUBJECT */}
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-3 bg-black/30 rounded border border-white/10"
      >
        {subjects.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* BUTTON */}
      <button
        onClick={handleImport}
        disabled={loading}
        className={`w-full py-2 rounded transition ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        {loading ? "Importing Playlist..." : "Import Playlist"}
      </button>

      {/* MESSAGE */}
      {message && (
        <div className="text-sm bg-white/5 p-3 rounded border border-white/10">
          {message}
        </div>
      )}

    </div>
  );
}