"use client";

import * as React from "react";
import Link from "next/link";
import {
  CoverflowCarousel,
  type CoverflowSlide,
} from "@/components/ui/coverflow-carousel";
import { VaporCountdown } from "@/components/ui/vapor-countdown";

const SAMPLE_SLIDES: CoverflowSlide[] = [
  {
    src: "/images/COUPLE_POSE2.png",
    alt: "Slide 1 - Eternal Bond",
    title: "Eternal Bond",
    subtitle: "Akhilesh & Rakhi",
    objectPosition: "center 22%",
    meta: [
      { label: "Date", value: "09 Dec 2026" },
      { label: "Location", value: "Hajipur, Bihar" },
    ],
  },
  {
    src: "/images/COUPLE_POSE1.webp",
    alt: "Slide 2 - Joyful Celebration",
    title: "Joyful Celebration",
    subtitle: "Haldi & Mehndi Festivities",
    objectPosition: "center 18%",
    meta: [
      { label: "Ritual", value: "Haldi Mehndi" },
      { label: "Time", value: "Evening" },
    ],
  },
  {
    src: "/images/COUPLE_POSE4.png",
    alt: "Slide 3 - Cherished Memories",
    title: "Cherished Memories",
    subtitle: "Precious Family Moments",
    objectPosition: "center 22%",
    meta: [
      { label: "Chapter", value: "Beginning" },
      { label: "Vibe", value: "Warm & Blissful" },
    ],
  },
  {
    src: "/images/COUPLE_POSE3.webp",
    alt: "Slide 4 - Pure Radiance",
    title: "Pure Radiance",
    subtitle: "Together Forever",
    objectPosition: "center 18%",
    meta: [
      { label: "Status", value: "Soulmates" },
      { label: "Smiles", value: "Infinite" },
    ],
  },
  {
    src: "/images/COUPLE_POSE5.png",
    alt: "Slide 5 - Sacred Vows",
    title: "Sacred Vows",
    subtitle: "Blessings & Prayers",
    objectPosition: "center 18%",
    meta: [
      { label: "Ceremony", value: "Vivah" },
      { label: "Shubh Muhurat", value: "09.12.2026" },
    ],
  },
];

export default function ShowcasePage() {
  const [showNav, setShowNav] = React.useState(true);
  const [showPag, setShowPag] = React.useState(true);
  const [showCap, setShowCap] = React.useState(true);
  const [loop, setLoop] = React.useState(true);

  // Default to wedding date for DAYS, HOURS, MINUTES, SECONDS
  const [targetDate, setTargetDate] = React.useState<Date>(() => {
    return new Date("2026-12-09T00:00:00");
  });

  const [useFourUnits, setUseFourUnits] = React.useState(true);

  return (
    <div className="min-h-screen bg-[#140b10] text-[#f6e1bb] px-4 py-12 md:py-20">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif tracking-tight font-medium text-[#f6e1bb]">
              Component Showcase
            </h1>
            <p className="mt-2 text-sm md:text-base text-[#f6e1bb]/70">
              Interactive preview of CoverflowCarousel &amp; VaporCountdown
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/40 bg-[#231119] text-[#f6e1bb] hover:bg-[#341a26] transition text-sm w-fit"
          >
            ← Back to Wedding Home
          </Link>
        </div>

        {/* Section 1: CoverflowCarousel */}
        <section className="space-y-6">
          <div className="border-b border-[#d4af37]/20 pb-4">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold">
              1. CoverflowCarousel
            </h2>
            <p className="text-sm text-[#f6e1bb]/70 mt-1">
              Physics-assisted 3D carousel with perspective rake, drag throw,
              keyboard controls, and loop wrapping.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer bg-[#231119] px-3 py-1.5 rounded-lg border border-[#d4af37]/20">
              <input
                type="checkbox"
                checked={showNav}
                onChange={(e) => setShowNav(e.target.checked)}
              />
              Show Navigation
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-[#231119] px-3 py-1.5 rounded-lg border border-[#d4af37]/20">
              <input
                type="checkbox"
                checked={showPag}
                onChange={(e) => setShowPag(e.target.checked)}
              />
              Show Pagination
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-[#231119] px-3 py-1.5 rounded-lg border border-[#d4af37]/20">
              <input
                type="checkbox"
                checked={showCap}
                onChange={(e) => setShowCap(e.target.checked)}
              />
              Show Captions &amp; Meta
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-[#231119] px-3 py-1.5 rounded-lg border border-[#d4af37]/20">
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
              />
              Loop Infinite
            </label>
          </div>

          {/* Component Container */}
          <div className="rounded-2xl border border-[#d4af37]/20 bg-[#1b0d15]/80 p-4 md:p-8 shadow-2xl backdrop-blur-sm">
            <CoverflowCarousel
              slides={SAMPLE_SLIDES}
              showNavigation={showNav}
              showPagination={showPag}
              showCaption={showCap}
              loop={loop}
              cardWidth="clamp(180px, 24vw, 280px)"
            />
          </div>
        </section>

        {/* Section 2: VaporCountdown */}
        <section className="space-y-6">
          <div className="border-b border-[#d4af37]/20 pb-4">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold">
              2. VaporCountdown (Days, Hours, Minutes, Seconds)
            </h2>
            <p className="text-sm text-[#f6e1bb]/70 mt-1">
              Live particle countdown canvas where outgoing digits sublimate
              into curl-noise vapor grains and condense into incoming digits.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => {
                setUseFourUnits(true);
                setTargetDate(new Date("2026-12-09T00:00:00"));
              }}
              className="px-3 py-1.5 rounded-lg border border-[#d4af37]/30 bg-[#231119] hover:bg-[#341a26] transition"
            >
              Wedding Date (Days + Hours + Mins + Secs)
            </button>
            <button
              type="button"
              onClick={() => {
                setUseFourUnits(true);
                setTargetDate(new Date(Date.now() + 5 * 24 * 3600 * 1000 + 4 * 3600 * 1000 + 12 * 60 * 1000 + 30 * 1000));
              }}
              className="px-3 py-1.5 rounded-lg border border-[#d4af37]/30 bg-[#231119] hover:bg-[#341a26] transition"
            >
              +5 Days Test
            </button>
            <button
              type="button"
              onClick={() => {
                setUseFourUnits(false);
                setTargetDate(new Date(Date.now() + 2 * 60 * 1000 + 45 * 1000));
              }}
              className="px-3 py-1.5 rounded-lg border border-[#d4af37]/30 bg-[#231119] hover:bg-[#341a26] transition"
            >
              3 Units (Hours, Mins, Secs)
            </button>
          </div>

          {/* Component Container */}
          <div className="rounded-2xl border border-[#d4af37]/20 bg-[#1b0d15]/80 p-6 md:p-14 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm overflow-hidden">
            <VaporCountdown
              targetDate={targetDate}
              labels={
                useFourUnits
                  ? ["DAYS", "HOURS", "MINUTES", "SECONDS"]
                  : ["HOURS", "MINUTES", "SECONDS"]
              }
              className="text-[#f6e1bb]"
            />
            <p className="mt-6 text-xs text-[#f6e1bb]/60 tracking-wider font-mono uppercase">
              Target: {targetDate.toLocaleString()}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

