"use client";

import { useEffect, useCallback } from "react";

export default function MediaLightbox({ media, currentIndex, onClose, onNavigate }) {
  const item = media[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < media.length - 1;

  const handleKey = useCallback((e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft" && hasPrev) onNavigate(currentIndex - 1);
    if (e.key === "ArrowRight" && hasNext) onNavigate(currentIndex + 1);
  }, [onClose, onNavigate, currentIndex, hasPrev, hasNext]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!item) return null;

  const isVideo = item.type === "video";
  const isYouTube = isVideo && item.url && (item.url.includes("youtube.com") || item.url.includes("youtu.be"));

  function getYouTubeId(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    return match ? match[1] : null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-lg"
      >
        &times;
      </button>

      {/* Left arrow */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-lg"
        >
          &#8249;
        </button>
      )}

      {/* Right arrow */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-lg"
        >
          &#8250;
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full px-12" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          isYouTube ? (
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : item.url ? (
            <video src={item.url} controls autoPlay className="w-full rounded-lg max-h-[70vh]" />
          ) : (
            <div className="w-full aspect-video rounded-lg bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">&#9654;</div>
                <p className="text-sm">Video placeholder</p>
              </div>
            </div>
          )
        ) : (
          item.url ? (
            <img src={item.url} alt={item.caption} className="w-full rounded-lg max-h-[70vh] object-contain" />
          ) : (
            <div className="w-full aspect-square max-w-sm mx-auto rounded-lg bg-gray-200 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )
        )}

        {/* Caption */}
        {item.caption && (
          <p className="text-center text-white/80 text-sm mt-4">{item.caption}</p>
        )}

        {/* Counter */}
        <p className="text-center text-white/40 text-xs mt-2">
          {currentIndex + 1} / {media.length}
        </p>
      </div>
    </div>
  );
}
