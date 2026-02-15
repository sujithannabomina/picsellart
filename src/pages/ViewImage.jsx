import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import ViewPhoto from "./ViewPhoto";

/**
 * Backward-compatible wrapper:
 * - Your Explore previously used /view/:id in some places.
 * - This keeps /view/:id working by reusing ViewPhoto logic.
 */
export default function ViewImage() {
  const { id } = useParams();

  // ViewPhoto reads params itself, so we just render it.
  // This file exists to keep /view/:id route alive.
  const ok = useMemo(() => !!id, [id]);

  if (!ok) return null;
  return <ViewPhoto />;
}
