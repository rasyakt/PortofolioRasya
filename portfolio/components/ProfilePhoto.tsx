"use client";

import { useState } from "react";
import Image from "next/image";

const STATIC_SOURCES = ["/profile.jpg", "/profile.jpeg", "/profile.png", "/profile.webp"];

/**
 * Hero portrait. Prefers the CMS-uploaded photo, then a static file
 * at `public/profile.jpg` (`.jpeg` / `.png` / `.webp` also work) —
 * otherwise a monogram fallback is shown.
 */
export default function ProfilePhoto({ src }: { src?: string | null }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = src ? [src, ...STATIC_SOURCES] : STATIC_SOURCES;
  const current = sources[srcIndex];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: "20px",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-surface)",
        aspectRatio: "4 / 5",
      }}
    >
      {current !== undefined ? (
        <Image
          key={current}
          src={current}
          alt="Rasya Syahreza Maulana Zen"
          fill
          sizes="280px"
          style={{ objectFit: "cover" }}
          onError={() => setSrcIndex((i) => i + 1)}
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, var(--accent-soft) 0%, transparent 65%)",
          }}
        >
          <span
            className="font-semibold tracking-tight"
            style={{ fontSize: "72px", color: "var(--text-primary)", lineHeight: 1 }}
          >
            R
          </span>
          <span className="text-xs font-mono t-muted px-3 py-1 badge">
            profile.jpg
          </span>
        </div>
      )}
    </div>
  );
}
