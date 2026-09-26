"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const GLYPHS =
  "!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Terminal decode-in effect: text resolves from random glyphs once,
 * when scrolled into view. Static text when reduced motion is preferred.
 */
export default function DecodeText({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const start = () => {
      const t0 = performance.now();
      const dur = Math.min(1100, 280 + text.length * 26);
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const n = Math.floor(p * text.length);
        let s = text.slice(0, n);
        for (let i = n; i < text.length; i++) {
          s += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setOut(s);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (delay > 0) {
      timeout = setTimeout(start, delay);
    } else {
      start();
    }
    return () => {
      cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
    };
  }, [inView, text, delay]);

  return (
    <span ref={ref} className={className} style={style}>
      {out}
    </span>
  );
}
