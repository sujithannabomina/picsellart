// FILE PATH: src/components/WatermarkedImage.jsx
// ✅ PROFESSIONAL watermark - no harsh lines, subtle and elegant

import React from "react";

export default function WatermarkedImage({
  src,
  alt = "",
  className = "",
  watermarkText = "PICSELLART",
}) {
  return (
    <div className={"relative overflow-hidden rounded-2xl " + className}>
      <img
        src={src}
        alt={alt}
        className="block h-full w-full object-cover select-none"
        draggable={false}
      />

      {/* ✅ Professional watermark overlay - NO HARSH LINES */}
      <div className="pointer-events-none absolute inset-0">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/5" />
        
        {/* ✅ Diagonal repeated text pattern - PROFESSIONAL */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 200px,
                rgba(255, 255, 255, 0.3) 200px,
                rgba(255, 255, 255, 0.3) 201px
              )
            `,
          }}
        />
        
        {/* Center watermark text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="select-none text-white/40 text-4xl sm:text-6xl font-bold tracking-[0.3em] rotate-[-15deg] drop-shadow-lg">
            {watermarkText}
          </div>
        </div>
        
        {/* ✅ Repeated pattern of watermark text (subtle) */}
        <div className="absolute inset-[-50%] grid grid-cols-3 grid-rows-3 gap-0 rotate-[-15deg] opacity-20">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <span className="select-none text-white/60 text-2xl sm:text-3xl font-semibold tracking-[0.3em]">
                {watermarkText}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}