"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Wedding background music — updated to use /videos/backgroundmusic.m4a
// ---------------------------------------------------------------------------
const MUSIC_SRC = "/videos/backgroundmusic.m4a";

const START_VOLUME = 0.08; // 8 %
const TARGET_VOLUME = 0.45; // 45 %
const FADE_DURATION_MS = 6000; // 6 seconds to ramp from 8 → 45 %

// ---------------------------------------------------------------------------
// MusicPlayer
// Fixed pill button at bottom-right.  Music auto-starts (muted ramp) when
// the main invitation is revealed; user can toggle play / pause at any time.
// ---------------------------------------------------------------------------
export function MusicPlayer({ autoPlay = true }: { autoPlay?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rampRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false); // show button only after canplay
  const [visible, setVisible] = useState(false); // fade-in entrance
  const hasStartedRef = useRef(false);

  // ── Smooth volume ramp: START_VOLUME → TARGET_VOLUME over FADE_DURATION ─
  const startVolumeRamp = useCallback(() => {
    if (rampRef.current) clearInterval(rampRef.current);
    const audio = audioRef.current;
    if (!audio) return;

    const steps = 40;
    const stepMs = FADE_DURATION_MS / steps;
    const stepSize = (TARGET_VOLUME - START_VOLUME) / steps;
    let current = audio.volume;

    rampRef.current = setInterval(() => {
      if (!audioRef.current) return;
      current = Math.min(TARGET_VOLUME, current + stepSize);
      audioRef.current.volume = current;
      if (current >= TARGET_VOLUME) {
        clearInterval(rampRef.current!);
        rampRef.current = null;
      }
    }, stepMs);
  }, []);

  const tryPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          hasStartedRef.current = true;
          setPlaying(true);
          startVolumeRamp();
        })
        .catch(() => {
          // Autoplay blocked by browser policy without user gesture yet
        });
    }
  }, [startVolumeRamp]);

  // ── Create <audio> once & bind eager start + interaction listeners ───────
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = START_VOLUME;
    audio.preload = "auto";
    audioRef.current = audio;

    const onCanPlay = () => {
      setReady(true);
      setTimeout(() => setVisible(true), 300);
      if (autoPlay && !hasStartedRef.current) {
        tryPlay();
      }
    };
    audio.addEventListener("canplay", onCanPlay, { once: true });
    audio.addEventListener("canplaythrough", onCanPlay, { once: true });

    if (audio.readyState >= 2) {
      onCanPlay();
    }

    if (autoPlay) {
      tryPlay();
    }

    // User gesture fallback for mobile browsers (instant play on very first touch/click/scroll)
    const onUserInteraction = () => {
      if (!hasStartedRef.current && audioRef.current) {
        tryPlay();
      }
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
      window.removeEventListener("click", onUserInteraction);
      window.removeEventListener("keydown", onUserInteraction);
      window.removeEventListener("scroll", onUserInteraction);
    };

    window.addEventListener("pointerdown", onUserInteraction, { passive: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true });
    window.addEventListener("click", onUserInteraction, { passive: true });
    window.addEventListener("keydown", onUserInteraction, { passive: true });
    window.addEventListener("scroll", onUserInteraction, { passive: true });

    const onCustomStart = () => {
      tryPlay();
    };
    window.addEventListener("start-wedding-music", onCustomStart);

    return () => {
      removeListeners();
      window.removeEventListener("start-wedding-music", onCustomStart);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.pause();
      audio.src = "";
    };
  }, [autoPlay, tryPlay]);

  // ── Toggle play / pause ──────────────────────────────────────────────────
  const handleToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          // If volume was ramped down or never ramped, resume it gently
          if (audio.volume < TARGET_VOLUME) startVolumeRamp();
        })
        .catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
      if (rampRef.current) {
        clearInterval(rampRef.current);
        rampRef.current = null;
      }
    }
  }, [startVolumeRamp]);

  // ── Don't render until audio is ready ───────────────────────────────────
  if (!ready) return null;

  return (
    <button
      onClick={handleToggle}
      aria-label={playing ? "Pause music" : "Play music"}
      title={playing ? "Pause music" : "Play music"}
      style={{
        // ── Position ───────────────────────────────────────────────────
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,

        // ── Size & shape ───────────────────────────────────────────────
        width: "52px",
        height: "52px",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        // ── Golden gradient matching the uploaded reference image ───────
        background:
          "linear-gradient(135deg, #c8a94a 0%, #e2c060 40%, #b8923a 100%)",
        boxShadow:
          "0 4px 20px rgba(180, 140, 40, 0.45), 0 2px 8px rgba(0,0,0,0.25)",

        // ── Entrance fade-in ───────────────────────────────────────────
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.8) translateY(12px)",
        transition:
          "opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",

        // ── Hover handled via inline pseudo—use a wrapper instead ──────
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform =
          "scale(1.1) translateY(-2px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 8px 28px rgba(180, 140, 40, 0.6), 0 3px 10px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform =
          "scale(1) translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 4px 20px rgba(180, 140, 40, 0.45), 0 2px 8px rgba(0,0,0,0.25)";
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform =
          "scale(1.1) translateY(-2px)";
      }}
    >
      {playing ? (
        /* ── Pause icon (two vertical bars) ─────────────────────────── */
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <rect x="4" y="3" width="4" height="14" rx="1.5" fill="#3a2410" />
          <rect x="12" y="3" width="4" height="14" rx="1.5" fill="#3a2410" />
        </svg>
      ) : (
        /* ── Play icon (triangle) ────────────────────────────────────── */
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 3.5L16.5 10 6 16.5V3.5Z"
            fill="#3a2410"
            stroke="#3a2410"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* ── Ripple ring when playing ─────────────────────────────────── */}
      {playing && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-6px",
            borderRadius: "18px",
            border: "1.5px solid rgba(200, 169, 74, 0.5)",
            animation: "music-pulse 2s ease-out infinite",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Keyframes injected once ──────────────────────────────────── */}
      <style>{`
        @keyframes music-pulse {
          0%   { opacity: 0.8; transform: scale(1); }
          70%  { opacity: 0;   transform: scale(1.35); }
          100% { opacity: 0;   transform: scale(1.35); }
        }
      `}</style>
    </button>
  );
}

