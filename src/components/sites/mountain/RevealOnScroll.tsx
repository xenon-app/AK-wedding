"use client";

import { useEffect } from "react";

export function RevealOnScroll() {
  useEffect(() => {
    const sel = '[style*="opacity:0.001"],[style*="opacity: 0.001"]';

    function reveal(el: Element) {
      const e = el as HTMLElement;
      e.style.opacity = "1";
      e.style.transform = "none";
      e.style.filter = "none";
    }

    const els = Array.from(document.querySelectorAll(sel));
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(reveal);
      return;
    }

    // 1. Immediately reveal all elements in the top 2.5 viewports to avoid any delay
    const initialCutoff = window.innerHeight * 2.5;
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= initialCutoff) {
        reveal(el);
      }
    });

    // 2. High-performance proactive observer with 1000px lookahead
    // Elements are revealed long before they enter the screen, completely
    // eliminating white screens or pop-ins during fast scrolling.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "1000px 0px 1000px 0px",
      },
    );

    els.forEach((el) => {
      // Only observe elements that haven't been revealed yet
      const h = el as HTMLElement;
      if (h.style.opacity !== "1") {
        io.observe(el);
      }
    });

    // 3. Fast scroll velocity detector:
    // If user scrolls rapidly, proactively reveal all elements ahead of time
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const handleFastScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dy = Math.abs(window.scrollY - lastScrollY);
      const velocity = dy / dt; // px per ms

      lastScrollY = window.scrollY;
      lastTime = now;

      // If scrolling fast (> 1.2 px/ms), eagerly reveal elements ahead
      if (velocity > 1.2) {
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + window.innerHeight * 3.5;

        els.forEach((el) => {
          const h = el as HTMLElement;
          if (h.style.opacity !== "1") {
            const rect = el.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            if (absoluteTop <= viewportBottom) {
              reveal(el);
              io.unobserve(el);
            }
          }
        });
      }
    };

    window.addEventListener("scroll", handleFastScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", handleFastScroll);
    };
  }, []);

  return null;
}

