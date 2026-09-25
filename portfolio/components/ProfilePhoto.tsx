"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Hero portrait. Drop your photo at `public/profile.jpg` to use it —
 * otherwise a clean monogram fallback is shown.
 */
export default function ProfilePhoto() {
  const [failed, setFailed] = useState(false);

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
      {!failed ? (
        <Image
          src="/profile.jpg"
          alt="Rasya Syahreza Maulana Zen"
          fill
          sizes="280px"
          style={{ objectFit: "cover" }}
          onError={() => setFailed(true)}
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
