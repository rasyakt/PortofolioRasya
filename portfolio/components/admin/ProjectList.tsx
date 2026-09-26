"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield, ExternalLink, Star, Pencil, Copy, ChevronUp, ChevronDown, Search,
} from "lucide-react";
import type { Project } from "@prisma/client";
import {
  deleteProject, toggleFeatured, duplicateProject, moveProject,
} from "@/actions/projects";
import { toast } from "../ui/Toaster";
import DeleteButton from "./DeleteButton";

function safeParseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  enterprise: "#10b981", mobile: "#38bdf8", ai: "#a78bfa", systems: "#fbbf24", fullstack: "#f97316",
};

const iconBtn =
  "p-2 rounded-lg transition-all cursor-pointer bg-transparent border-none";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<unknown>, okMsg: string) => {
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
        toast(okMsg);
      } catch {
        toast("Action failed", "error");
      }
    });
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? projects.filter((p) =>
        [p.title, p.slug, p.category, p.techStack].join(" ").toLowerCase().includes(q)
      )
    : projects;

  return (
    <div>
      <div className="relative mb-4 max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          aria-label="Search projects"
          className="input-base"
          style={{ paddingLeft: "32px", fontSize: "13px" }}
        />
      </div>

      <div className="space-y-2" style={{ opacity: pending ? 0.6 : 1 }}>
        {filtered.map((p, i) => {
          const tech: string[] = safeParseJsonArray(p.techStack).slice(0, 3);
          return (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: CATEGORY_COLORS[p.category] || "var(--accent)" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium truncate t-primary">{p.title}</p>
                  {p.hkiNumber && (
                    <span className="badge badge-hki" style={{ fontSize: "10px" }}>
                      <Shield size={9} /> HKI
                    </span>
                  )}
                  {p.featured && (
                    <span className="badge badge-accent" style={{ fontSize: "10px" }}>
                      <Star size={9} /> Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs font-mono"
                    style={{ color: CATEGORY_COLORS[p.category] || "var(--accent)" }}
                  >
                    {p.category}
                  </span>
                  <span className="t-muted" style={{ fontSize: "10px" }}>·</span>
                  {tech.map((t) => (
                    <span key={t} className="badge" style={{ fontSize: "9px", padding: "1px 6px" }}>{t}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={iconBtn}
                    style={{ color: "var(--text-muted)" }}
                    title="Live URL"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
                <button
                  onClick={() => run(() => toggleFeatured(p.id, !p.featured), p.featured ? "Unfeatured" : "Marked featured")}
                  className={iconBtn}
                  style={{ color: p.featured ? "var(--amber)" : "var(--text-muted)" }}
                  title="Toggle Featured"
                >
                  <Star size={13} />
                </button>
                <Link
                  href={`/admin/projects/${p.id}`}
                  className={iconBtn}
                  style={{ color: "var(--text-muted)", display: "inline-block" }}
                  title="Edit"
                >
                  <Pencil size={13} />
                </Link>
                <button
                  onClick={() => run(() => duplicateProject(p.id), "Project duplicated")}
                  className={iconBtn}
                  style={{ color: "var(--text-muted)" }}
                  title="Duplicate"
                >
                  <Copy size={13} />
                </button>
                <button
                  onClick={() => run(() => moveProject(p.id, "up"), "Moved up")}
                  disabled={i === 0}
                  className={iconBtn}
                  style={{ color: "var(--text-muted)", opacity: i === 0 ? 0.3 : 1 }}
                  title="Move up"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  onClick={() => run(() => moveProject(p.id, "down"), "Moved down")}
                  disabled={i === filtered.length - 1}
                  className={iconBtn}
                  style={{ color: "var(--text-muted)", opacity: i === filtered.length - 1 ? 0.3 : 1 }}
                  title="Move down"
                >
                  <ChevronDown size={13} />
                </button>
                <DeleteButton onDelete={() => deleteProject(p.id)} itemName="Project" />
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-12 font-mono text-sm t-muted">
          {q ? `No projects match "${query}".` : "No projects yet."}
        </p>
      )}
    </div>
  );
}
