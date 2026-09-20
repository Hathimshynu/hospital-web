"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useDeviceTier, useMediaQuery, useWebGLApi } from "@/hooks/useDeviceTier";
import type { Stage } from "./StoryVertical";

// The desktop 3D story is a separate chunk: phones and low-power devices never download it.
const StoryCinematic = dynamic(() => import("./StoryCinematic"), { ssr: false });

/**
 * Tiny client gate. `children` is the server-rendered vertical story (crawlable HTML, works
 * everywhere); capable desktops swap in the pinned 3D story after hydration.
 */
export function PregnancyStory({ stages, children }: { stages: Stage[]; children: ReactNode }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 1024px)");
  const tier = useDeviceTier();
  const webgl = useWebGLApi();
  const cinematic = wide && !reduced && webgl && stages.every((s) => s.src) && (tier === "high" || tier === "medium");
  return cinematic ? <StoryCinematic stages={stages} /> : children;
}
