export type SiteEventType =
  | "page_view"
  | "cv_download"
  | "recruiter_open"
  | "project_open"
  | "contact_click";

/**
 * Fire-and-forget event beacon for the built-in local analytics.
 * Safe to call from any client handler — never throws.
 */
export function track(type: SiteEventType) {
  try {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({ type, path: window.location.pathname });
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", blob);
    } else {
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* ignore */
  }
}
