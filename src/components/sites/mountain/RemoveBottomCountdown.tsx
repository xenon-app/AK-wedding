"use client";

import { useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";

function GratitudeCard() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "clamp(36px, 6vw, 64px) clamp(20px, 5vw, 48px)",
        borderRadius: "24px",
        background: "rgba(255, 252, 240, 0.92)",
        border: "1.5px solid rgba(184, 148, 62, 0.45)",
        boxShadow:
          "0 16px 48px rgba(92, 45, 12, 0.08), inset 0 0 40px rgba(212, 175, 55, 0.06)",
        backdropFilter: "blur(12px)",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          fontFamily: "'Cormorant Infant', serif",
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 600,
          color: "#3d1428",
          letterSpacing: "3px",
          margin: "0 0 16px",
          textTransform: "uppercase",
        }}
      >
        With Gratitude
      </h2>

      <div
        style={{
          width: "90px",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #b8943e, transparent)",
          margin: "0 auto 28px",
        }}
      />

      <p
        style={{
          fontFamily: "'Cormorant', serif",
          fontSize: "clamp(22px, 3.4vw, 32px)",
          lineHeight: "1.65",
          fontStyle: "italic",
          color: "#4a1c32",
          margin: "0 0 32px",
        }}
      >
        We cordially invite you to be part of our
        <br />
        journey and seek your presence and
        <br />
        blessings for our new beginning.
      </p>

      <div
        style={{
          fontFamily: "'Cormorant Infant', serif",
          fontSize: "clamp(28px, 4.2vw, 44px)",
          fontWeight: 600,
          color: "#3d1428",
          letterSpacing: "2px",
          marginBottom: "12px",
        }}
      >
        Akhilesh &amp; Rakhi
      </div>

      <div
        style={{
          fontFamily: "'Cormorant', serif",
          fontSize: "clamp(20px, 2.8vw, 26px)",
          fontWeight: 500,
          color: "#5a223e",
          marginBottom: "16px",
        }}
      >
        Shri Arjun Chaudhary &amp; Family
      </div>

      <div
        style={{
          fontFamily: "'Cormorant Upright', serif",
          fontSize: "clamp(18px, 2.5vw, 24px)",
          color: "#722b4e",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <a
          href="tel:+919939206876"
          style={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          +91 99392 06876
        </a>
        <span style={{ opacity: 0.5 }}>•</span>
        <a
          href="tel:+917563801193"
          style={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          +91 75638 01193
        </a>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <a
          href="https://wa.me/917563801193"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "8px 22px",
            borderRadius: "9999px",
            background: "#25D366",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "15px",
            fontFamily: "'Cormorant', serif",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
            transition: "all 0.2s ease",
          }}
        >
          RSVP on WhatsApp
        </a>
      </div>

      <div
        style={{
          fontFamily: "'Cormorant', serif",
          fontSize: "clamp(17px, 2.3vw, 22px)",
          color: "#722b4e",
          marginBottom: "32px",
        }}
      >
        Hasanpur Bujurg, Rampur Ratnakar, Jandaha, Vaishali
      </div>

      <div
        style={{
          width: "120px",
          height: "1px",
          background: "rgba(184, 148, 62, 0.3)",
          margin: "0 auto 20px",
        }}
      />

      <div
        style={{
          fontFamily: "'Cormorant', serif",
          fontSize: "clamp(14px, 1.8vw, 17px)",
          color: "#8a3f64",
          letterSpacing: "1px",
        }}
      >
        © Chaudhary Parivaar 2026
      </div>
    </div>
  );
}

export function RemoveBottomCountdown() {
  useEffect(() => {
    // Hide old cut-off text containers & duplicate countdown
    document
      .querySelectorAll(".framer-1k1j90h-container, .framer-f5ej2j, .framer-wjiunu")
      .forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".framer-14m6es5")
    );
    if (!sections.length) return;

    const roots: Root[] = [];

    sections.forEach((section) => {
      // Remove previous mounts if any
      section.querySelectorAll(".injected-gratitude-mount").forEach((m) => m.remove());

      const mount = document.createElement("div");
      mount.style.width = "100%";
      mount.className = "injected-gratitude-mount";
      section.appendChild(mount);

      const root = createRoot(mount);
      root.render(<GratitudeCard />);
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

