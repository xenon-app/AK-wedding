"use client";

import { useEffect } from "react";

// Wedding date: 09.12.2026
const TARGET = new Date("2026-12-09T00:00:00").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll(".framer-lpl8ib-container p")
    );
    if (els.length === 0) return;

    function update() {
      const now = Date.now();
      let diff = TARGET - now;
      if (diff < 0) diff = 0;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      const text = `${pad(days)}:${pad(hours)}:${pad(mins)}:${pad(secs)}`;
      els.forEach((el) => {
        const e = el as HTMLElement;
        e.style.visibility = "visible";
        e.textContent = text;
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return null;
}

