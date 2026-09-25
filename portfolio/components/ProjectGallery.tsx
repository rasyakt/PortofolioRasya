"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ExternalLink, Shield, ChevronRight, Layers,
  Zap, Target, Cpu, BarChart3,
} from "lucide-react";
import { GithubIcon } from "./icons/BrandIcons";
import ProjectCover from "./ProjectCover";

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

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const tech: string[] = safeParseJsonArray(project.techStack);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "var(--overlay)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
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
          <button
            onClick={onClose}
            className="p-2 rounded-lg link-hover cursor-pointer bg-transparent border-none"
          >
            <X size={16} />
          </button>
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
              <p className="text-xs font-mono t-muted">
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="group card card-hover overflow-hidden flex flex-col cursor-pointer"
      onClick={onClick}
    >
      {/* Cover */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <ProjectCover
          title={project.title}
          category={project.category}
          coverImage={project.coverImage}
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
            {tech.map((t) => (
              <span key={t} className="badge">{t}</span>
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
    <section id="projects" className="py-20 max-w-5xl mx-auto px-6 scroll-mt-20">
      {/* Header */}
      <div className="mb-8">
        <p className="section-label mb-2">Projects</p>
        <h2 className="section-title">Selected work</h2>
        <p className="section-desc">
          {projects.length} production applications — select a card for the full case study.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-8 max-w-full overflow-x-auto scrollbar-hide">
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

      {/* Grid */}
      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center py-16 font-mono text-sm t-muted">
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
