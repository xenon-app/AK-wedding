"use client";

import { mountainStyles, mountainBody } from "@/lib/mountain-html";
import { RevealOnScroll } from "@/components/sites/mountain/RevealOnScroll";
import { Countdown } from "@/components/sites/mountain/Countdown";
import { LargeCountdown } from "@/components/sites/mountain/LargeCountdown";
import { MomentsImage } from "@/components/sites/mountain/MomentsImage";
import { RemoveBottomCountdown } from "@/components/sites/mountain/RemoveBottomCountdown";
import { LocketPhotos } from "@/components/sites/mountain/LocketPhotos";
import { WeddingInvitation } from "@/components/sites/mountain/WeddingInvitation";
import { MusicPlayer } from "@/components/sites/mountain/MusicPlayer";
import { EventsSection } from "@/components/sites/mountain/EventsSection";
import { useState, useCallback } from "react";

export default function Home() {
  const [showInvitation, setShowInvitation] = useState(true);
  const [mainReady, setMainReady] = useState(false);

  // Called the exact instant the ink transition covers 100% of the screen
  const handleEnter = useCallback(() => {
    setMainReady(true);
  }, []);

  // Called when the invitation overlay has completely dissolved away
  const handleComplete = useCallback(() => {
    setShowInvitation(false);
  }, []);

  return (
    <>
      {/* ── Wedding Invitation Entry Experience ─────────────────────── */}
      {showInvitation && (
        <WeddingInvitation
          onEnter={handleEnter}
          onComplete={handleComplete}
        />
      )}

      {/* ── Smooth inertia scroll controller (removed) ──────────────── */}

      {/* ── Main wedding website ─────────────────────────────────────── */}
      <div
        style={{
          opacity: mainReady ? 1 : 0,
          transform: mainReady ? "translateY(0)" : "translateY(16px)",
          transition:
            "opacity 0.75s cubic-bezier(0.22,0.61,0.36,1), transform 0.75s cubic-bezier(0.22,0.61,0.36,1)",
          pointerEvents: mainReady ? "auto" : "none",
          willChange: "opacity, transform",
          backgroundColor: "#022938",
          minHeight: "100vh",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: mountainStyles }} />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Guaranteed deep midnight background prevents any white flash during scroll */
              html, body, #main, .mountain-clone, [data-framer-root] {
                background: #022938 !important;
                background-color: #022938 !important;
              }

              html {
                scroll-behavior: smooth;
              }

              /* Snappy, ultra-smooth scroll reveal transitions (no sluggish 0.9s delay) */
              [style*="opacity:0.001"],[style*="opacity: 0.001"]{
                transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                            filter 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                will-change: opacity, transform;
              }

              @keyframes spin-phone {
                0% { transform: rotate(1002deg); }
                100% { transform: rotate(1362deg); }
              }
              @keyframes float-balloon {
                0%, 100% { transform: translateX(-21px) translateY(83px); }
                50% { transform: translateX(-21px) translateY(70px); }
              }
              [style*="rotate(1002deg)"] { animation: spin-phone 6s linear infinite; }
              [style*="translateX(-21px) translateY(83px)"] { animation: float-balloon 4s ease-in-out infinite; }
              @keyframes float-moon { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
              @keyframes float-om { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-18px); } }
              @keyframes float-shiva { 0%,100% { transform: translateX(-50%) translateY(-100px); } 50% { transform: translateX(-50%) translateY(-82px); } }
              @keyframes sway-leaves { 0%,100% { transform: translateY(-70px) rotate(0deg); } 50% { transform: translateY(-70px) rotate(4deg); } }
              @keyframes sway-bigleaves { 0%,100% { transform: translateY(-200px) rotate(0deg); } 50% { transform: translateY(-200px) rotate(2.5deg); } }
              @keyframes float-ganesha { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
              [data-framer-name="The moon"] { animation: float-moon 5s ease-in-out infinite; }
              [data-framer-name="Shiva"] { animation: float-shiva 5s ease-in-out infinite; }
              [data-framer-name="Leaves - Right"] { animation: sway-leaves 6s ease-in-out infinite; }
              [data-framer-name="Leaves - Left"] { animation: sway-leaves 6s ease-in-out infinite reverse; }
              [data-framer-name="Big leaves - R"] { animation: sway-bigleaves 7s ease-in-out infinite; }
              [data-framer-name="Big leaves - L"] { animation: sway-bigleaves 7s ease-in-out infinite reverse; }
              [data-framer-name="Ganesha ji (left)"] { animation: float-ganesha 4s ease-in-out infinite; }
              [data-framer-name="Ganesha ji (right)"] { animation: float-ganesha 4s ease-in-out infinite 0.6s; }
              [data-framer-name="Om "] { animation: float-om 6s ease-in-out infinite 0.3s; }

              /* Center Bride & Groom Locket frame visibility */
              .framer-147vwyo-container {
                opacity: 1 !important;
                visibility: visible !important;
              }

              /* Hide the Framer built-in audio player widget */
              .framer-yF5Cc,
              audio.framer-audio,
              .framer-audio-icon,
              .framer-audio-icons {
                display: none !important;
              }

              /* ── Fix: Moments carousel + With Gratitude overlap ─────────
                 The Framer layout uses absolute positioning and large padding
                 values that cause framer-14m6es5 (With Gratitude) to visually
                 sit on top of the Moments carousel (#instagram).
                 We convert the parent (ycacil) to natural flow, make the
                 instagram container position:relative so it takes normal flow
                 space, then reset the gratitude section to a compact card.
              ────────────────────────────────────────────────────────────── */

              /* Parent wrapper: convert to flex column flow with 8px gap */
              .framer-ycacil {
                height: auto !important;
                min-height: auto !important;
                padding: 0 !important;
                flex-flow: column !important;
                align-items: center !important;
                gap: 8px !important;
                overflow: visible !important;
                position: relative !important;
              }

              /* Moments carousel container: take natural flow space */
              .framer-1l046i8-container {
                position: relative !important;
                top: auto !important;
                left: auto !important;
                right: auto !important;
                width: 100% !important;
                max-width: 614px !important;
                height: auto !important;
                min-height: 320px !important;
                flex: none !important;
                z-index: 2 !important;
                margin: 0 auto !important;
              }

              /* Bottom Gratitude Section: compact, card-style, no overlap */
              .framer-14m6es5 {
                mix-blend-mode: normal !important;
                position: relative !important;
                top: auto !important;
                height: auto !important;
                min-height: auto !important;
                padding: 48px 24px 60px !important;
                gap: 0 !important;
                overflow: visible !important;
                z-index: 1 !important;
                width: 100% !important;
                max-width: 580px !important;
                margin: 0 auto !important;
                background: rgba(255,255,255,0.92) !important;
                border-radius: 20px !important;
                box-shadow: 0 8px 40px rgba(0,0,0,0.10) !important;
              }

              /* Hide the elements we don't want inside the card */
              .framer-14m6es5 .framer-f5ej2j,
              .framer-14m6es5 .framer-1k1j90h-container,
              .framer-14m6es5 .framer-wjiunu {
                display: none !important;
              }

              /* ── Event Cards: 2 Rows Layout ───────────────────────────── */
              [data-framer-name="Event Cards"],
              .framer-1qb2nt1 {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 40px !important;
                width: 100% !important;
                max-width: 1200px !important;
                margin: 0 auto !important;
                height: auto !important;
                overflow: visible !important;
              }

              .events-row-1 {
                display: flex !important;
                flex-direction: row !important;
                justify-content: center !important;
                align-items: flex-start !important;
                gap: 40px !important;
                width: 100% !important;
                max-width: 1050px !important;
                flex-wrap: wrap !important;
              }

              .events-row-2 {
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                max-width: 1050px !important;
              }

              .event-location-btn {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 9px 24px !important;
                border: 1.5px solid #ab9546 !important;
                border-radius: 9999px !important;
                color: #f6e1bb !important;
                background: rgba(171, 149, 70, 0.16) !important;
                font-family: 'Cormorant', serif !important;
                font-size: 15px !important;
                font-weight: 700 !important;
                text-decoration: none !important;
                letter-spacing: 0.5px !important;
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
                cursor: pointer !important;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
                user-select: none !important;
              }

              .event-location-btn:hover {
                background: rgba(171, 149, 70, 0.38) !important;
                color: #ffffff !important;
                border-color: #f6e1bb !important;
                transform: translateY(-2px) scale(1.02) !important;
                box-shadow: 0 6px 20px rgba(171, 149, 70, 0.45) !important;
              }

              .event-location-btn:active {
                transform: translateY(0) scale(0.98) !important;
              }

              @media (max-width: 809.98px) {
                .events-row-1 {
                  flex-direction: column !important;
                  align-items: center !important;
                  gap: 32px !important;
                }
              }

              /* ── Mobile & Tablet Pointer-Events & Z-Index Fix ────────── */
              .framer-vp0bm4,
              [data-framer-name="Section 2"],
              .framer-9412jb,
              [data-framer-name="Content"],
              [data-framer-name="Event Cards"],
              .framer-1qb2nt1,
              .events-row-1,
              .events-row-2,
              .event-location-btn {
                pointer-events: auto !important;
                z-index: 20 !important;
              }

              /* Decorative floating elements must never capture touch / clicks */
              .framer-1qi7tcr,
              .framer-1noxxhl,
              .framer-1mbm3vh {
                pointer-events: none !important;
              }

              /* ── 7.3 Huge blank space after countdown fix ─────────────── */
              .framer-16l2pdg,
              .framer-1mus9pp {
                height: auto !important;
                min-height: auto !important;
              }
            `,
          }}
        />
        <div
          className="mountain-clone"
          dangerouslySetInnerHTML={{ __html: mountainBody }}
        />
        <RevealOnScroll />
        <Countdown />
        <LargeCountdown />
        <MomentsImage />
        <EventsSection />
        <RemoveBottomCountdown />
        <LocketPhotos />
      </div>

      {/* ── Music player (bottom-right) — auto-starts on website start ──── */}
      <MusicPlayer autoPlay={true} />
    </>
  );
}

