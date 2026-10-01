"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "@/components/motion/useGsap";
import { PAW_BOX, PAW_PRINTS, pawStore } from "@/components/3d/pawTrail";
import { CHAPTER_IDS, getStations, scrollAtJourney } from "@/components/motion/chapters";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useSceneStatus } from "@/components/3d/sceneStatus";
import { cn } from "@/lib/cn";

/** A single paw print: one main pad and four toe beans. */
function PawShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <ellipse cx="12" cy="15.6" rx="5.2" ry="4.4" />
      <ellipse cx="5.6" cy="10.4" rx="1.9" ry="2.4" transform="rotate(-18 5.6 10.4)" />
      <ellipse cx="9.4" cy="6.6" rx="1.9" ry="2.5" transform="rotate(-6 9.4 6.6)" />
      <ellipse cx="14.6" cy="6.6" rx="1.9" ry="2.5" transform="rotate(6 14.6 6.6)" />
      <ellipse cx="18.4" cy="10.4" rx="1.9" ry="2.4" transform="rotate(18 18.4 10.4)" />
    </svg>
  );
}

const PRINT_INNER =
  "block h-full w-full fill-ink-muted transition-[scale,opacity,translate] duration-500 ease-out";

/**
 * The cat's trail: a handful of tiny paw prints discovered along the
 * journey, long after the cat has left the hero. Secondary on purpose —
 * small, muted, and only in empty parts of the view.
 *
 * With motion, the prints live in a fixed layer and PawProjector (in the
 * 3D canvas) places them each frame from their world positions, so they
 * approach, drift and pass exactly like the particles. With reduced
 * motion the camera doesn't travel, so the prints are instead pinned
 * statically beside the chapters they belong to — still there, just
 * without movement.
 *
 * The layer never takes pointer input itself; only visible prints do,
 * and they have no scroll or wheel handlers, so scrolling is never
 * interrupted. The special print is a real button: hover makes it a
 * little more present, clicking it says hello.
 */
export function PawTrail() {
  const reducedMotion = usePrefersReducedMotion();
  const scene = useSceneStatus();
  const layerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const specialIndex = PAW_PRINTS.findIndex((print) => print.special);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    pawStore.message = messageRef.current;
    return () => {
      pawStore.message = null;
    };
  }, []);

  // Reduced motion: pin each print beside its chapter in the page flow.
  useEffect(() => {
    if (!reducedMotion) return;
    const layer = layerRef.current;
    if (!layer) return;
    const place = () => {
      const origin = layer.getBoundingClientRect().top + window.scrollY;
      PAW_PRINTS.forEach((print, i) => {
        const el = pawStore.elements[i];
        const k = Math.floor(print.journey);
        const from = document.getElementById(CHAPTER_IDS[k]);
        const to = document.getElementById(CHAPTER_IDS[k + 1]);
        if (!el || !from) return;
        const a = from.getBoundingClientRect().top + window.scrollY;
        const b = to ? to.getBoundingClientRect().top + window.scrollY : a + from.offsetHeight;
        const top = a + (print.journey - k) * (b - a) - origin - print.y * 60;
        const at = `translate3d(calc(${(50 + print.x * 42).toFixed(1)}vw - 50%), ${top.toFixed(0)}px, 0)`;
        el.style.transform = `${at} rotate(${print.rotate}deg) scale(${(0.8 * (print.size ?? 1)).toFixed(2)})`;
        if (print.special && messageRef.current) {
          messageRef.current.style.transform = `${at} translate(-30%, -110%)`;
        }
        el.style.opacity = print.special ? "0.7" : "0.5";
        el.style.pointerEvents = "auto";
        el.dataset.visible = "true";
      });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [reducedMotion]);

  const sayHello = () => {
    const message = messageRef.current;
    if (!message) return;
    message.textContent = "you found me ♡";
    gsap.killTweensOf(message);
    if (reducedMotion) {
      gsap.set(message, { opacity: 1 });
      gsap.to(message, { opacity: 0, duration: 0.01, delay: 3 });
      return;
    }
    gsap
      .timeline()
      .fromTo(message, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
      .to(message, { opacity: 0, y: -4, duration: 1.2, ease: "power1.in" }, "+=1.8");
  };

  // Keyboard users can reach the special print from anywhere; bring it
  // into view first if it's not visible yet.
  const onSpecialFocus = () => {
    const el = pawStore.elements[specialIndex];
    if (!el || el.dataset.visible === "true" || reducedMotion) return;
    const stations = getStations([]);
    const y = scrollAtJourney(PAW_PRINTS[specialIndex].journey, stations);
    const smooth = lenisRef.current;
    if (smooth) smooth.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  };

  // The prints are placed by the 3D canvas; without it (no WebGL) they'd
  // be invisible yet focusable, so the easter egg simply isn't there.
  if (scene === "failed" && !reducedMotion) return null;

  return (
    <div
      ref={layerRef}
      role="group"
      aria-label="A tiny cat trail"
      className={cn(
        "pointer-events-none inset-0 z-30 overflow-hidden",
        reducedMotion ? "absolute" : "fixed"
      )}
    >
      {PAW_PRINTS.map((print, i) => {
        const setRef = (el: HTMLElement | null) => {
          pawStore.elements[i] = el;
        };
        const style = { width: PAW_BOX, height: PAW_BOX, opacity: 0 };
        const position = "absolute top-0 left-0 block will-change-transform";

        return print.special ? (
          <button
            key={i}
            ref={setRef}
            type="button"
            data-paw
            aria-label="A tiny paw print — something left this here"
            onClick={sayHello}
            onFocus={onSpecialFocus}
            style={style}
            className={cn(
              position,
              "group pointer-events-none cursor-pointer rounded-full",
              // A larger, invisible hit area around a very small mark.
              "before:absolute before:-inset-3 before:content-['']"
            )}
          >
            <PawShape
              className={cn(
                PRINT_INNER,
                "group-hover:scale-[1.45] group-hover:-translate-y-0.5 group-hover:fill-pink group-focus-visible:scale-[1.45] group-focus-visible:fill-pink"
              )}
            />
          </button>
        ) : (
          <span key={i} ref={setRef} aria-hidden style={style} className={cn(position, "group pointer-events-none")}>
            <PawShape className={cn(PRINT_INNER, "opacity-90 group-hover:scale-[1.3] group-hover:-translate-y-px group-hover:opacity-100")} />
          </span>
        );
      })}

      <p
        ref={messageRef}
        role="status"
        className="pointer-events-none absolute top-0 left-0 font-display text-base whitespace-nowrap text-ink opacity-0 sm:text-lg"
      />
    </div>
  );
}
