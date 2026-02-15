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

      {/* Watermark overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10" />
        <div
          className="absolute inset-[-40%] rotate-[-20deg] opacity-[0.28]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.0) 0px,
              rgba(255,255,255,0.0) 22px,
              rgba(255,255,255,0.55) 22px,
              rgba(255,255,255,0.55) 24px
            )`,
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <div className="select-none text-white/60 text-3xl sm:text-5xl font-semibold tracking-[0.35em] rotate-[-15deg]">
            {watermarkText}
          </div>
        </div>
      </div>
    </div>
  );
}
