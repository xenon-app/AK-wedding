"use client";

import { useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  CoverflowCarousel,
  type CoverflowSlide,
} from "@/components/ui/coverflow-carousel";

const WEDDING_SLIDES: CoverflowSlide[] = [
  {
    src: "/images/COUPLE_POSE2.png",
    alt: "Akhilesh & Rakhi - Royal Elegance",
    title: "Eternal Bond",
    subtitle: "Akhilesh & Rakhi",
    objectPosition: "center 22%",
  },
  {
    src: "/images/COUPLE_POSE1.webp",
    alt: "Akhilesh & Rakhi - Together in Love",
    title: "Together in Love",
    subtitle: "Cherished Celebrations",
    objectPosition: "center 18%",
  },
  {
    src: "/images/COUPLE_POSE4.png",
    alt: "Akhilesh & Rakhi - Soulmates",
    title: "Soulmates",
    subtitle: "A New Journey Begins",
    objectPosition: "center 22%",
  },
  {
    src: "/images/COUPLE_POSE3.webp",
    alt: "Akhilesh & Rakhi - Pure Joy",
    title: "Pure Joy",
    subtitle: "Hand in Hand Forever",
    objectPosition: "center 18%",
  },
  {
    src: "/images/COUPLE_POSE5.png",
    alt: "Akhilesh & Rakhi - Blessed Union",
    title: "Blessed Union",
    subtitle: "09.12.2026",
    objectPosition: "center 18%",
  },
];

function MomentsSection() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 text-center">
        <h3
          style={{
            fontFamily: "'Cormorant Infant', serif",
            fontSize: "clamp(28px, 4.5vw, 48px)",
            color: "#24121E",
            letterSpacing: "2px",
            margin: 0,
            fontWeight: 600,
          }}
        >
          Moments We Cherish
        </h3>
        <p
          style={{
            fontFamily: "'Cormorant', serif",
            fontSize: "clamp(15px, 2vw, 20px)",
            color: "#4A273C",
            fontStyle: "italic",
            marginTop: "6px",
            fontWeight: 500,
          }}
        >
          Drag or use arrows to explore our journey
        </p>
      </div>
      <CoverflowCarousel
        slides={WEDDING_SLIDES}
        cardWidth="clamp(190px, 26vw, 300px)"
        showNavigation
        showPagination
        showCaption
        loop
        className="w-full max-w-4xl"
      />
    </div>
  );
}

export function MomentsImage() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("#instagram"));
    if (!els.length) return;

    const roots: Root[] = [];

    els.forEach((container) => {
      container.innerHTML = "";
      const mountPoint = document.createElement("div");
      mountPoint.style.width = "100%";
      mountPoint.style.maxWidth = "1100px";
      mountPoint.style.margin = "0 auto";
      mountPoint.style.padding = "30px 10px";
      container.appendChild(mountPoint);

      const root = createRoot(mountPoint);
      root.render(<MomentsSection />);
      roots.push(root);
    });

    // Remove old Framer placeholder texts
    document.querySelectorAll("*").forEach((node) => {
      const el = node as HTMLElement;
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        const t = (el.textContent || "").trim();
        if (
          t === "Follow the action" ||
          t === "Click the link to open Instagram" ||
          t === "Instagram kholne ke liye click karein"
        ) {
          el.style.display = "none";
        }
      }
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

