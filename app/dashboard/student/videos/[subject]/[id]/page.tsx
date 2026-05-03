"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [playlist, setPlaylist] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notes, setNotes] = useState<{ [key: number]: string }>({});

  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // 🔥 FETCH PLAYLIST
  useEffect(() => {
    if (!id) return;

    axios.get(`/api/playlists/${id}`).then((res) => {
      setPlaylist(res.data);
      setCurrentIndex(0);
    });
  }, [id]);

  // 🔥 FETCH PROGRESS
  useEffect(() => {
    if (!playlist?._id) return;

    axios
      .get(`/api/progress?playlistId=${playlist._id}`)
      .then((res) => {
        if (res.data?.completedVideos) {
          setCompletedVideos(res.data.completedVideos);
        }
      })
      .finally(() => setLoadingProgress(false));
  }, [playlist]);

  if (!playlist) {
    return <p className="text-white p-6">Loading...</p>;
  }

  const currentVideo = playlist.videos[currentIndex];

  // 🔥 NEXT
  const nextVideo = () => {
    if (currentIndex < playlist.videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 🔥 PREV
  const prevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 🔥 MARK COMPLETE
  const markComplete = async () => {
    if (!currentVideo?.videoId) return;

    await axios.post("/api/progress", {
      playlistId: playlist._id,
      videoId: currentVideo.videoId,
      completed: true,
    });

    setCompletedVideos((prev) =>
      prev.includes(currentVideo.videoId)
        ? prev
        : [...prev, currentVideo.videoId]
    );
  };

  const progressPercent =
    (completedVideos.length / playlist.videos.length) * 100;

  return (
    <div className="p-6 text-white space-y-6">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="text-blue-400"
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-pink-400">
        {playlist.title}
      </h1>

      {/* ✅ PLAYLIST COMPLETION HEADER */}
      <div className="bg-gradient-to-r from-[#14033a] to-[#050014] 
      border border-white/10 rounded-xl p-4 space-y-2">

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300">
            Playlist Progress
          </p>

          <p className="text-sm font-semibold text-green-400">
            {Math.round(progressPercent)}%
          </p>
        </div>

        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-400">
          <span>
            {completedVideos.length} completed
          </span>
          <span>
            {playlist.videos.length} total
          </span>
        </div>

        {/* 🎉 COMPLETED MESSAGE */}
        {progressPercent === 100 && (
          <div className="text-green-400 text-sm font-medium">
            🎉 Playlist Completed!
          </div>
        )}
      </div>

      <div className="flex gap-6">

        {/* VIDEO + NOTES */}
        <div className="flex-1 space-y-4">

          {/* VIDEO */}
          <div className="w-full aspect-video rounded-xl overflow-hidden">
            <iframe
              key={currentVideo.videoId}
              src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          {/* ✅ COMPLETE BUTTON */}
          <button
            onClick={markComplete}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              completedVideos.includes(currentVideo.videoId)
                ? "bg-green-500/20 text-green-400 border border-green-400"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
          >
            {completedVideos.includes(currentVideo.videoId)
              ? "✅ Completed"
              : "Mark as Completed"}
          </button>

          {/* NAVIGATION */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevVideo}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-white/10 rounded disabled:opacity-40"
            >
              ⬅ Prev
            </button>

            <p className="text-sm text-gray-400">
              {currentIndex + 1} / {playlist.videos.length}
            </p>

            <button
              onClick={nextVideo}
              disabled={currentIndex === playlist.videos.length - 1}
              className="px-4 py-2 bg-white/10 rounded disabled:opacity-40"
            >
              Next ➡
            </button>
          </div>

          {/* NOTES */}
          <div className="bg-[#0c0128] p-4 rounded-xl">
            <h2 className="text-lg text-purple-300 mb-2">
              📝 Notes
            </h2>

            <textarea
              value={notes[currentIndex] || ""}
              onChange={(e) =>
                setNotes({
                  ...notes,
                  [currentIndex]: e.target.value,
                })
              }
              placeholder="Write notes for this video..."
              className="w-full h-32 bg-transparent outline-none text-sm"
            />
          </div>

        </div>

        {/* VIDEO LIST */}
        <div className="w-[320px] bg-[#0c0128] rounded-xl overflow-y-auto max-h-[500px]">

          {playlist.videos.map((v: any, i: number) => {
            const isDone = completedVideos.includes(v.videoId);

            return (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`p-3 cursor-pointer flex justify-between ${
                  currentIndex === i
                    ? "bg-purple-500/20"
                    : "hover:bg-white/10"
                }`}
              >
                <p className="text-sm">
                  {i + 1}. {v.title}
                </p>

                {isDone && (
                  <span className="text-green-400 text-xs">
                    ✔
                  </span>
                )}
              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}