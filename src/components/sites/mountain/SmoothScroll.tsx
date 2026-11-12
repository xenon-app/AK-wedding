"use client";

import { useEffect, useRef } from "react";

/**
 * High-performance smooth scrolling controller.
 * Adds luxurious, buttery-smooth inertia scrolling on desktop wheel interactions
 * while keeping native 60/120fps touch responsiveness on mobile devices.
 */
export function SmoothScroll() {
  const currentYRef = useRef(0);
  const targetYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    // Respect reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    // Detect touch-only mobile device to keep native tactile momentum
    const isTouchOnly =
      "ontouchstart" in window &&
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isTouchOnly) return;

    currentYRef.current = window.scrollY;
    targetYRef.current = window.scrollY;

    const clamp = (val: number, min: number, max: number) =>
      Math.max(min, Math.min(val, max));

    const getMaxScroll = () =>
      Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );

    const update = () => {
      const diff = targetYRef.current - currentYRef.current;
      const maxScroll = getMaxScroll();

      // Lerp with smooth damping factor (0.12 = responsive yet silky)
      currentYRef.current += diff * 0.12;

      // Snap when close enough to stop RAF
      if (Math.abs(diff) < 0.5) {
        currentYRef.current = targetYRef.current;
        window.scrollTo(0, Math.round(currentYRef.current));
        isRunningRef.current = false;
        rafRef.current = null;
        return;
      }

      window.scrollTo(0, currentYRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    const handleWheel = (e: WheelEvent) => {
      // Do not intercept if user is inside a scrollable modal/dialog or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('[role="dialog"]') ||
          target.closest("textarea") ||
          target.closest(".scrollable"))
      ) {
        return;
      }

      e.preventDefault();

      const maxScroll = getMaxScroll();
      // Normalize wheel delta across browsers and mice
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 28; // Lines mode
      else if (e.deltaMode === 2) delta *= window.innerHeight; // Pages mode

      targetYRef.current = clamp(targetYRef.current + delta, 0, maxScroll);

      if (!isRunningRef.current) {
        currentYRef.current = window.scrollY;
        isRunningRef.current = true;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    // Update target when user clicks anchor links or programmatic scroll occurs
    const handleScroll = () => {
      if (!isRunningRef.current) {
        currentYRef.current = window.scrollY;
        targetYRef.current = window.scrollY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return null;
}

