"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

/**
 * next/image with graceful degradation: when the file is missing
 * (deleted volume, bad URL), show a placeholder instead of a broken icon.
 * NOTE: pass key={src} so a URL change resets the failed state.
 */
export default function SafeImage({
  src,
  alt,
  sizes = "200px",
  className,
  style,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center gap-1 t-muted ${className ?? ""}`}
        style={style}
        role="img"
        aria-label={`${alt} (file unavailable)`}
      >
        <ImageOff size={18} />
        <span className="text-[9px] font-mono px-2 text-center">File hilang</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      style={{ objectFit: "cover", ...style }}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
