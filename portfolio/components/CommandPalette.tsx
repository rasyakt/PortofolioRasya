"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FolderOpen, Download, Mail, ExternalLink, User, LayoutGrid, Award, Terminal, Moon, Copy } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import Fuse from "fuse.js";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const CONTACT = {
  email: "rasyasyahrezamaulanazen@gmail.com",
  phone: "+62 838 4055 9238",
  github: "https://github.com/rasyakt",
  linkedin: "https://linkedin.com/in/rasya-syahreza-maulana-zen",
};

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const scrollTo = useCallback(
    (id: string) => {
      onClose();
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    },
    [onClose]
  );

  const handleClose = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    onClose();
  }, [onClose]);

  const COMMANDS: CommandItem[] = useMemo(() => [
    {
      id: "nav-hero",
      label: "Go to Hero",
      category: "Navigate",
      icon: <User size={15} />,
      action: () => scrollTo("hero"),
      keywords: ["home", "top", "start"],
    },
    {
      id: "nav-projects",
      label: "Go to Projects",
      category: "Navigate",
      icon: <FolderOpen size={15} />,
      action: () => scrollTo("projects"),
      keywords: ["portfolio", "work"],
    },
    {
      id: "nav-bento",
      label: "Go to Stats",
      category: "Navigate",
      icon: <LayoutGrid size={15} />,
      action: () => scrollTo("bento"),
    },
    {
      id: "nav-certs",
      label: "Go to Certifications",
      category: "Navigate",
      icon: <Award size={15} />,
      action: () => scrollTo("certifications"),
      keywords: ["hki", "certificates", "awards"],
    },
    {
      id: "nav-experience",
      label: "Go to Experience",
      category: "Navigate",
      icon: <Terminal size={15} />,
      action: () => scrollTo("experience"),
    },
    {
      id: "copy-email",
      label: `Copy Email — ${CONTACT.email}`,
      category: "Contact",
      icon: <Mail size={15} />,
      action: () => copyToClipboard(CONTACT.email, "email"),
      keywords: ["email", "contact", "mail"],
    },
    {
      id: "copy-phone",
      label: `Copy Phone — ${CONTACT.phone}`,
      category: "Contact",
      icon: <Copy size={15} />,
      action: () => copyToClipboard(CONTACT.phone, "phone"),
      keywords: ["phone", "whatsapp", "wa", "number"],
    },
    {
      id: "open-github",
      label: "Open GitHub Profile",
      category: "Social",
      icon: <GithubIcon size={15} />,
      action: () => {
        window.open(CONTACT.github, "_blank");
        handleClose();
      },
      keywords: ["github", "code", "repos"],
    },
    {
      id: "open-linkedin",
      label: "Open LinkedIn Profile",
      category: "Social",
      icon: <LinkedinIcon size={15} />,
      action: () => {
        window.open(CONTACT.linkedin, "_blank");
        handleClose();
      },
    },
    {
      id: "open-portfolio",
      label: "Open Live Portfolio",
      category: "Social",
      icon: <ExternalLink size={15} />,
      action: () => {
        window.open("https://gasela.my.id", "_blank");
        handleClose();
      },
    },
    {
      id: "download-cv",
      label: "Download CV / Resume",
      category: "Actions",
      icon: <Download size={15} />,
      action: () => {
        const a = document.createElement("a");
        a.href = "/cv.pdf";
        a.download = "Rasya_Syahreza_CV.pdf";
        a.click();
        handleClose();
      },
      keywords: ["resume", "cv", "download"],
    },
    {
      id: "admin",
      label: "Open Admin CMS",
      category: "System",
      icon: <Moon size={15} />,
      action: () => {
        router.push("/admin");
        handleClose();
      },
      keywords: ["admin", "cms", "dashboard"],
    },
  ], [scrollTo, copyToClipboard, handleClose, router]);

  const fuse = useMemo(() => new Fuse(COMMANDS, {
    keys: ["label", "category", "keywords"],
    threshold: 0.4,
  }), [COMMANDS]);

  const results = useMemo(() => {
    return query ? fuse.search(query).map((r) => r.item) : COMMANDS;
  }, [query, fuse, COMMANDS]);

  const grouped = useMemo(() => {
    return results.reduce(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, CommandItem[]>
    );
  }, [results]);

  const flatResults = useMemo(() => Object.values(grouped).flat(), [grouped]);

  const flatResultsRef = useRef(flatResults);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    flatResultsRef.current = flatResults;
    activeIndexRef.current = activeIndex;
  }, [flatResults, activeIndex]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatResultsRef.current.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const currentItem = flatResultsRef.current[activeIndexRef.current];
        currentItem?.action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmd-palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleClose}
        >
          <motion.div
            className="cmd-palette mx-4"
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <Search size={16} className="t-muted shrink-0" />
              <input
                autoFocus
                className="cmd-input px-0 py-0 text-sm"
                placeholder="Search commands, projects, contacts..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
              />
              {copied && (
                <span className="badge badge-accent text-xs">Copied!</span>
              )}
            </div>

            {/* Results */}
            <div className="cmd-results">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-3">
                  <p className="px-3 py-1 text-xs font-semibold t-muted uppercase tracking-widest font-mono">
                    {category}
                  </p>
                  {items.map((item) => {
                    const globalIdx = flatResults.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        className={`cmd-item w-full text-left ${
                          globalIdx === activeIndex ? "active" : ""
                        }`}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                      >
                        <span className="cmd-item-icon">{item.icon}</span>
                        <span className="text-sm t-secondary flex-1">{item.label}</span>
                        {globalIdx === activeIndex && (
                          <kbd className="kbd">
                            ↵
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              {results.length === 0 && (
                <p className="text-center t-muted text-sm py-8">
                  No results for &quot;{query}&quot;
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
              <div className="flex items-center gap-3 text-xs t-muted font-mono">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
              <span className="text-xs t-muted font-mono">⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
