"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const STATIC_SOURCES = ["/profile.jpg", "/profile.jpeg", "/profile.png", "/profile.webp"];

interface ProfileIDCardProps {
  name: string;
  headline: string;
  location: string;
  email: string;
  photoUrl?: string | null;
}

/** Deterministic 6-digit number derived from a string (for ID + barcode). */
function hashDigits(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return String(100000 + (h % 900000));
}

/**
 * Interactive staff ID card: 3D tilt + cursor shine on hover,
 * click to flip for details + barcode. All content from CMS profile.
 */
export default function ProfileIDCard({ name, headline, location, email, photoUrl }: ProfileIDCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [srcIndex, setSrcIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const sources = photoUrl ? [photoUrl, ...STATIC_SOURCES] : STATIC_SOURCES;
  const photo = sources[srcIndex];
  const idDigits = useMemo(() => hashDigits(name), [name]);
  const idNo = `RSY-${idDigits.slice(0, 2)}${idDigits.slice(2)}`;

  const interactive =
    typeof window !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(pointer: fine)").matches;

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onMove = (e: React.PointerEvent) => {
    if (!interactive) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      setTilt({ rx: (0.5 - py) * 14, ry: (px - 0.5) * 16 });
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${Math.round(px * 100)}% ${Math.round(py * 100)}%, rgba(255,255,255,0.28), transparent 55%)`;
      }
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    setTilt({ rx: 0, ry: 0 });
    setHovering(false);
  };

  const flip = () => setFlipped((f) => !f);

  return (
    <div className="animate-float-soft">
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label="Staff ID card — activate to flip"
        onClick={flip}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            flip();
          }
        }}
        onPointerMove={onMove}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={onLeave}
        className="relative w-full cursor-pointer select-none"
        style={{ perspective: "1200px", outline: "none" }}
      >
        <div
          className="relative w-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${flipped ? 180 : 0}deg) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* ============ FRONT ============ */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              backfaceVisibility: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            }}
          >
            {/* Top strip */}
            <div
              className="flex items-center justify-between px-4 pt-3 pb-2"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span className="text-[10px] font-mono font-semibold tracking-[0.18em] t-primary">
                RASYA.DEV
              </span>
              <span className="badge badge-accent" style={{ fontSize: "9px" }}>STAFF ID</span>
            </div>

            <div className="p-4 pt-3">
              {/* Photo */}
              <div
                className="relative w-full overflow-hidden rounded-xl mb-3"
                style={{ aspectRatio: "4 / 3", border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
              >
                {photo !== undefined ? (
                  <Image
                    key={photo}
                    src={photo}
                    alt={name}
                    fill
                    sizes="280px"
                    style={{ objectFit: "cover" }}
                    onError={() => setSrcIndex((i) => i + 1)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-semibold t-primary" style={{ fontSize: "48px", lineHeight: 1 }}>
                      {name.charAt(0) || "R"}
                    </span>
                  </div>
                )}
              </div>

              {/* Identity */}
              <p className="font-semibold t-primary leading-tight" style={{ fontSize: "17px" }}>
                {name}
              </p>
              <p
                className="text-[11px] t-secondary leading-snug mt-1"
                style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {headline}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="text-[10px] font-mono t-muted truncate">{location}</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono" style={{ color: "var(--accent)" }}>
                  <span
                    className="inline-block rounded-full"
                    style={{ width: "6px", height: "6px", background: "var(--accent)" }}
                  />
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Bottom ID strip */}
            <div
              className="px-4 py-2 flex items-center justify-between"
              style={{ background: "var(--accent-soft)", borderTop: "1px solid var(--accent-border)" }}
            >
              <span className="text-[10px] font-mono font-semibold tracking-[0.14em]" style={{ color: "var(--accent)" }}>
                {idNo}
              </span>
              <span className="text-[9px] font-mono t-muted">TAP TO FLIP ⟲</span>
            </div>
          </div>

          {/* ============ BACK ============ */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            }}
          >
            {/* Magnetic stripe */}
            <div className="h-9 mt-5 shrink-0" style={{ background: "rgba(0,0,0,0.55)" }} />

            <div className="p-4 flex flex-col flex-1">
              <p className="text-[10px] font-mono tracking-[0.18em] t-muted mb-3">IDENTIFICATION</p>
              {[
                ["ID NUMBER", idNo],
                ["NAME", name],
                ["EMAIL", email],
                ["BASE", location],
              ].map(([label, value]) => (
                <div key={label} className="mb-2.5 min-w-0">
                  <p className="text-[9px] font-mono t-muted">{label}</p>
                  <p className="text-xs font-mono t-primary truncate">{value}</p>
                </div>
              ))}

              {/* Barcode */}
              <div className="mt-auto pt-3">
                <div className="flex items-stretch gap-[2px] h-11 t-primary" aria-hidden="true">
                  {Array.from({ length: 42 }).map((_, i) => {
                    const d = Number(idDigits[i % idDigits.length]);
                    return (
                      <span
                        key={i}
                        style={{
                          width: `${1 + ((d + i) % 3)}px`,
                          background: "currentColor",
                          opacity: (i * 7) % 10 === 0 ? 0.35 : 1,
                        }}
                      />
                    );
                  })}
                </div>
                <p className="text-center text-[10px] font-mono t-muted mt-1 tracking-[0.3em]">
                  {idDigits}
                </p>
                <p className="text-center text-[9px] font-mono t-muted mt-2">
                  Property of rasya.dev — if found, say hi.
                </p>
              </div>
            </div>
          </div>

          {/* Cursor glare */}
          <div
            ref={glareRef}
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              opacity: hovering ? 1 : 0,
              transition: "opacity 0.25s ease",
              backfaceVisibility: "hidden",
            }}
          />
        </div>
      </div>
    </div>
  );
}
