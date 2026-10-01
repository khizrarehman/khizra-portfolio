"use client";

import { Component } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { StaticField } from "@/components/3d/StaticField";
import { setSceneStatus, useSceneStatus } from "@/components/3d/sceneStatus";

const BiologicalScene = dynamic(
  () => import("@/components/3d/BiologicalScene").then((mod) => mod.BiologicalScene),
  { ssr: false, loading: () => null }
);

/**
 * Catches anything the scene throws while starting — three.js failing to
 * create a context, a lost GPU, the scene's chunk failing to load — so a
 * 3D problem can only ever cost the background, never the page.
 */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    setSceneStatus("failed");
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The site's persistent 3D background: fixed to the viewport, full
 * bleed, behind all content (negative z-index), and non-interactive
 * (pointer-events-none) so it never blocks scrolling or clicks on the
 * real page. It's sized to the *large* viewport (100lvh) rather than
 * inset-0, so a mobile browser's toolbar collapsing or reappearing never
 * resizes the WebGL canvas mid-scroll — only a real resize or rotation
 * does. This is the only place react-three-fiber/three.js code is
 * referenced outside src/components/3d — everything else only ever
 * imports this component.
 *
 * Without WebGL (unsupported, disabled, or failing to start) the same
 * space shows StaticField, a still 2D version of the particle field;
 * everything else on the page works exactly as before.
 */
export function BiologicalBackground() {
  const status = useSceneStatus();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh">
      {status === "failed" ? (
        <StaticField />
      ) : (
        <SceneBoundary>
          <BiologicalScene />
        </SceneBoundary>
      )}
    </div>
  );
}
