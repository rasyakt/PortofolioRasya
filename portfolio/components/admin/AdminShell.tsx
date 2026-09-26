"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

/**
 * Dashboard shell: static sidebar on desktop, slide-in drawer on mobile.
 */
export default function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar username={username} />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
              style={{ background: "var(--overlay)" }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 top-0 bottom-0 w-64"
              style={{ background: "var(--bg-surface)" }}
            >
              <AdminSidebar username={username} onNavigate={() => setOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div
          className="md:hidden flex items-center gap-3 px-4 h-14 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg t-muted cursor-pointer"
            style={{ border: "1px solid var(--border)", background: "transparent" }}
          >
            <Menu size={16} />
          </button>
          <span className="text-sm font-semibold t-primary">
            rasya<span style={{ color: "var(--accent)" }}>.</span>dev — CMS
          </span>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
