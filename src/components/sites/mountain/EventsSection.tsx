"use client";

import React, { useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";

// Google Maps URLs provided by user
const PUJA_HALDI_MEHNDI_PREETIBHOJ_MAPS_URL =
  "https://maps.app.goo.gl/jAVZu9pcsoYgLJwV8";
const VIVAH_MAPS_URL = "https://maps.app.goo.gl/uHdDSZn6Y8bqASPN9";

interface EventCardProps {
  title: string;
  date: string;
  venue: string;
  time: string;
  imageSrc: string;
  imageAlt: string;
  mapUrl?: string;
}

// Decorative floating elements for portrait cards
function PortraitDecorations() {
  return (
    <>
      {/* Hot air balloon */}
      <div
        style={{
          position: "absolute",
          top: "-49px",
          left: "75px",
          width: "141px",
          height: "187px",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <img
          src="https://framerusercontent.com/images/LQC5ElMk4rqJ4rtBP5vF6B4.png?width=2842&height=2846"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Hotel */}
      <div
        style={{
          position: "absolute",
          top: "-34px",
          right: "75px",
          width: "174px",
          height: "125px",
          transform: "rotate(-9deg)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <img
          src="https://framerusercontent.com/images/64NTAFiZlzU2kGaVG82xflIhbqk.png?width=2892&height=2078"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
        />
      </div>

      {/* Moon */}
      <div
        style={{
          position: "absolute",
          top: "145px",
          left: "220px",
          width: "138px",
          height: "145px",
          transform: "translateY(-50%) rotate(-7deg)",
          filter:
            "drop-shadow(0px 1.4px 1px rgba(0,0,0,0.2)) drop-shadow(0px 6px 5px rgba(0,0,0,0.35)) drop-shadow(0px 21px 15px rgba(0,0,0,0.5))",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <img
          src="https://framerusercontent.com/images/wHXdUM5TWv2v0SV6GoD6XjI7A8.png?width=1130&height=1185"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Gold arch outline (Rectangle 41) */}
      <div
        style={{
          position: "absolute",
          inset: "18px 92px",
          border: "4px solid rgb(172, 149, 69)",
          borderRadius: "127px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </>
  );
}

// Portrait Card for Event 1 & Event 2 (Row 1)
function PortraitEventCard({
  title,
  date,
  venue,
  time,
  imageSrc,
  imageAlt,
  mapUrl = PUJA_HALDI_MEHNDI_PREETIBHOJ_MAPS_URL,
}: EventCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "430px",
        position: "relative",
      }}
    >
      {/* Image with decorative elements */}
      <div
        style={{
          width: "429px",
          height: "406px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <PortraitDecorations />

        {/* Central Arched Poster */}
        <div
          style={{
            position: "absolute",
            width: "244px",
            height: "369px",
            top: "calc(48.2% - 184.5px)",
            left: "calc(50% - 122px)",
            borderRadius: "203px",
            overflow: "hidden",
            boxShadow:
              "inset 0px 0px 68px 0px rgba(0, 0, 0, 0.8), 0 8px 30px rgba(0,0,0,0.45)",
            zIndex: 1,
            backgroundColor: "#022938",
          }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "inherit",
            }}
          />
        </div>
      </div>

      {/* Description below poster */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "4px",
          width: "100%",
          padding: "4px 12px 16px",
          boxSizing: "border-box",
        }}
      >
        <h3
          style={{
            fontFamily: "'Cormorant Infant', 'Cormorant Upright', serif",
            fontSize: "clamp(24px, 2.8vw, 36px)",
            lineHeight: 1.25,
            fontWeight: 500,
            color: "rgb(172, 149, 69)",
            margin: "0 0 6px 0",
            maxWidth: "360px",
            textAlign: "center",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: "'Cormorant', serif",
            fontSize: "15px",
            lineHeight: "100%",
            color: "rgb(172, 149, 69)",
            margin: "2px 0",
            fontWeight: 400,
          }}
        >
          {date}
        </p>

        <p
          style={{
            fontFamily: "'Cormorant', serif",
            fontSize: "15px",
            lineHeight: "100%",
            color: "rgb(172, 149, 69)",
            margin: "2px 0",
            fontWeight: 400,
          }}
        >
          {venue}
        </p>

        <p
          style={{
            fontFamily: "'Cormorant', serif",
            fontSize: "15px",
            lineHeight: "100%",
            color: "rgb(172, 149, 69)",
            margin: "2px 0",
            fontWeight: 400,
          }}
        >
          {time}
        </p>

        {/* Check Location Button */}
        <div style={{ marginTop: "12px" }}>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="event-location-btn"
          >
            Check Location
          </a>
        </div>
      </div>
    </div>
  );
}

// Horizontal Card for Event 3 (Row 2: Preetibhoj & Vivah)
function HorizontalEventCard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "760px",
        margin: "0 auto",
        padding: "0 16px",
        boxSizing: "border-box",
      }}
    >
      {/* Horizontal Poster with royal gold frame & subtle moon decoration */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "620px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Subtle decorative moon on top-right of horizontal card */}
        <div
          style={{
            position: "absolute",
            top: "-36px",
            right: "-20px",
            width: "110px",
            height: "116px",
            transform: "rotate(12deg)",
            filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.4))",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.85,
          }}
        >
          <img
            src="https://framerusercontent.com/images/wHXdUM5TWv2v0SV6GoD6XjI7A8.png?width=1130&height=1185"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Main Horizontal Poster Frame */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1672 / 941",
            borderRadius: "28px",
            overflow: "hidden",
            border: "4px solid rgb(172, 149, 69)",
            boxShadow:
              "0 18px 45px rgba(0, 0, 0, 0.55), inset 0 0 35px rgba(0, 0, 0, 0.3)",
            backgroundColor: "#022938",
            zIndex: 1,
          }}
        >
          <img
            src="/images/Preetibhoj and Vivah Celebration.png"
            alt="Preetibhoj & Vivah Celebration"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "inherit",
            }}
          />
        </div>
      </div>

      {/* Description below horizontal poster */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "4px",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <h3
          style={{
            fontFamily: "'Cormorant Infant', 'Cormorant Upright', serif",
            fontSize: "clamp(30px, 4vw, 45px)",
            lineHeight: 1.25,
            fontWeight: 500,
            color: "rgb(172, 149, 69)",
            margin: "0 0 6px 0",
            textAlign: "center",
          }}
        >
          Preetibhoj &amp; Vivah
        </h3>

        <p
          style={{
            fontFamily: "'Cormorant', serif",
            fontSize: "15px",
            lineHeight: "100%",
            color: "rgb(172, 149, 69)",
            margin: "2px 0",
            fontWeight: 400,
          }}
        >
          09.12.2026 (Wednesday)
        </p>

        <p
          style={{
            fontFamily: "'Cormorant', serif",
            fontSize: "15px",
            lineHeight: "100%",
            color: "rgb(172, 149, 69)",
            margin: "2px 0",
            fontWeight: 400,
          }}
        >
          Hasanpur Bujurg, Rampur Ratnakar, Jandaha, Vaishali
        </p>

        <p
          style={{
            fontFamily: "'Cormorant', serif",
            fontSize: "15px",
            lineHeight: "100%",
            color: "rgb(172, 149, 69)",
            margin: "2px 0",
            fontWeight: 400,
          }}
        >
          11:00 AM onwards
        </p>

        {/* Dual Location buttons: Preetibhoj Location & Vivah Location */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "18px",
            flexWrap: "wrap",
            marginTop: "14px",
          }}
        >
          <a
            href={PUJA_HALDI_MEHNDI_PREETIBHOJ_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="event-location-btn"
          >
            Preetibhoj Location
          </a>
          <a
            href={VIVAH_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="event-location-btn"
          >
            Vivah Location
          </a>
        </div>
      </div>
    </div>
  );
}

// Main Events Layout Component: 2 Rows
function EventsLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: "48px",
        margin: "0 auto",
      }}
    >
      {/* 1st row: Portrait events */}
      <div
        className="events-row-1"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "40px",
          width: "100%",
          maxWidth: "1280px",
          flexWrap: "wrap",
        }}
      >
        {/* 1st event */}
        <PortraitEventCard
          title="Satyanarayan Puja , Matkor ,Baba Bhuian Puja"
          date="06.12.2026 (Sunday)"
          venue="Hasanpur Bujurg, Rampur Ratnakar, Jandaha, Vaishali"
          time="11:00 AM onwards"
          imageSrc="/images/Satyanarayan Puja ,Matkor  and Baba Bhuian Puja.png"
          imageAlt="Satyanarayan Puja, Matkor, Baba Bhuian Puja"
          mapUrl={PUJA_HALDI_MEHNDI_PREETIBHOJ_MAPS_URL}
        />

        {/* Baba Bhuian Puja */}
        <PortraitEventCard
          title="Baba Bhuian Puja"
          date="07.12.2026 (Monday)"
          venue="Hasanpur Bujurg, Rampur Ratnakar, Jandaha, Vaishali"
          time="11:00 AM onwards"
          imageSrc="/images/Baba Bhuian Puja.png"
          imageAlt="Baba Bhuian Puja"
          mapUrl={PUJA_HALDI_MEHNDI_PREETIBHOJ_MAPS_URL}
        />

        {/* 3rd event */}
        <PortraitEventCard
          title="Haldi & Mehndi"
          date="08.12.2026 (Monday)"
          venue="Hasanpur Bujurg, Rampur Ratnakar, Jandaha, Vaishali"
          time="11:00 AM onwards"
          imageSrc="/images/Haldi and Mehendi Wedding Celebrations.png"
          imageAlt="Haldi & Mehndi"
          mapUrl={PUJA_HALDI_MEHNDI_PREETIBHOJ_MAPS_URL}
        />
      </div>

      {/* 2nd row: only 1 event (3rd event: Preetibhoj & Vivah) */}
      <div
        className="events-row-2"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1050px",
        }}
      >
        <HorizontalEventCard />
      </div>
    </div>
  );
}

// Client mount hook into all [data-framer-name="Event Cards"] containers
export function EventsSection() {
  useEffect(() => {
    const containers = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-framer-name="Event Cards"]'
      )
    );
    if (!containers.length) return;

    const roots: Root[] = [];

    containers.forEach((container) => {
      // Clear original children
      container.innerHTML = "";
      const mountPoint = document.createElement("div");
      mountPoint.style.width = "100%";
      container.appendChild(mountPoint);

      const root = createRoot(mountPoint);
      root.render(<EventsLayout />);
      roots.push(root);
    });

    return () => {
      roots.forEach((root) => {
        setTimeout(() => {
          try {
            root.unmount();
          } catch {}
        }, 0);
      });
    };
  }, []);

  return null;
}

