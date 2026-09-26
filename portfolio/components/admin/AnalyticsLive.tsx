"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Eye, Activity, AlertTriangle, Database, Server, HardDrive,
  FolderOpen, Image as ImageIcon, RefreshCw, Trash2,
} from "lucide-react";
import type { StatsSnapshot } from "@/lib/admin-stats";
import { clearErrorLogs } from "@/actions/analytics";
import DeleteButton from "./DeleteButton";

function timeAgo(iso: string): string {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label mb-3">{children}</p>;
}

export default function AnalyticsLive({ initial }: { initial: StatsSnapshot }) {
  const [snap, setSnap] = useState<StatsSnapshot>(initial);
  const [updatedAt, setUpdatedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [live, setLive] = useState(true);

  const refreshNow = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!res.ok) return;
      setSnap((await res.json()) as StatsSnapshot);
      setUpdatedAt(Date.now());
    } catch {
      /* offline/error — keep last snapshot */
    }
  }, []);

  useEffect(() => {
    if (!live) return;
    // Initial snapshot already comes from the server render.
    const id = setInterval(() => {
      if (!document.hidden) refreshNow();
    }, 10000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(id);
      clearInterval(tick);
    };
  }, [live, refreshNow]);

  const maxType = Math.max(1, ...snap.byType.map((t) => t.count));
  const ageSec = updatedAt === 0 ? 0 : Math.max(0, Math.floor((now - updatedAt) / 1000));
  const sys = snap.system;

  return (
    <div>
      {/* Live header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setLive((v) => !v)}
          className="inline-flex items-center gap-2 text-xs font-mono t-secondary cursor-pointer bg-transparent border rounded-full px-3 py-1.5"
          style={{ borderColor: "var(--border)" }}
          title={live ? "Pause live updates" : "Resume live updates"}
        >
          <span
            className="inline-block rounded-full"
            style={{
              width: "7px",
              height: "7px",
              background: live ? "var(--accent)" : "var(--text-muted)",
            }}
          />
          {live ? `LIVE · updated ${ageSec}s ago` : "PAUSED"}
        </button>
        <button
          onClick={refreshNow}
          className="inline-flex items-center gap-1.5 text-xs t-muted link-hover cursor-pointer bg-transparent border-none p-1"
        >
          <RefreshCw size={13} /> Refresh now
        </button>
      </div>

      {/* Live counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Eye size={18} />, label: "Views today", value: snap.live.viewsToday, color: "var(--accent)" },
          { icon: <Activity size={18} />, label: "Events last hour", value: snap.live.eventsHour, color: "var(--info)" },
          { icon: <AlertTriangle size={18} />, label: "Errors 24h", value: snap.live.errors24h, color: snap.live.errors24h > 0 ? "#f87171" : "var(--text-muted)" },
          { icon: <Database size={18} />, label: "Total events", value: snap.live.totalEvents, color: "var(--violet)" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="mb-2" style={{ color: s.color }}>{s.icon}</div>
            <p className="text-2xl font-bold font-mono t-primary">{s.value}</p>
            <p className="text-xs mt-1 t-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        {/* Events by type */}
        <div className="card p-5">
          <SectionLabel>Events by type · 30d</SectionLabel>
          {snap.byType.length === 0 && (
            <p className="text-xs t-muted font-mono py-4">No events yet.</p>
          )}
          <div className="space-y-2.5">
            {snap.byType.map((t) => (
              <div key={t.type}>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="t-secondary">{t.type}</span>
                  <span className="t-muted">{t.count}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "var(--bg-elevated)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((t.count / maxType) * 100)}%`, background: "var(--accent)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top paths */}
        <div className="card p-5">
          <SectionLabel>Top pages · 7d</SectionLabel>
          {snap.topPaths.length === 0 && (
            <p className="text-xs t-muted font-mono py-4">No page views yet.</p>
          )}
          <div className="space-y-2">
            {snap.topPaths.map((p) => (
              <div key={p.path} className="flex items-center justify-between text-xs font-mono gap-3">
                <span className="t-secondary truncate">{p.path}</span>
                <span className="badge shrink-0">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent feed */}
      <div className="card p-5 mb-8">
        <SectionLabel>Recent activity</SectionLabel>
        {snap.recent.length === 0 && (
          <p className="text-xs t-muted font-mono py-4">Nothing recorded yet.</p>
        )}
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {snap.recent.map((e) => (
            <div key={e.id} className="flex items-center gap-3 text-xs font-mono">
              <span className="t-muted shrink-0 w-16">{timeAgo(e.createdAt)}</span>
              <span className="badge shrink-0">{e.type}</span>
              <span className="t-secondary truncate">{e.path}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top errors */}
      <div className="card p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">Top 10 errors · 30d</p>
          {snap.topErrors.length > 0 && (
            <DeleteButton
              onDelete={async () => {
                await clearErrorLogs();
                await refreshNow();
              }}
              itemName="Error logs"
            />
          )}
        </div>
        {snap.topErrors.length === 0 && (
          <p className="text-xs t-muted font-mono py-4">No errors recorded. Clean.</p>
        )}
        <div className="space-y-2">
          {snap.topErrors.map((e, i) => (
            <div
              key={`${e.message}-${i}`}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <span className="font-mono text-xs t-muted shrink-0 pt-0.5">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs t-primary break-words">{e.message}</p>
                <p className="text-[11px] font-mono t-muted mt-1">
                  {e.source} · last seen {timeAgo(e.lastSeen)}
                </p>
              </div>
              <span className="badge shrink-0">×{e.count}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] font-mono t-muted mt-4 flex items-center gap-1.5">
          <Trash2 size={11} /> Trash icon clears the entire error log.
        </p>
      </div>

      {/* System */}
      <div className="mb-2">
        <SectionLabel>System</SectionLabel>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="card p-4">
            <div className="mb-2 t-muted"><Server size={16} /></div>
            <p className="text-sm font-semibold t-primary mb-2">Runtime</p>
            {[
              ["Node", sys.node],
              ["Platform", sys.platform],
              ["Env", sys.env],
              ["Uptime", sys.uptime],
              ["RSS / Heap", `${sys.memoryMb.rss} / ${sys.memoryMb.heap} MB`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs font-mono py-0.5 gap-2">
                <span className="t-muted">{k}</span>
                <span className="t-secondary text-right truncate">{v}</span>
              </div>
            ))}
          </div>
          <div className="card p-4">
            <div className="mb-2 t-muted"><FolderOpen size={16} /></div>
            <p className="text-sm font-semibold t-primary mb-2">Application</p>
            {[
              ["Next.js", sys.nextVersion],
              ["Prisma", sys.prismaVersion],
              ["Projects", String(snap.content.projects)],
              ["Certifications", String(snap.content.certifications)],
              ["Experience", String(snap.content.experiences)],
              ["Skills", String(snap.content.skills)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs font-mono py-0.5 gap-2">
                <span className="t-muted">{k}</span>
                <span className="t-secondary text-right truncate">{v}</span>
              </div>
            ))}
          </div>
          <div className="card p-4">
            <div className="mb-2 t-muted"><Database size={16} /></div>
            <p className="text-sm font-semibold t-primary mb-2">Database</p>
            {[
              ["MySQL", sys.dbVersion],
              ["Size", `${sys.dbSizeMb} MB`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs font-mono py-0.5 gap-2">
                <span className="t-muted">{k}</span>
                <span className="t-secondary text-right truncate">{v}</span>
              </div>
            ))}
            <div className="mt-2 pt-2 space-y-1" style={{ borderTop: "1px solid var(--border)" }}>
              {sys.tables.map((t) => (
                <div key={t.name} className="flex justify-between text-[11px] font-mono gap-2">
                  <span className="t-muted truncate">{t.name}</span>
                  <span className="t-secondary shrink-0">{t.rows} rows · {t.sizeMb} MB</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-4">
            <div className="mb-2 t-muted"><ImageIcon size={16} /></div>
            <p className="text-sm font-semibold t-primary mb-2">Media & Storage</p>
            {[
              ["Covers", String(sys.media.covers)],
              ["Badges", String(sys.media.badges)],
              ["Docs (CV)", String(sys.media.docs)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs font-mono py-0.5 gap-2">
                <span className="t-muted">{k}</span>
                <span className="t-secondary">{v} files</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono t-muted">
              <HardDrive size={11} /> public/ uploads
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
