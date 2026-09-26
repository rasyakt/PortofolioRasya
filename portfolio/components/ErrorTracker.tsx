"use client";

import { useEffect } from "react";

/** Reports uncaught frontend errors to the local error log. */
export default function ErrorTracker() {
  useEffect(() => {
    const seen = new Set<string>();
    const report = (message: string) => {
      const key = message.slice(0, 200);
      if (seen.has(key)) return;
      seen.add(key);
      if (seen.size > 20) return;
      try {
        const payload = JSON.stringify({
          message: message.slice(0, 1000),
          path: window.location.pathname,
        });
        const blob = new Blob([payload], { type: "application/json" });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/client-errors", blob);
        } else {
          fetch("/api/client-errors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        /* ignore */
      }
    };

    const onError = (e: ErrorEvent) => {
      if (e.message) report(`${e.message}`);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const message =
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : `Unhandled rejection: ${String(reason).slice(0, 300)}`;
      report(message);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
