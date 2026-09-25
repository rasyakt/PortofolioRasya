"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Menu, X, Search, Lock } from "lucide-react";
import { useCommandPalette } from "./CommandPaletteProvider";

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Experience", href: "#experience" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useCommandPalette();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(9,9,11,0.88)" : "rgba(9,9,11,0.5)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid rgba(63,63,70,0.5)" : "1px solid rgba(63,63,70,0.2)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group"
          onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}
        >
          <div
            className="p-1.5 rounded-lg transition-all group-hover:scale-105"
            style={{ background: "var(--accent-muted)", border: "1px solid var(--accent-border)" }}
          >
            <Terminal size={14} style={{ color: "var(--accent)" }} />
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
            rasyakt
            <span style={{ color: "var(--accent)" }}>.dev</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="btn btn-ghost px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Search button */}
          <button
            onClick={open}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
            style={{
              background: "rgba(24,24,27,0.8)",
              border: "1px solid rgba(63,63,70,0.5)",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-highlight)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(63,63,70,0.5)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <Search size={12} className="text-emerald-400" />
            <span className="font-mono text-[11px] text-zinc-400">Ctrl+K</span>
          </button>

          <a
            href="/admin"
            className="btn btn-secondary hidden sm:flex items-center gap-1.5"
            style={{ padding: "6px 12px", fontSize: "12px" }}
          >
            <Lock size={11} className="text-emerald-400" />
            <span className="font-mono">CMS</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden"
            style={{ borderColor: "var(--border)", background: "rgba(9,9,11,0.95)" }}
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={open}
                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <Search size={13} /> Search (Ctrl+K)
              </button>
              <a
                href="/admin"
                className="block px-3 py-2 rounded-lg text-sm"
                style={{ color: "var(--accent)" }}
              >
                Admin CMS →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
