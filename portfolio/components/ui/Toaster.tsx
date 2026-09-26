"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

type ToastEventDetail = Omit<Toast, "id">;

export function toast(message: string, type: Toast["type"] = "success") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<ToastEventDetail>("app:toast", {
        detail: { message, type },
      })
    );
  }
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      const id = Math.random().toString(36).slice(2);
      const newToast: Toast = { ...customEvent.detail, id };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, 3500);
    };

    window.addEventListener("app:toast", handleToast);
    return () => window.removeEventListener("app:toast", handleToast);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm pointer-events-auto shadow-2xl"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              minWidth: "220px",
            }}
          >
            <CheckCircle2
              size={15}
              style={{
                color: t.type === "success" ? "var(--accent)" : t.type === "error" ? "#f87171" : "var(--info)",
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
              style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
