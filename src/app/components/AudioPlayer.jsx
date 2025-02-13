"use client";
import { useState, useRef } from "react";

export default function AudioPlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center space-x-4 p-2 border rounded-md bg-gray-100">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isPlaying ? "⏸️ Pause" : "▶ Play"}
      </button>
      <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}
