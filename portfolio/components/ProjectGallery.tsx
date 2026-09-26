"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ExternalLink, Shield, ChevronRight, ChevronLeft, Layers,
  Zap, Target, Cpu, BarChart3, Search, Share2,
} from "lucide-react";
import { GithubIcon } from "./icons/BrandIcons";
import ProjectCover from "./ProjectCover";
import { track } from "@/lib/analytics";
import { copyText } from "@/lib/clipboard";
import { toast } from "./ui/Toaster";
import { useFocusTrap } from "@/lib/focus-trap";
import { useTilt } from "@/lib/interactions";

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  longDesc?: string | null;
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  impact?: string | null;
  techStack: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  coverImage?: string | null;
  hkiNumber?: string | null;
  featured: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  enterprise: "Enterprise",
  mobile: "Mobile",
  ai: "AI / Agents",
  systems: "Systems",
  fullstack: "Fullstack",
};

function safeParseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

function CaseStudyModal({
  project,
  onClose,
  onPrev,
  onNext,
  hasNav,
}: {
  project: Project;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasNav: boolean;
}) {
  const tech: string[] = safeParseJsonArray(project.techStack);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasNav) onPrev();
      else if (e.key === "ArrowRight" && hasNav) onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext, hasNav]);

  const share = async () => {
    const url = project.liveUrl || window.location.href;
    const data = { title: project.title, text: project.description, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      throw new Error("no share api");
    } catch {
      const ok = await copyText(url);
      toast(ok ? "Link copied to clipboard" : "Could not copy link", ok ? "success" : "error");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "var(--overlay)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <motion.div
        ref={dialogRef}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
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
        {/* Cover */}
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          <ProjectCover
            title={project.title}
            category={project.category}
            coverImage={project.coverImage}
            height={180}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-start justify-between p-6 pb-0"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge">
                {CATEGORY_LABELS[project.category]}
              </span>
              {project.hkiNumber && (
                <span className="badge badge-hki">
                  <Shield size={10} /> HKI #{project.hkiNumber}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold t-primary">
              {project.title}
            </h2>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={share}
              className="p-2 rounded-lg link-hover cursor-pointer bg-transparent border-none"
              title="Share project"
              aria-label="Share project"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg link-hover cursor-pointer bg-transparent border-none"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Description */}
          <p className="t-secondary" style={{ fontSize: "14px", lineHeight: "1.7" }}>
            {project.longDesc || project.description}
          </p>

          {/* Case study sections */}
          {[
            { icon: <Target size={14} />, label: "Problem", content: project.problem },
            { icon: <Zap size={14} />, label: "Solution", content: project.solution },
            { icon: <Layers size={14} />, label: "Architecture", content: project.architecture },
            { icon: <BarChart3 size={14} />, label: "Impact", content: project.impact },
          ].map(
            (s) =>
              s.content && (
                <div key={s.label}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="t-muted">{s.icon}</span>
                    <p className="text-xs font-semibold uppercase tracking-widest font-mono t-secondary">
                      {s.label}
                    </p>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)", borderLeft: "2px solid var(--border-strong)", paddingLeft: "12px" }}
                  >
                    {s.content}
                  </p>
                </div>
              )
          )}

          {/* Tech stack */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={14} className="t-muted" />
              <p className="text-xs font-semibold uppercase tracking-widest font-mono t-muted">
                Tech Stack
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tech.map((t, i) => (
                <span key={`${t}-${i}`} className="badge">{t}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1 justify-center">
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex-1 justify-center">
                <GithubIcon size={14} /> Source Code
              </a>
            )}
            {!project.liveUrl && !project.githubUrl && (
              <p className="text-xs font-mono t-muted">
                Private / NDA — Demo available on request
              </p>
            )}
          </div>

          {/* Prev / next */}
          {hasNav && (
            <div
              className="flex items-center justify-between"
              style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}
            >
              <button
                onClick={onPrev}
                className="inline-flex items-center gap-1.5 text-xs font-mono link-hover cursor-pointer bg-transparent border-none p-0"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <button
                onClick={onNext}
                className="inline-flex items-center gap-1.5 text-xs font-mono link-hover cursor-pointer bg-transparent border-none p-0"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const allTech = safeParseJsonArray(project.techStack);
  const tech: string[] = allTech.slice(0, 4);
  const tiltRef = useTilt<HTMLDivElement>(5);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="group card card-hover spotlight overflow-hidden flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div ref={tiltRef} className="flex flex-col flex-1 min-h-0">
      {/* Cover */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <ProjectCover
          title={project.title}
          category={project.category}
          coverImage={project.coverImage}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="badge">
              {CATEGORY_LABELS[project.category]}
            </span>
            {project.hkiNumber && (
              <span className="badge badge-hki text-[11px]">
                <Shield size={10} /> HKI
              </span>
            )}
            {project.featured && (
              <span className="badge badge-accent text-[11px]">Featured</span>
            )}
          </div>
          <span className="t-muted transition-colors">
            <ChevronRight size={15} />
          </span>
        </div>

        {/* Title & description */}
        <h3 className="font-semibold text-[15px] mb-2 t-primary leading-snug">
          {project.title}
        </h3>
        <p
          className="text-xs t-secondary leading-relaxed mb-4"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {project.description}
        </p>

        <div className="mt-auto">
          {/* Tech Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tech.map((t, i) => (
              <span key={`${t}-${i}`} className="badge">{t}</span>
            ))}
            {allTech.length > 4 && (
              <span className="badge">+{allTech.length - 4}</span>
            )}
          </div>

          {/* Links row */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex items-center gap-4 pt-3 text-xs" style={{ borderTop: "1px solid var(--border)" }}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono link-hover"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={12} /> Live
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono link-hover"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GithubIcon size={12} /> Source
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </motion.div>
  );
}

const TABS = [
  { id: "all", label: "All Projects" },
  { id: "enterprise", label: "Enterprise" },
  { id: "systems", label: "Systems" },
  { id: "fullstack", label: "Fullstack" },
  { id: "mobile", label: "Mobile" },
  { id: "ai", label: "AI / Agents" },
];

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const byTab = activeTab === "all" ? projects : projects.filter((p) => p.category === activeTab);
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter((p) =>
      [p.title, p.description, p.techStack, CATEGORY_LABELS[p.category] ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [projects, activeTab, query]);

  const openProject = (p: Project) => {
    track("project_open");
    setSelectedIdx(filtered.findIndex((x) => x.id === p.id));
  };

  return (
    <section id="projects" className="py-14 sm:py-20 max-w-5xl mx-auto px-6 scroll-mt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45 }}
        className="mb-8"
      >
        <p className="section-label mb-2">Projects</p>
        <h2 className="section-title">Selected work</h2>
        <p className="section-desc">
          {projects.length} production applications — select a card for the full case study.
        </p>
      </motion.div>

      {/* Filter tabs + search */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-1 max-w-full overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
          const count = tab.id === "all" ? projects.length : projects.filter((p) => p.category === tab.id).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer bg-transparent"
              style={
                isActive
                  ? { color: "var(--text-primary)", border: "1px solid var(--border-strong)", background: "var(--bg-elevated)" }
                  : { color: "var(--text-muted)", border: "1px solid transparent" }
              }
            >
              {tab.label} <span className="font-mono opacity-70">{count > 0 ? count : ""}</span>
            </button>
          );
        })}
        </div>
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            className="input-base"
            style={{ paddingLeft: "32px", width: "200px", fontSize: "12px", paddingTop: "7px", paddingBottom: "7px" }}
          />
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => openProject(p)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center py-16 font-mono text-sm t-muted">
          {query ? `No projects match "${query}".` : "No projects in this category yet."}
        </p>
      )}

      {/* Case study modal */}
      <AnimatePresence>
        {selectedIdx !== null && filtered[selectedIdx] && (
          <CaseStudyModal
            key={filtered[selectedIdx].id}
            project={filtered[selectedIdx]}
            onClose={() => setSelectedIdx(null)}
            onPrev={() => setSelectedIdx((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length))}
            onNext={() => setSelectedIdx((i) => (i === null ? i : (i + 1) % filtered.length))}
            hasNav={filtered.length > 1}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
