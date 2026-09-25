"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { useCommandPalette } from "./CommandPaletteProvider";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useCommandPalette();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--bg-base) 85%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo("#hero")}
          className="text-sm font-semibold tracking-tight t-primary cursor-pointer bg-transparent border-none"
        >
          rasya<span style={{ color: "var(--accent)" }}>.</span>dev
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="px-3 py-1.5 text-[13px] t-secondary transition-colors cursor-pointer bg-transparent border-none"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={open}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs t-muted transition-colors cursor-pointer"
            style={{ border: "1px solid var(--border)", background: "transparent" }}
          >
            <Search size={13} />
            <span className="font-mono text-[11px]">Ctrl K</span>
          </button>

          <ThemeToggle className="hidden sm:block" />

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg t-muted cursor-pointer"
            style={{ border: "1px solid var(--border)", background: "transparent" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t"
            style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}
          >
            <div className="px-6 py-3 flex items-center justify-between">
              <div>
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="block w-full text-left px-2 py-2.5 text-sm t-secondary cursor-pointer bg-transparent border-none"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
