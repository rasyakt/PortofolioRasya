"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import {
  Shield, ExternalLink, Star, Pencil, Copy, GripVertical, Search,
} from "lucide-react";
import type { Project } from "@prisma/client";
import {
  deleteProject, toggleFeatured, duplicateProject, reorderProjects,
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

interface RowActions {
  onToggle: (p: Project) => void;
  onDuplicate: (p: Project) => void;
  onDelete: (p: Project) => Promise<unknown>;
}

function ProjectRow({ p, draggable, actions }: { p: Project; draggable: boolean; actions: RowActions }) {
  const controls = useDragControls();
  const tech: string[] = safeParseJsonArray(p.techStack).slice(0, 3);

  const content = (
    <>
      {draggable && (
        <button
          onPointerDown={(e) => controls.start(e)}
          className={`${iconBtn} touch-none cursor-grab active:cursor-grabbing shrink-0`}
          style={{ color: "var(--text-muted)", touchAction: "none" }}
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <GripVertical size={14} />
        </button>
      )}
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
          {tech.map((t, i) => (
            <span key={`${t}-${i}`} className="badge" style={{ fontSize: "9px", padding: "1px 6px" }}>{t}</span>
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
          onClick={() => actions.onToggle(p)}
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
          onClick={() => actions.onDuplicate(p)}
          className={iconBtn}
          style={{ color: "var(--text-muted)" }}
          title="Duplicate"
        >
          <Copy size={13} />
        </button>
        <DeleteButton onDelete={() => actions.onDelete(p)} itemName="Project" />
      </div>
    </>
  );

  if (!draggable) {
    return <div className="card p-4 flex items-center gap-4">{content}</div>;
  }
  return (
    <Reorder.Item
      value={p}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02 }}
      className="card p-4 flex items-center gap-3"
      style={{ listStyle: "none" }}
    >
      {content}
    </Reorder.Item>
  );
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [ordered, setOrdered] = useState(projects);
  const [pending, startTransition] = useTransition();

  // Re-sync when server data changes (after mutations) — deferred for purity.
  useEffect(() => {
    const t = setTimeout(() => setOrdered(projects), 0);
    return () => clearTimeout(t);
  }, [projects]);

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

  const actions: RowActions = {
    onToggle: (p) => run(() => toggleFeatured(p.id, !p.featured), p.featured ? "Unfeatured" : "Marked featured"),
    onDuplicate: (p) => run(() => duplicateProject(p.id), "Project duplicated"),
    onDelete: (p) => deleteProject(p.id),
  };

  const handleReorder = (next: Project[]) => {
    setOrdered(next);
    startTransition(async () => {
      try {
        await reorderProjects(next.map((p) => p.id));
        router.refresh();
      } catch {
        toast("Failed to save order", "error");
      }
    });
  };

  const q = query.trim().toLowerCase();
  const dragging = q === "";
  const filtered = q
    ? ordered.filter((p) =>
        [p.title, p.slug, p.category, p.techStack].join(" ").toLowerCase().includes(q)
      )
    : ordered;

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

      <div style={{ opacity: pending ? 0.6 : 1 }}>
        {dragging ? (
          <Reorder.Group axis="y" values={ordered} onReorder={handleReorder} className="space-y-2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {ordered.map((p) => (
              <ProjectRow key={p.id} p={p} draggable actions={actions} />
            ))}
          </Reorder.Group>
        ) : (
          <div className="space-y-2">
            {filtered.map((p) => (
              <ProjectRow key={p.id} p={p} draggable={false} actions={actions} />
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-12 font-mono text-sm t-muted">
          {q ? `No projects match "${query}".` : "No projects yet."}
        </p>
      )}
      {dragging && ordered.length > 1 && (
        <p className="text-xs font-mono t-muted mt-3">Drag the handle to reorder.</p>
      )}
    </div>
  );
}
