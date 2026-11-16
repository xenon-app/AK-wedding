"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { startAssetPreloader, PreloadStatus } from "@/lib/asset-preloader";

interface WeddingInvitationProps {
  onEnter: () => void;
  onComplete: () => void;
}

/* ─── Flower Petal Types & Palettes ───────────────────────────────────── */
type PetalType = "lotus" | "rose" | "marigold" | "jasmine";

interface FlowerPetal {
  x: number;
  y: number;
  z: number; // 0.6 (distant/small) to 1.4 (foreground/large)
  length: number;
  width: number;
  type: PetalType;
  colorTip: string;
  colorMid: string;
  colorBase: string;
  vy: number; // falling speed
  vx: number; // base horizontal drift
  swaySpeed: number; // oscillation frequency
  swayAmp: number; // oscillation amplitude
  swayPhase: number;
  rotX: number; // 3D flip angle
  rotY: number; // 3D tumble angle
  rotZ: number; // 2D plane spin
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  opacity: number;
}

interface GoldSparkle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  alpha: number;
  pulseSpeed: number;
  phase: number;
}

/* ─── Ink Blob Canvas Helpers ─────────────────────────────────────────── */
function buildBlobPoints(
  cx: number,
  cy: number,
  radius: number,
  t: number,
  seed: number[],
): { x: number; y: number }[] {
  const N = 14;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2;
    const wobble = 1 + 0.24 * Math.sin(seed[i] * 6.28 + t * 4.5);
    const r = radius * wobble;
    pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return pts;
}

function drawBlob(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[],
  color: string,
) {
  ctx.beginPath();
  const n = pts.length;
  ctx.moveTo((pts[0].x + pts[n - 1].x) / 2, (pts[0].y + pts[n - 1].y) / 2);
  for (let i = 0; i < n; i++) {
    const p0 = pts[i];
    const p1 = pts[(i + 1) % n];
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    ctx.quadraticCurveTo(p0.x, p0.y, mx, my);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/* ─── Main Component ──────────────────────────────────────────────────── */
export function WeddingInvitation({ onEnter, onComplete }: WeddingInvitationProps) {
  const [phase, setPhase] = useState<
    "idle" | "button-out" | "ink" | "dissolving"
  >("idle");

  // Preloader readiness & progress state
  const [preloadStatus, setPreloadStatus] = useState<PreloadStatus>({
    total: 0,
    loaded: 0,
    failed: 0,
    progress: 0,
    isCriticalReady: false,
    isAllReady: false,
  });
  const [isReady, setIsReady] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [userClicked, setUserClicked] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const prefersReducedRef = useRef(false);
  const onEnterRef = useRef(onEnter);
  const onCompleteRef = useRef(onComplete);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const petalRafRef = useRef<number | null>(null);
  const inkStartRef = useRef<number>(0);
  const blobSeedRef = useRef<number[]>([]);
  const petalsRef = useRef<FlowerPetal[]>([]);
  const sparklesRef = useRef<GoldSparkle[]>([]);
  const transitionTriggeredRef = useRef(false);

  // Keep callback refs fresh
  useEffect(() => {
    onEnterRef.current = onEnter;
    onCompleteRef.current = onComplete;
  }, [onEnter, onComplete]);

  // Seed for ink organic blob
  useEffect(() => {
    blobSeedRef.current = Array.from({ length: 14 }, () => Math.random());
  }, []);

  // Detect reduced motion without calling setState in effect body
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedRef.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── Petal Spawner Helper ─────────────────────────────────────────── */
  const createPetal = useCallback(
    (w: number, h: number, startAtTop = false): FlowerPetal => {
      const typeRand = Math.random();
      let type: PetalType = "lotus";
      let colorTip = "#F8C6D4";
      let colorMid = "#EAA9B8";
      let colorBase = "#C95A75";
      let length = 18 + Math.random() * 14;
      let width = 10 + Math.random() * 8;

      if (typeRand < 0.42) {
        // Lotus petal (pink pastel with crimson base)
        type = "lotus";
        colorTip = "#FFE5EC";
        colorMid = "#F3B2C3";
        colorBase = "#C04261";
        length = 20 + Math.random() * 16;
        width = 11 + Math.random() * 9;
      } else if (typeRand < 0.68) {
        // Rose petal (velvety ruby)
        type = "rose";
        colorTip = "#E8637F";
        colorMid = "#BA2347";
        colorBase = "#750E24";
        length = 16 + Math.random() * 12;
        width = 13 + Math.random() * 9;
      } else if (typeRand < 0.88) {
        // Marigold / Genda phool petal (saffron golden)
        type = "marigold";
        colorTip = "#FFE27A";
        colorMid = "#FFAA00";
        colorBase = "#D46B08";
        length = 14 + Math.random() * 10;
        width = 6 + Math.random() * 5;
      } else {
        // Jasmine / Mogra blossom (mini white star flower)
        type = "jasmine";
        colorTip = "#FFFFFF";
        colorMid = "#FFF9EC";
        colorBase = "#F5DE98";
        length = 12 + Math.random() * 6;
        width = 12 + Math.random() * 6;
      }

      const z = 0.65 + Math.random() * 0.75; // depth factor

      return {
        x: Math.random() * w,
        y: startAtTop ? -40 - Math.random() * 60 : Math.random() * h,
        z,
        length: length * z,
        width: width * z,
        type,
        colorTip,
        colorMid,
        colorBase,
        vy: (0.9 + Math.random() * 1.3) * z,
        vx: (Math.random() - 0.5) * 0.4,
        swaySpeed: 0.015 + Math.random() * 0.025,
        swayAmp: 25 + Math.random() * 35,
        swayPhase: Math.random() * Math.PI * 2,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: 0.01 + Math.random() * 0.025,
        vRotY: 0.012 + Math.random() * 0.028,
        vRotZ: (Math.random() - 0.5) * 0.02,
        opacity: (0.7 + Math.random() * 0.3) * Math.min(z, 1),
      };
    },
    [],
  );

  /* ── Falling Flower Petals & Gold Sparkles Animation Loop ──────────── */
  useEffect(() => {
    const canvas = petalCanvasRef.current;
    if (!canvas || prefersReducedRef.current) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Spawn 45 initial flower petals distributed across the full viewport
    petalsRef.current = Array.from({ length: 45 }, () =>
      createPetal(canvas.width, canvas.height, false),
    );

    // Spawn 28 ambient twinkling golden sparkles (diya/stardust)
    sparklesRef.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2.5,
      vy: -0.2 - Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.3,
      alpha: 0.2 + Math.random() * 0.6,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw twinkling golden stardust particles
      sparklesRef.current.forEach((sp) => {
        sp.y += sp.vy;
        sp.x += sp.vx;
        sp.phase += sp.pulseSpeed;
        const currentAlpha = sp.alpha * (0.5 + 0.5 * Math.sin(sp.phase));

        if (sp.y < -10) {
          sp.y = canvas.height + 10;
          sp.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 222, 152, ${currentAlpha.toFixed(3)})`;
        ctx.shadowColor = "rgba(229, 195, 101, 0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw falling flower petals with 3D fluttering physics
      petalsRef.current.forEach((p) => {
        p.y += p.vy;
        p.swayPhase += p.swaySpeed;
        p.x += Math.sin(p.swayPhase) * (p.swayAmp * 0.03) + p.vx;
        p.rotX += p.vRotX;
        p.rotY += p.vRotY;
        p.rotZ += p.vRotZ;

        // Reset petal once it leaves bottom edge
        if (p.y > canvas.height + 40) {
          Object.assign(p, createPetal(canvas.width, canvas.height, true));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotZ);

        // 3D perspective tumbling: scale by cos/sin of rotation angles
        const scaleX = Math.cos(p.rotX);
        const scaleY = Math.sin(p.rotY);
        ctx.scale(scaleX, scaleY);

        ctx.globalAlpha = p.opacity;

        if (p.type === "jasmine") {
          // Mogra / Jasmine 5-petal star blossom
          for (let j = 0; j < 5; j++) {
            ctx.save();
            ctx.rotate((j / 5) * Math.PI * 2);
            ctx.beginPath();
            ctx.ellipse(
              0,
              -p.length * 0.45,
              p.width * 0.28,
              p.length * 0.45,
              0,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = "rgba(255, 252, 245, 0.95)";
            ctx.fill();
            ctx.restore();
          }
          // Center golden stamen
          ctx.beginPath();
          ctx.arc(0, 0, p.length * 0.16, 0, Math.PI * 2);
          ctx.fillStyle = "#FFB703";
          ctx.fill();
        } else {
          // Teardrop curved organic petal (lotus / rose / marigold)
          const h = p.length;
          const w = p.width;

          ctx.beginPath();
          ctx.moveTo(0, -h / 2); // petal tip
          ctx.bezierCurveTo(w / 2, -h / 3, w / 2, h / 3, 0, h / 2); // right side to base
          ctx.bezierCurveTo(-w / 2, h / 3, -w / 2, -h / 3, 0, -h / 2); // left side back to tip
          ctx.closePath();

          // Organic color gradient from tip to base
          const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
          grad.addColorStop(0, p.colorTip);
          grad.addColorStop(0.5, p.colorMid);
          grad.addColorStop(1, p.colorBase);
          ctx.fillStyle = grad;
          ctx.fill();

          // Delicate center spine / vein highlight
          ctx.beginPath();
          ctx.moveTo(0, -h / 2 + 2);
          ctx.quadraticCurveTo(w * 0.08, 0, 0, h / 2 - 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        ctx.restore();
      });

      petalRafRef.current = requestAnimationFrame(render);
    };

    petalRafRef.current = requestAnimationFrame(render);

    return () => {
      if (petalRafRef.current !== null) {
        cancelAnimationFrame(petalRafRef.current);
      }
      window.removeEventListener("resize", resize);
    };
  }, [createPetal]);

  /* ── Ink Reveal Canvas ─────────────────────────────────────────────── */
  const startInkAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxR =
      Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) /
        2 +
      60;

    const DURATION = 1000;
    inkStartRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - inkStartRef.current;
      const rawT = Math.min(elapsed / DURATION, 1);
      const t =
        rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const radius = maxR * t;
      const pts = buildBlobPoints(cx, cy, radius, rawT, blobSeedRef.current);
      drawBlob(ctx, pts, "#520614");

      if (t > 0.08) {
        const pts2 = buildBlobPoints(
          cx,
          cy,
          radius * 0.9,
          rawT * 1.3,
          blobSeedRef.current.map((v) => v * 1.5),
        );
        drawBlob(ctx, pts2, "#680c1d");
      }

      if (t > 0.05 && t < 0.95) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.97, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(229,195,101,${0.6 * (1 - t)})`;
        ctx.lineWidth = 4 * (1 - t) + 1;
        ctx.stroke();
      }

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Screen is now 100% covered in deep royal maroon ink!
        // Activate the pre-decoded, fully prepared main site underneath
        onEnterRef.current();
        // Start dissolving the entire invitation overlay into the main site
        setPhase("dissolving");
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  /* ── Execute Smooth Cinematic Transition ───────────────────────────── */
  const executeTransition = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("start-wedding-music"));
    }
    if (transitionTriggeredRef.current) return;
    transitionTriggeredRef.current = true;

    if (prefersReducedRef.current) {
      onEnterRef.current();
      setPhase("dissolving");
      return;
    }

    setPhase("button-out");

    const t1 = setTimeout(() => {
      setPhase("ink");
      startInkAnimation();
    }, 350);

    return () => clearTimeout(t1);
  }, [startInkAnimation]);

  /* ── Background Preloading & Readiness System ─────────────────────── */
  useEffect(() => {
    let unmounted = false;

    startAssetPreloader((status) => {
      if (!unmounted) {
        setPreloadStatus(status);
      }
    }).then(({ isReady: assetsReady }) => {
      if (!unmounted) {
        setIsReady(assetsReady);
        setHasLoadError(!assetsReady);
        if (assetsReady) executeTransition();
      }
    });

    return () => {
      unmounted = true;
    };
  }, [executeTransition, retryCount]);

  /* ── User Interaction: View Your Invitation Click ─────────────────── */
  const handleClick = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("start-wedding-music"));
    }
    if (phase !== "idle") return;
    if (hasLoadError) {
      setUserClicked(true);
      setIsReady(false);
      setHasLoadError(false);
      setPreloadStatus((status) => ({
        ...status,
        loaded: 0,
        failed: 0,
        progress: 0,
        isCriticalReady: false,
        isAllReady: false,
      }));
      setRetryCount((count) => count + 1);
      return;
    }
    setUserClicked(true);

    // If assets are already fully ready, execute transition immediately
    if (isReady) {
      executeTransition();
    }
    // If assets are still downloading/decoding, the preloader promise will
    // automatically trigger executeTransition the millisecond readiness completes!
  }, [phase, isReady, hasLoadError, executeTransition]);

  // When dissolving begins, wait for the fade-out to complete, then unmount
  useEffect(() => {
    if (phase !== "dissolving") return;

    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 800);

    return () => clearTimeout(timer);
  }, [phase]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const contentVisible = phase === "idle" || phase === "button-out";
  const inkVisible = phase === "ink" || phase === "dissolving";
  const isDissolving = phase === "dissolving";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // True Edge-to-Edge Full Screen Royal Artwork
        backgroundImage: "url('/images/invitation-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        // Smoothly dissolve the entire overlay directly into the main site
        opacity: isDissolving ? 0 : 1,
        transition: isDissolving
          ? "opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1)"
          : "none",
        pointerEvents: isDissolving ? "none" : "auto",
        willChange: "opacity",
      }}
      role="dialog"
      aria-label="Wedding Invitation"
      aria-modal="true"
    >
      {/* ── Google Fonts & Styles ─────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@400;500;600;700&display=swap');

        @keyframes gold-shine-sweep {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes aura-pulse {
          0%, 100% {
            box-shadow: 0 0 26px rgba(229,195,101,0.4), 0 8px 30px rgba(0,0,0,0.65);
          }
          50% {
            box-shadow: 0 0 50px rgba(229,195,101,0.75), 0 10px 42px rgba(0,0,0,0.8);
          }
        }

        @keyframes flower-bloom-breathe {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.08) rotate(1.5deg);
          }
        }

        @keyframes petal-glow {
          0%, 100% {
            filter: drop-shadow(0 2px 10px rgba(245, 222, 152, 0.4)) drop-shadow(0 0 20px rgba(234, 169, 184, 0.3));
          }
          50% {
            filter: drop-shadow(0 3px 18px rgba(245, 222, 152, 0.8)) drop-shadow(0 0 30px rgba(234, 169, 184, 0.6));
          }
        }

        .gold-shimmer-title {
          background: linear-gradient(
            120deg,
            #FAF0D7 0%,
            #F5DE98 20%,
            #FFFFFF 45%,
            #E6C268 65%,
            #C5983A 85%,
            #F7E7B4 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gold-shine-sweep 6.5s ease-in-out infinite alternate;
        }

        .lottie-flower-motif {
          animation: flower-bloom-breathe 4.5s ease-in-out infinite, petal-glow 3s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>

      {/* ── Central Soft Vignette for Ultimate Text Legibility ───────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(32, 4, 10, 0.58) 0%, rgba(32, 4, 10, 0.3) 60%, rgba(32, 4, 10, 0) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Flower Dropping & Stardust Canvas Layer (Full Screen) ───── */}
      <canvas
        ref={petalCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden="true"
      />

      {/* ── Edge-to-Edge Full Screen Content Area ──────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: "960px",
          height: "100%",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 4.5vh, 52px) clamp(16px, 5vw, 56px)",
          textAlign: "center",
          boxSizing: "border-box",
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "scale(1)" : "scale(0.96)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* ── Animated Blooming Lotus Blossom Motif ─────────────────── */}
        <div
          className="lottie-flower-motif"
          aria-hidden="true"
          style={{
            marginBottom: "clamp(8px, 1.4vh, 16px)",
            cursor: "default",
          }}
        >
          <svg
            width="56"
            height="46"
            viewBox="0 0 56 46"
            fill="none"
            style={{ overflow: "visible" }}
          >
            {/* Outer Sacred Lotus Petals */}
            <path
              d="M28 2C28 2 21 15 21 24C21 28.5 24 32 28 32C32 32 35 28.5 35 24C35 15 28 2 28 2Z"
              fill="url(#lotus-gold-grad)"
            />
            <path
              d="M17 12C17 12 10 20 11 27C11.8 31 15.5 33.5 19 32C17 28 18.5 20 18.5 20C18.5 20 17.8 15.5 17 12Z"
              fill="url(#lotus-pink-grad)"
              opacity="0.9"
            />
            <path
              d="M39 12C39 12 46 20 45 27C44.2 31 40.5 33.5 37 32C39 28 37.5 20 37.5 20C37.5 20 38.2 15.5 39 12Z"
              fill="url(#lotus-pink-grad)"
              opacity="0.9"
            />
            <path
              d="M8 22C8 22 5 28 8 33C10.5 36.5 15 37 18 34.5C14 32.5 14 26 14 26C14 26 10 23.5 8 22Z"
              fill="url(#lotus-pink-dark)"
              opacity="0.75"
            />
            <path
              d="M48 22C48 22 51 28 48 33C45.5 36.5 41 37 38 34.5C42 32.5 42 26 42 26C42 26 46 23.5 48 22Z"
              fill="url(#lotus-pink-dark)"
              opacity="0.75"
            />
            {/* Lotus Base Pedestal */}
            <circle cx="28" cy="38" r="3" fill="url(#lotus-gold-grad)" />
            <path
              d="M6 38H50"
              stroke="url(#lotus-gold-grad)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Golden Diya Droplet Stamens */}
            <circle cx="24" cy="18" r="1.2" fill="#FFF9E6" />
            <circle cx="28" cy="14" r="1.4" fill="#FFF9E6" />
            <circle cx="32" cy="18" r="1.2" fill="#FFF9E6" />

            <defs>
              <linearGradient
                id="lotus-gold-grad"
                x1="0"
                y1="0"
                x2="56"
                y2="46"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFF9E6" />
                <stop offset="0.4" stopColor="#F5DE98" />
                <stop offset="0.75" stopColor="#E5C365" />
                <stop offset="1" stopColor="#C5983A" />
              </linearGradient>
              <linearGradient
                id="lotus-pink-grad"
                x1="0"
                y1="0"
                x2="56"
                y2="46"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFF0F5" />
                <stop offset="0.5" stopColor="#EAA9B8" />
                <stop offset="1" stopColor="#C95A75" />
              </linearGradient>
              <linearGradient
                id="lotus-pink-dark"
                x1="0"
                y1="0"
                x2="56"
                y2="46"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F3B2C3" />
                <stop offset="0.6" stopColor="#BA2347" />
                <stop offset="1" stopColor="#750E24" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 1. A SPECIAL INVITATION */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "clamp(11px, 1.4vw, 14px)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "#F5DE98",
            fontWeight: 600,
            margin: "0 0 4px",
            textShadow:
              "0 2px 12px rgba(0,0,0,0.9), 0 0 22px rgba(229,195,101,0.45)",
          }}
        >
          A Special Invitation
        </p>

        {/* 2. TOGETHER WITH THEIR FAMILIES */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(14px, 3.5vw, 19px)",
            fontStyle: "italic",
            letterSpacing: "0.08em",
            color: "#F6E8D6",
            margin: "0 0 clamp(8px, 1.5vh, 16px)",
            textShadow: "0 2px 10px rgba(0,0,0,0.85)",
            width: "100%",
            textAlign: "center",
            overflowWrap: "break-word",
          }}
        >
          Together with their Families
        </p>

        {/* Delicate Gold Diamond Divider */}
        <div
          aria-hidden="true"
          style={{
            marginBottom: "clamp(6px, 1.2vh, 14px)",
            opacity: 0.9,
          }}
        >
          <svg
            width="220"
            height="18"
            viewBox="0 0 220 18"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))" }}
          >
            <line
              x1="10"
              y1="9"
              x2="95"
              y2="9"
              stroke="#E5C365"
              strokeWidth="0.8"
            />
            <polygon points="110,3 116,9 110,15 104,9" fill="#E5C365" />
            <circle cx="100" cy="9" r="1.6" fill="#E5C365" />
            <circle cx="120" cy="9" r="1.6" fill="#E5C365" />
            <line
              x1="125"
              y1="9"
              x2="210"
              y2="9"
              stroke="#E5C365"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        {/* 3. YOU ARE CORDIALLY INVITED! */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(22px, 5.5vw, 42px)",
            fontWeight: 500,
            fontStyle: "italic",
            color: "#FFF9F2",
            margin: "0 0 2px",
            lineHeight: 1.15,
            letterSpacing: "0.03em",
            textShadow:
              "0 2px 18px rgba(0,0,0,0.95), 0 0 30px rgba(229,195,101,0.5)",
            width: "100%",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            textAlign: "center",
            padding: "0 4px",
            boxSizing: "border-box",
          }}
        >
          You Are Cordially Invited!
        </h1>

        {/* 4. TO CELEBRATE THE WEDDING OF */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(13px, 3vw, 17px)",
            fontStyle: "italic",
            letterSpacing: "0.1em",
            color: "#EAD2BD",
            margin: "0 0 clamp(6px, 1.2vh, 14px)",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            width: "100%",
            textAlign: "center",
            overflowWrap: "break-word",
          }}
        >
          To celebrate the wedding of
        </p>

        {/* 5. AKHILESH & RAKHI */}
        <h2
          className="gold-shimmer-title"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(28px, 9vw, 64px)",
            fontWeight: 800,
            letterSpacing: "0.08em",
            margin: "0 0 clamp(8px, 1.6vh, 16px)",
            lineHeight: 1.05,
            textShadow:
              "0 4px 22px rgba(0,0,0,0.95), 0 0 45px rgba(229,195,101,0.6)",
            width: "100%",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          Akhilesh &amp; Rakhi
        </h2>

        {/* 6. WEDNESDAY, 9TH DECEMBER 2026 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(10px, 2vw, 20px)",
            margin: "0 0 clamp(10px, 1.8vh, 18px)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "clamp(28px, 5vw, 48px)",
              height: "1px",
              background: "linear-gradient(90deg, transparent, #E5C365)",
            }}
          />
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(10px, 2.8vw, 16px)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#F8E7C9",
              fontWeight: 500,
              margin: 0,
              textShadow:
                "0 2px 12px rgba(0,0,0,0.9), 0 0 18px rgba(229,195,101,0.35)",
              overflowWrap: "break-word",
              textAlign: "center",
            }}
          >
            Wednesday, 9th December 2026
          </p>
          <span
            style={{
              display: "inline-block",
              width: "clamp(28px, 5vw, 48px)",
              height: "1px",
              background: "linear-gradient(90deg, #E5C365, transparent)",
            }}
          />
        </div>

        {/* 7. BLESSING PARAGRAPH */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(13px, 3vw, 16px)",
            fontStyle: "italic",
            color: "#F3E3D0",
            lineHeight: 1.65,
            maxWidth: "520px",
            width: "100%",
            margin: "0 auto clamp(16px, 3vh, 28px) auto",
            textShadow: "0 2px 12px rgba(0,0,0,0.95)",
            overflowWrap: "break-word",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          With the blessings of our families, we invite you to join us in
          celebrating our special day.
        </p>

        {/* 8. VIEW YOUR INVITATION BUTTON */}
        <InvitationButton
          onClick={handleClick}
          disabled={phase !== "idle"}
          userClicked={userClicked}
          isReady={isReady}
          hasLoadError={hasLoadError}
          progress={preloadStatus.progress}
        />

        {/* ── Asset Preparation & Readiness Progress Indicator ────────── */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            width: "100%",
            maxWidth: "240px",
            opacity: phase === "idle" ? 0.95 : 0,
            transition: "opacity 0.3s ease",
          }}
          aria-live="polite"
        >
          {/* Subtle golden glowing progress line */}
          <div
            role="progressbar"
            aria-label="Experience preparation"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={preloadStatus.progress}
            aria-valuetext={
              hasLoadError
                ? "Some resources could not be loaded. Tap to retry."
                : `${preloadStatus.progress}%`
            }
            style={{
              width: "100%",
              height: "2.5px",
              borderRadius: "2px",
              background: "rgba(229, 195, 101, 0.2)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${preloadStatus.progress}%`,
                background:
                  "linear-gradient(90deg, #C5983A, #F5DE98, #FFF9E6)",
                boxShadow: "0 0 8px rgba(229, 195, 101, 0.8)",
                transition: "width 0.25s ease-out",
                borderRadius: "2px",
              }}
            />
          </div>
          <span
            role="status"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10.5px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#F5DE98",
              fontWeight: 500,
              opacity: 0.85,
              textShadow: "0 1px 6px rgba(0,0,0,0.8)",
            }}
          >
            {isReady
              ? "Assets Prepared • Welcome"
              : hasLoadError
                ? "Some resources could not be loaded. Tap to retry."
                : `Preparing Experience • ${preloadStatus.progress}%`}
          </span>
        </div>
      </div>

      {/* ── Ink Reveal Canvas ───────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          pointerEvents: "none",
          display: inkVisible ? "block" : "none",
          opacity: 1,
        }}
        aria-hidden="true"
      />
    </div>
  );
}

/* ─── Button Sub-Component ────────────────────────────────────────────── */
interface InvitationButtonProps {
  onClick: () => void;
  disabled: boolean;
  userClicked: boolean;
  isReady: boolean;
  hasLoadError: boolean;
  progress: number;
}

function InvitationButton({
  onClick,
  disabled,
  userClicked,
  isReady,
  hasLoadError,
  progress,
}: InvitationButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      aria-label={hasLoadError ? "Retry Loading" : "View Your Invitation"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "clamp(13px, 2vh, 16px) clamp(30px, 4.5vw, 46px)",
        background: disabled
          ? "#3B050E"
          : hovered
          ? "linear-gradient(135deg, #8E112A 0%, #600819 50%, #430511 100%)"
          : "linear-gradient(135deg, #780C21 0%, #500614 60%, #36040D 100%)",
        border: "1.5px solid #E5C365",
        borderRadius: "4px",
        color: "#FFF9ED",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "clamp(11px, 1.3vw, 13px)",
        fontWeight: 600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        outline: "none",
        boxShadow: hovered
          ? "0 0 38px rgba(229,195,101,0.7), 0 8px 32px rgba(0,0,0,0.85), inset 0 0 16px rgba(229,195,101,0.3)"
          : "0 0 24px rgba(229,195,101,0.42), 0 6px 26px rgba(0,0,0,0.75), inset 0 0 10px rgba(229,195,101,0.15)",
        transform: pressed
          ? "scale(0.97)"
          : hovered
          ? "scale(1.04)"
          : "scale(1)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        animation: !disabled ? "aura-pulse 2.8s ease-in-out infinite" : "none",
        willChange: "transform, box-shadow",
      }}
    >
      <span>
        {hasLoadError
          ? "Retry Loading"
          : userClicked && !isReady
            ? `Preparing Invitation... ${progress}%`
            : "View Your Invitation"}
      </span>
      {/* Royal decorative arrow */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          transition: "transform 0.25s ease",
        }}
      >
        <path
          d="M2.5 8H13.5M9.5 4L13.5 8L9.5 12"
          stroke="#E5C365"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

