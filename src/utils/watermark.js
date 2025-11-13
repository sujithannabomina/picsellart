/**
 * Simple helper to generate a watermark overlay style.
 * We already draw a diagonal "PICSELLART" in Explore cards,
 * but this util is kept for re-use if needed.
 */

export function getWatermarkStyle({
  text = "PICSELLART",
  opacity = 0.12,
  rotate = -32,
} = {}) {
  return {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 2,
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(15,23,42," + opacity + ")",
    transform: `rotate(${rotate}deg)`,
  };
}

export const WATERMARK_TEXT = "PICSELLART";
