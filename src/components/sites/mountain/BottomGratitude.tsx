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

export function BottomGratitude() {
  useEffect(() => {
    // Find copyright element and insert gratitude before it
    let copyrightEl: HTMLElement | null = null;
    document.querySelectorAll("*").forEach((node) => {
      const el = node as HTMLElement;
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        const t = (el.textContent || "").trim();
        if (t.includes("Chaudhary Parivaar 2026") || t.includes("Missing Piece")) {
          copyrightEl = el;
        }
      }
    });
    // Also hide copyright
    if (copyrightEl) {
      (copyrightEl as HTMLElement).style.display = "none";
      const wrap = document.createElement("div");
      wrap.className = "injected-bottom-gratitude";
      wrap.innerHTML = GRATITUDE;
      const parent = (copyrightEl as HTMLElement).parentNode;
      if (parent) {
        parent.insertBefore(wrap, copyrightEl as HTMLElement);
      }
    } else {
      // fallback: append to footer sections
      document.querySelectorAll(".framer-105zzlt").forEach((sec) => {
        const wrap = document.createElement("div");
        wrap.className = "injected-bottom-gratitude";
        wrap.innerHTML = GRATITUDE;
        sec.appendChild(wrap);
      });
    }
  }, []);
  return null;
}

