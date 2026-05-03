"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const subjects = ["DSA", "SQL", "JS", "Networking"];

export default function UploadMaterialPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("DSA");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔄 Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // 🔒 Size limit (5MB)
    if (selected.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }

    setFile(selected);

    // 🖼 Image preview
    if (selected.type.startsWith("image")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  // 📤 Upload
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);

    try {
      setLoading(true);

      await axios.post("/api/materials", formData);

      alert("✅ Uploaded successfully");

      // 🔄 reset
      setFile(null);
      setPreview(null);

      // 🔁 redirect to list page
      router.push("/dashboard/teacher/materials");
    } catch (err: any) {
      console.log(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl space-y-6">

      <h1 className="text-3xl font-bold">
        📤 Upload Study Material
      </h1>

      {/* SUBJECT */}
      <div>
        <label className="block mb-2 text-sm text-gray-400">
          Select Subject
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 bg-white/5 border border-white/10 rounded"
        >
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* FILE INPUT */}
      <div>
        <label className="block mb-2 text-sm text-gray-400">
          Upload File (PDF / Image)
        </label>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          className="w-full p-3 bg-white/5 border border-white/10 rounded"
        />
      </div>

      {/* PREVIEW */}
      {file && (
        <div className="bg-white/5 border border-white/10 p-4 rounded">
          <p className="text-sm text-gray-300">
            📄 {file.name}
          </p>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 max-h-40 rounded"
            />
          )}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-green-500 px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}