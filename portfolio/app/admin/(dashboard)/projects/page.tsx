import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteProject, toggleFeatured } from "@/actions/projects";
import { Shield, Plus, Pencil, Trash2, ExternalLink, Star } from "lucide-react";

function safeParseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });

  const CATEGORY_COLORS: Record<string, string> = {
    enterprise: "#10b981", mobile: "#38bdf8", ai: "#a78bfa", systems: "#fbbf24", fullstack: "#f97316",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Projects</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {projects.length} projects total
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          <Plus size={15} /> New Project
        </Link>
      </div>

      <div className="space-y-2">
        {projects.map((p: import("@prisma/client").Project) => {
          const tech: string[] = safeParseJsonArray(p.techStack).slice(0, 3);
          return (
            <div
              key={p.id}
              className="glass p-4 rounded-xl flex items-center gap-4"
            >
              {/* Category dot */}
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: CATEGORY_COLORS[p.category] || "var(--accent)" }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {p.title}
                  </p>
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
                  <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>·</span>
                  {tech.map((t) => (
                    <span key={t} className="badge" style={{ fontSize: "9px", padding: "1px 6px" }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all"
                    style={{ color: "var(--text-muted)" }}
                    title="Live URL"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}

                {/* Toggle featured */}
                <form action={async () => { "use server"; await toggleFeatured(p.id, !p.featured); }}>
                  <button
                    type="submit"
                    className="p-2 rounded-lg transition-all"
                    style={{ color: p.featured ? "#fbbf24" : "var(--text-muted)" }}
                    title="Toggle Featured"
                  >
                    <Star size={13} />
                  </button>
                </form>

                <Link
                  href={`/admin/projects/${p.id}`}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: "var(--text-muted)" }}
                  title="Edit"
                >
                  <Pencil size={13} />
                </Link>

                {/* Delete */}
                <form action={async () => { "use server"; await deleteProject(p.id); }}>
                  <button
                    type="submit"
                    className="p-2 rounded-lg transition-all text-zinc-600 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
