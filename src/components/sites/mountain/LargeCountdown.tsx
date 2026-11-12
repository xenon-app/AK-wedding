"use client";

import { useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { VaporCountdown } from "@/components/ui/vapor-countdown";

// Wedding date: 09.12.2026
const WEDDING_TARGET = new Date("2026-12-09T00:00:00");

function WeddingVaporCountdownSection() {
  return (
    <div
      style={{
        width: "100%",
        padding: "80px 20px",
        boxSizing: "border-box",
        textAlign: "center",
        color: "#f6e1bb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Cormorant Infant', serif",
          fontSize: "clamp(34px, 5.5vw, 64px)",
          fontWeight: 500,
          margin: "0 0 12px",
          color: "#f6e1bb",
          letterSpacing: "1.5px",
        }}
      >
        The countdown begins
      </div>

      <div
        style={{
          fontFamily: "'Cormorant', serif",
          fontSize: "clamp(16px, 2.5vw, 24px)",
          color: "rgba(246, 225, 187, 0.85)",
          fontStyle: "italic",
          marginBottom: "40px",
          letterSpacing: "1px",
        }}
      >
        Until The Auspicious Vivah • 09.12.2026
      </div>

      <div
        style={{
          background: "rgba(35, 17, 25, 0.88)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          borderRadius: "24px",
          padding: "clamp(28px, 6vw, 56px) clamp(16px, 4.5vw, 64px)",
          boxShadow:
            "0 16px 45px rgba(0, 0, 0, 0.35), inset 0 0 35px rgba(212, 175, 55, 0.06)",
          backdropFilter: "blur(10px)",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "100%",
          /* Override Tailwind CSS variables so digit spans + canvas grains
             both render in vivid warm-gold instead of the default foreground */
          ["--foreground" as string]: "#f6e1bb",
          ["--ns-muted" as string]: "rgba(246, 225, 187, 0.75)",
        }}
      >
        <VaporCountdown
          className="text-[#f6e1bb]"
          targetDate={WEDDING_TARGET}
          labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
          scale={1.8}
        />
      </div>
    </div>
  );
}

export function LargeCountdown() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".framer-1mus9pp")
    );

    if (!sections.length) return;

    const roots: Root[] = [];

    sections.forEach((section) => {
      section.innerHTML = "";
      const mount = document.createElement("div");
      mount.style.width = "100%";
      section.appendChild(mount);

      const root = createRoot(mount);
      root.render(<WeddingVaporCountdownSection />);
      roots.push(root);
    });

    return () => {
      setTimeout(() => {
        roots.forEach((r) => {
          try {
            r.unmount();
          } catch {}
        });
      }, 0);
    };
  }, []);

  return null;
}

