"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useFocusTrap } from "@/lib/focus-trap";

interface CertLightboxProps {
  images: string[];
  title: string;
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/** Fullscreen image viewer with keyboard navigation. */
export default function CertLightbox({ images, title, index, onClose, onNavigate }: CertLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true);
  // Fresh mount per open (parent renders conditionally), so init from prop.
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    const go = (dir: 1 | -1) => {
      if (images.length < 2) return;
      const next = (current + dir + images.length) % images.length;
      setCurrent(next);
      onNavigate(next);
    };
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length, current, onClose, onNavigate]);

  const src = images[current];
  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
        style={{ background: "var(--overlay)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — preview`}
      >
        <motion.div
          ref={dialogRef}
          className="relative w-full max-w-4xl max-h-full flex flex-col"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-sm font-medium t-primary truncate">{title}</p>
            <div className="flex items-center gap-1 shrink-0">
              {images.length > 1 && (
                <span className="text-xs font-mono t-muted mr-1">
                  {current + 1}/{images.length}
                </span>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg link-hover cursor-pointer bg-transparent border-none"
                aria-label="Close preview"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={src}
              src={src}
              alt={title}
              className="max-w-full rounded-xl"
              style={{ maxHeight: "75vh", width: "auto", border: "1px solid var(--border-strong)" }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const next = (current - 1 + images.length) % images.length;
                    setCurrent(next);
                    onNavigate(next);
                  }}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.55)", color: "#fff", border: "none" }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => {
                    const next = (current + 1) % images.length;
                    setCurrent(next);
                    onNavigate(next);
                  }}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.55)", color: "#fff", border: "none" }}
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
