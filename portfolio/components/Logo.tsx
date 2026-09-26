"use client";

import { motion } from "framer-motion";

const LETTERS = "rasya.dev".split("");

/**
 * Brand logo: terminal mark + staggered wordmark + blinking cursor.
 * Shared by the navbar and footer for one consistent identity.
 */
export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Back to top"
      className="group flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
    >
      {/* Mark */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="grid place-items-center font-mono font-bold transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-3"
        style={{
          width: "27px",
          height: "27px",
          borderRadius: "9px",
          fontSize: "14px",
          background: "linear-gradient(135deg, #34d399 0%, var(--accent) 55%, #047857 100%)",
          color: "#022c22",
          boxShadow: "0 2px 10px rgba(16,185,129,0.35)",
          lineHeight: 1,
          paddingBottom: "2px",
        }}
      >
        &gt;_
      </motion.span>

      {/* Wordmark */}
      <span className="font-mono text-[15px] font-bold tracking-tight t-primary flex items-baseline">
        {LETTERS.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 + i * 0.035, ease: "easeOut" }}
            style={ch === "." ? { color: "var(--accent)" } : undefined}
          >
            {ch}
          </motion.span>
        ))}
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 + LETTERS.length * 0.035 + 0.1 }}
          className="animate-blink inline-block ml-1 rounded-[1px]"
          style={{ width: "8px", height: "15px", background: "var(--accent)" }}
        />
      </span>
    </button>
  );
}
