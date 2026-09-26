"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink, FileText } from "lucide-react";
import { track } from "@/lib/analytics";
import { useFocusTrap } from "@/lib/focus-trap";

const CVPdfViewer = dynamic(() => import("./CVPdfViewer"), {
  ssr: false,
  loading: () => (
    <p className="text-center text-sm t-muted py-16 animate-pulse">
      Loading preview…
    </p>
  ),
});

interface CVPreviewModalProps {
  open: boolean;
  onClose: () => void;
  cvUrl: string;
}

/**
 * In-browser CV preview. Uses the native PDF renderer with a
 * download fallback for browsers that can't embed PDFs (e.g. iOS).
 */
export default function CVPreviewModal({ open, onClose, cvUrl }: CVPreviewModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const download = () => {
    track("cv_download");
    const a = document.createElement("a");
    a.href = cvUrl;
    a.download = "Rasya_Syahreza_CV.pdf";
    a.click();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "var(--overlay)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="CV preview"
        >
          <motion.div
            ref={dialogRef}
            className="w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius)",
            }}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar */}
            <div
              className="flex items-center justify-between gap-2 px-5 py-3 shrink-0"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={15} className="t-muted shrink-0" />
                <p className="text-sm font-semibold t-primary truncate">
                  Curriculum Vitae
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={download}
                  className="btn btn-primary"
                  style={{ fontSize: "12px", padding: "7px 14px" }}
                >
                  <Download size={13} /> Download
                </button>
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg link-hover"
                  title="Open in new tab"
                  aria-label="Open CV in new tab"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg link-hover cursor-pointer bg-transparent border-none"
                  aria-label="Close preview"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Viewer — scrolls with the modal, all pages stacked */}
            <div className="flex-1 min-h-0 overflow-y-auto" style={{ height: "70vh", background: "var(--bg-elevated)" }}>
              <CVPdfViewer cvUrl={cvUrl} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
