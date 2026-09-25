"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function getStoredTheme(): "light" | "dark" {
  if (typeof document !== "undefined") {
    const t = document.documentElement.dataset.theme;
    if (t === "light" || t === "dark") return t;
  }
  return "dark";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => getStoredTheme());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("rasyakt-theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  const showLight = mounted ? theme === "dark" : true;

  return (
    <button
      onClick={toggle}
      aria-label={showLight ? "Switch to light mode" : "Switch to dark mode"}
      title={showLight ? "Light mode" : "Dark mode"}
      className={`p-2 rounded-lg t-muted cursor-pointer transition-colors ${className}`}
      style={{ border: "1px solid var(--border)", background: "transparent" }}
    >
      <span className="block w-4 h-4">
        {showLight ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}
