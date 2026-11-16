"use client";

import type { Language } from "@/lib/localization";

interface LanguageSelectorProps {
  language: Language;
  onChange: (language: Language) => void;
}

export function LanguageSelector({
  language,
  onChange,
}: LanguageSelectorProps) {
  const fontFamily =
    language === "hi" ? "Gotu, sans-serif" : "Montserrat, sans-serif";

  return (
    <>
      <style>{`
        .language-selector button:focus-visible {
          outline: 2px solid #fff9e6;
          outline-offset: 2px;
        }

        html[lang="hi"] [role="dialog"],
        html[lang="hi"] [role="dialog"] *,
        html[lang="hi"] .mountain-clone,
        html[lang="hi"] .mountain-clone * {
          font-family: "Gotu", sans-serif !important;
          letter-spacing: normal !important;
        }
      `}</style>
      <div
        role="group"
        className="language-selector"
        aria-label={language === "hi" ? "भाषा चुनें" : "Choose language"}
        style={{
          position: "fixed",
          top: "clamp(12px, 2.4vw, 24px)",
          right: "clamp(12px, 2.4vw, 24px)",
          zIndex: 10001,
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          padding: "3px",
          border: "1px solid rgba(229, 195, 101, 0.65)",
          borderRadius: "999px",
          background: "rgba(2, 41, 56, 0.78)",
          boxShadow: "0 3px 14px rgba(0, 0, 0, 0.28)",
          backdropFilter: "blur(8px)",
          fontFamily,
        }}
      >
        {(
          [
            ["en", "English"],
            ["hi", "हिंदी"],
          ] as const
        ).map(([option, label]) => {
          const selected = language === option;
          return (
            <button
              key={option}
              type="button"
              lang={option === "hi" ? "hi" : "en"}
              aria-pressed={selected}
              onClick={() => onChange(option)}
              style={{
                minHeight: "34px",
                padding: "6px 11px",
                border: 0,
                borderRadius: "999px",
                background: selected ? "rgba(229, 195, 101, 0.2)" : "transparent",
                color: selected ? "#f5de98" : "#f6e1bb",
                fontFamily,
                fontSize: "12px",
                fontWeight: selected ? 700 : 500,
                lineHeight: 1.2,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
