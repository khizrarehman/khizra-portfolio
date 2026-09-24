"use client";

import dynamic from "next/dynamic";
import { Tag } from "@/components/ui/Tag";

const BiologicalScene = dynamic(
  () => import("@/components/3d/BiologicalScene").then((mod) => mod.BiologicalScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Tag>Loading environment…</Tag>
      </div>
    ),
  }
);

/**
 * Entry point for the hero's 3D environment. This is the only place
 * react-three-fiber/three.js code is referenced outside src/components/3d —
 * everything else only ever imports this component.
 */
export function HeroScene() {
  return <BiologicalScene />;
}
