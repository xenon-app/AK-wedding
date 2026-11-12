"use client";

import { useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";

const BRIDE_GROOM_PHOTOS = [
  {
    src: "/images/COUPLE_POSE2.png",
    alt: "Akhilesh & Rakhi - Royal Elegance",
    position: "center 22%",
  },
  {
    src: "/images/COUPLE_POSE1.webp",
    alt: "Akhilesh & Rakhi - Celebration",
    position: "center 18%",
  },
  {
    src: "/images/COUPLE_POSE4.png",
    alt: "Akhilesh & Rakhi - Cherished Memories",
    position: "center 22%",
  },
  {
    src: "/images/COUPLE_POSE3.webp",
    alt: "Akhilesh & Rakhi - Pure Joy",
    position: "center 18%",
  },
  {
    src: "/images/COUPLE_POSE5.png",
    alt: "Akhilesh & Rakhi - Blessed Moments",
    position: "center 18%",
  },
];

function LocketSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BRIDE_GROOM_PHOTOS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      onClick={() =>
        setCurrent((prev) => (prev + 1) % BRIDE_GROOM_PHOTOS.length)
      }
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "300px",
        overflow: "hidden",
        cursor: "pointer",
        userSelect: "none",
        backgroundColor: "rgba(10, 30, 40, 0.2)",
      }}
      title="Click to view next photo"
    >
      {BRIDE_GROOM_PHOTOS.map((photo, index) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: photo.position || "center 20%",
            borderRadius: "300px",
            transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: index === current ? 1 : 0,
            pointerEvents: index === current ? "auto" : "none",
          }}
        />
      ))}

      {/* Subtle indicator dots */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "6px",
          padding: "4px 8px",
          borderRadius: "12px",
          background: "rgba(10, 25, 45, 0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 10,
        }}
      >
        {BRIDE_GROOM_PHOTOS.map((_, i) => (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
            style={{
              width: i === current ? "14px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background:
                i === current ? "#ffffff" : "rgba(255, 255, 255, 0.45)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function LocketPhotos() {
  useEffect(() => {
    const containers = Array.from(
      document.querySelectorAll<HTMLElement>(".framer-147vwyo-container")
    );
    if (!containers.length) return;

    const roots: Root[] = [];

    containers.forEach((container) => {
      // Clear the static hidden Framer elements
      container.innerHTML = "";
      container.style.opacity = "1";
      container.style.visibility = "visible";

      const mount = document.createElement("div");
      mount.style.width = "100%";
      mount.style.height = "100%";
      mount.style.borderRadius = "300px";
      mount.style.overflow = "hidden";
      container.appendChild(mount);

      const root = createRoot(mount);
      root.render(<LocketSlider />);
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

