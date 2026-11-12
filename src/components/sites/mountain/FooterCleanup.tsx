"use client";

import { useEffect } from "react";

const GRATITUDE = `
<div style="width:100%;padding:40px 20px;text-align:center;color:#f6e1bb;">
  <div style="font-family:'Cormorant Infant',serif;font-size:34px;margin-bottom:16px;letter-spacing:2px;">WITH GRATITUDE</div>
  <div style="font-family:'Cormorant',serif;font-size:22px;line-height:1.5;">
    We cordially invite you to be part of our<br/>
    journey and seek your presence and<br/>
    blessings for our new beginning.<br/><br/>
    Akhilesh &amp; Rakhi<br/>
    Shri Arjun Chaudhary &amp; Family<br/>
    +91 99392 06876 &nbsp;&nbsp; +91 75638 01193<br/>
    Hasanpur Bujurg, Rampur Ratnakar, Jandaha, Vaishali
  </div>
</div>
`;

export function FooterCleanup() {
  useEffect(() => {
    // Hide the small countdown title
    document.querySelectorAll("*").forEach((node) => {
      const el = node as HTMLElement;
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        const t = (el.textContent || "").trim();
        if (t === "The countdown begins") el.style.display = "none";
      }
    });
    // Hide small countdown numbers
    document.querySelectorAll(".framer-lpl8ib-container").forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });
    // Hide copyright
    document.querySelectorAll("*").forEach((node) => {
      const el = node as HTMLElement;
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        const t = (el.textContent || "").trim();
        if (t.includes("Chaudhary Parivaar 2026") || t.includes("Missing Piece")) {
          el.style.display = "none";
        }
      }
    });
    // Hide the duplicate gratitude in the original family-message paragraph
    document.querySelectorAll("p").forEach((node) => {
      const el = node as HTMLElement;
      if ((el.textContent || "").includes("WITH GRATITUDE")) {
        el.style.display = "none";
        // also hide its closest framer container
        const container = el.closest('[class*="framer-8mqvhq"], [class*="framer-a6ycli"]');
        if (container) (container as HTMLElement).style.display = "none";
      }
    });

    // Insert gratitude block where the countdown was: find first hidden "The countdown begins" and insert before its container
    const titleEl = Array.from(document.querySelectorAll("*")).find((node) => {
      const el = node as HTMLElement;
      return el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && (el.textContent || "").trim() === "The countdown begins";
    }) as HTMLElement | undefined;

    if (titleEl) {
      // walk up to a container that is a direct child of a section-ish parent
      const container: HTMLElement | null = titleEl.parentElement;
      // find the nearest ancestor that contains the countdown + message block; insert before container
      const wrap = document.createElement("div");
      wrap.className = "injected-gratitude";
      wrap.innerHTML = GRATITUDE;
      if (container && container.parentNode) {
        container.parentNode.insertBefore(wrap, container);
      }
    }
  }, []);
  return null;
}

