"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ExternalLink, Shield, ChevronRight, Layers,
  Zap, Target, Cpu, BarChart3,
} from "lucide-react";
import { GithubIcon } from "./icons/BrandIcons";

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

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  enterprise: { bg: "rgba(16,185,129,0.08)", text: "#10b981", border: "rgba(16,185,129,0.2)" },
  mobile: { bg: "rgba(56,189,248,0.08)", text: "#38bdf8", border: "rgba(56,189,248,0.2)" },
  ai: { bg: "rgba(167,139,250,0.08)", text: "#a78bfa", border: "rgba(167,139,250,0.2)" },
  systems: { bg: "rgba(251,191,36,0.08)", text: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  fullstack: { bg: "rgba(249,115,22,0.08)", text: "#f97316", border: "rgba(249,115,22,0.2)" },
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

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const tech: string[] = safeParseJsonArray(project.techStack);
  const catColor = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.fullstack;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl scrollbar-hide"
        style={{
          background: "#111113",
          border: `1px solid ${catColor.border}`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-start justify-between p-6 border-b"
          style={{ borderColor: "rgba(63,63,70,0.5)", background: "rgba(17,17,19,0.95)", backdropFilter: "blur(12px)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="badge text-xs"
                style={{ borderColor: catColor.border, background: catColor.bg, color: catColor.text }}
              >
                {CATEGORY_LABELS[project.category]}
              </span>
              {project.hkiNumber && (
                <span className="badge badge-hki text-xs">
                  <Shield size={10} /> HKI #{project.hkiNumber}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Description */}
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7" }}>
            {project.longDesc || project.description}
          </p>

          {/* Case study sections */}
          {[
            { icon: <Target size={14} />, label: "Problem", content: project.problem, color: "#f87171" },
            { icon: <Zap size={14} />, label: "Solution", content: project.solution, color: "var(--accent)" },
            { icon: <Layers size={14} />, label: "Architecture", content: project.architecture, color: "#38bdf8" },
            { icon: <BarChart3 size={14} />, label: "Impact", content: project.impact, color: "#a78bfa" },
          ].map(
            (s) =>
              s.content && (
                <div key={s.label}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <p className="text-xs font-semibold uppercase tracking-widest font-mono" style={{ color: s.color }}>
                      {s.label}
                    </p>
                  </div>
                  <p
                    className="text-sm leading-relaxed pl-5"
                    style={{ color: "var(--text-secondary)", borderLeft: `2px solid ${s.color}22`, paddingLeft: "12px" }}
                  >
                    {s.content}
                  </p>
                </div>
              )
          )}

          {/* Tech stack */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={14} style={{ color: "var(--text-muted)" }} />
              <p className="text-xs font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
                Tech Stack
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tech.map((t) => (
                <span key={t} className="badge">{t}</span>
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
              <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                Private / NDA — Demo available on request
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const allTech = safeParseJsonArray(project.techStack);
  const tech: string[] = allTech.slice(0, 4);
  const catColor = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.fullstack;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 flex flex-col justify-between cursor-pointer min-h-[220px]"
      onClick={onClick}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium"
              style={{ borderColor: catColor.border, background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}
            >
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
          <span className="text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">
            <ChevronRight size={15} />
          </span>
        </div>

        {/* Title & description */}
        <h3 className="font-bold text-base mb-2 text-white group-hover:text-emerald-300 transition-colors leading-snug">
          {project.title}
        </h3>
        <p
          className="text-xs text-zinc-400 leading-relaxed mb-4"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {project.description}
        </p>
      </div>

      <div>
        {/* Tech Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tech.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800/60 border border-zinc-700/40 text-zinc-300">
              {t}
            </span>
          ))}
          {allTech.length > 4 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800/30 text-zinc-500">
              +{allTech.length - 4}
            </span>
          )}
        </div>

        {/* Links row */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="flex items-center gap-3 pt-3 border-t border-zinc-800/60 text-xs">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={12} /> Live Preview
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-zinc-400 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon size={12} /> Source
              </a>
            )}
          </div>
        )}
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
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = activeTab === "all" ? projects : projects.filter((p) => p.category === activeTab);

  return (
    <section id="projects" className="py-20 max-w-6xl mx-auto px-6 scroll-mt-20">
      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">Projects</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Real-World Engineering
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          {projects.length} production applications — click any card for full case study & architectural breakdown
        </p>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-1.5 p-1.5 rounded-2xl mb-8 w-fit max-w-full overflow-x-auto scrollbar-hide bg-zinc-900/80 border border-zinc-800/80 shadow-inner"
      >
        {TABS.map((tab) => {
          const count = tab.id === "all" ? projects.length : projects.filter((p) => p.category === tab.id).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                    isActive
                      ? "bg-black/20 text-zinc-950"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center py-16 font-mono text-sm text-zinc-500">
          No projects in this category yet.
        </p>
      )}

      {/* Case study modal */}
      <AnimatePresence>
        {selected && <CaseStudyModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
