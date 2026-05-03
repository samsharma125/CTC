"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [currentName, setCurrentName] = useState(""); // ✅ FIX

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
const [email, setEmail] = useState("");
  // 🔥 FETCH CURRENT USER
  useEffect(() => {
    axios
      .get("/api/user/me", { withCredentials: true })
      .then((res) => {
        setCurrentName(res.data.name);
        setName(res.data.name);
          setEmail(res.data.email);
      })
      .catch(() => {
        setError("Failed to load user");
      });
  }, []);

  // 🔥 UPDATE NAME
  const updateName = async () => {
    try {
      setError("");
      setMessage("");

      const res = await axios.put(
        "/api/user/update-name",
        { name },
        { withCredentials: true } // ✅ IMPORTANT
      );

      setMessage(res.data.message);
      setCurrentName(res.data.newName); // ✅ update UI
    } catch (err: any) {
      setError(err.response?.data?.error || "Error updating name");
    }
  };

  // 🔥 CHANGE PASSWORD
  const changePassword = async () => {
    try {
      setError("");
      setMessage("");

      const res = await axios.put(
        "/api/user/change-password",
        {
          oldPassword,
          newPassword,
        },
        { withCredentials: true } // ✅ IMPORTANT
      );

      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error changing password");
    }
  };

 return (
  <div className="min-h-screen bg-[#050014] text-white flex justify-center items-start py-12 px-4">

    <div className="w-full max-w-3xl space-y-8">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
          {currentName?.charAt(0)?.toUpperCase() || "👤"}
        </div>

        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-400 text-sm">
            Manage your account details
          </p>
        </div>
      </div>

      {/* 🔥 PROFILE CARD */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">

        <div>
          <p className="text-xs text-gray-400">Name</p>
          <p className="text-lg font-medium">{currentName}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Email</p>
          <p className="text-lg font-medium">{email || "Loading..."}</p>
        </div>

      </div>

      {/* 🔥 ALERTS */}
      {message && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* 🔥 UPDATE NAME */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">

        <h2 className="text-lg font-semibold">Update Name</h2>

        <input
          type="text"
          placeholder="Enter new name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <button
          onClick={updateName}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          Update Name
        </button>

      </div>

      {/* 🔥 CHANGE PASSWORD */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">

        <h2 className="text-lg font-semibold">Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={changePassword}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          Change Password
        </button>

      </div>

    </div>
  </div>
);
}