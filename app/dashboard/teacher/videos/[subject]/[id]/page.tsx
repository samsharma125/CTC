"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/page";

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();

  const playlistId = params?.id as string;
  const subject = params?.subject as string;

  const [playlist, setPlaylist] = useState<any>(null);
  const [currentVideo, setCurrentVideo] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);

  const playerRef = useRef<any>(null);

  // ✅ FETCH PLAYLIST
  useEffect(() => {
    axios.get(`/api/playlists/${playlistId}`).then((res) => {
      const data = res.data;
      setPlaylist(data);
      setCurrentVideo(data?.videos?.[0]?.videoId || "");
    });
  }, [playlistId]);

  // ✅ LOAD PROGRESS FROM DB
  useEffect(() => {
    if (!playlistId) return;

    axios
      .get(`/api/progress?playlistId=${playlistId}`)
      .then((res) => {
        if (res.data?.completedVideos) {
          setCompleted(res.data.completedVideos);
        }
      });
  }, [playlistId]);

  // ✅ YOUTUBE PLAYER
  useEffect(() => {
    if (!currentVideo) return;

    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      (window as any).onYouTubeIframeAPIReady = () => {
        playerRef.current = new (window as any).YT.Player("player", {
          videoId: currentVideo,
        });
      };
    } else {
      playerRef.current?.loadVideoById(currentVideo);
    }
  }, [currentVideo]);

  // ✅ COMPLETE VIDEO
  const handleComplete = async () => {
    if (!playlist) return;

    if (!completed.includes(currentVideo)) {
      const updated = [...completed, currentVideo];
      setCompleted(updated);

      await axios.post("/api/progress", {
        playlistId,
        videoId: currentVideo,
        completed: true,
      });
    }

    // 🔥 AUTO NEXT
    const index = playlist.videos.findIndex(
      (v: any) => v.videoId === currentVideo
    );

    const next = playlist.videos[index + 1];
    if (next) setCurrentVideo(next.videoId);
  };

  // ✅ PROGRESS %
  const progressPercent =
    playlist?.videos?.length > 0
      ? (completed.length / playlist.videos.length) * 100
      : 0;

  return (
    <>
      <Navbar />

      <div className="text-white h-screen flex flex-col bg-[#07001a]">

        {/* HEADER */}
        <div className="p-4 flex justify-between bg-[#0b0122]">
          <h1>{playlist?.title}</h1>

          <button
            onClick={() =>
              router.push(`/dashboard/teacher/videos/${subject}`)
            }
            className="text-blue-400"
          >
            ← Back
          </button>
        </div>

        {/* ✅ PLAYLIST PROGRESS */}
        <div className="px-4 py-3 bg-[#0c0128]">
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Playlist Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-green-400 h-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-1">
            {completed.length}/{playlist?.videos?.length} completed
          </p>
        </div>

        <div className="flex flex-1">

          {/* VIDEO */}
          <div className="flex-1 bg-black">

            <div className="aspect-video">
              <div id="player" className="w-full h-full"></div>
            </div>

            {/* COMPLETE BUTTON */}
            <div className="p-4">
              <button
                onClick={handleComplete}
                className={`px-4 py-2 rounded ${
                  completed.includes(currentVideo)
                    ? "bg-green-500/20 text-green-400 border border-green-400"
                    : "bg-green-500 text-white"
                }`}
              >
                {completed.includes(currentVideo)
                  ? "✅ Completed"
                  : "Mark as Completed"}
              </button>
            </div>

          </div>

          {/* VIDEO LIST */}
          <div className="w-[350px] bg-[#0c0128] overflow-y-auto">

            {playlist?.videos?.map((v: any, i: number) => {
              const isDone = completed.includes(v.videoId);

              return (
                <div
                  key={i}
                  onClick={() => setCurrentVideo(v.videoId)}
                  className={`p-3 cursor-pointer flex justify-between ${
                    currentVideo === v.videoId
                      ? "bg-purple-500/20"
                      : ""
                  }`}
                >
                  <span>
                    {i + 1}. {v.title}
                  </span>

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
    </>
  );
}