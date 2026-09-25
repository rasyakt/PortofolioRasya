"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FolderOpen, Award, Briefcase, Trophy, Code2, Cpu, Sparkles } from "lucide-react";

const METRICS = [
  {
    icon: <FolderOpen size={20} />,
    value: "12+",
    label: "Real Projects",
    sub: "Enterprise → Production",
    color: "var(--accent)",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    colSpan: 1,
  },
  {
    icon: <Award size={20} />,
    value: "3×",
    label: "Hak Cipta Terdaftar",
    sub: "Kemenkumham RI — DJKI",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    colSpan: 1,
  },
  {
    icon: <Briefcase size={20} />,
    value: "CTO",
    label: "BotHax",
    sub: "Technical Architecture & Lua — 2023–Present",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.2)",
    colSpan: 1,
  },
  {
    icon: <Trophy size={20} />,
    value: "LKS",
    label: "Jawa Barat 2026",
    sub: "Delegate Web Technologies — Provincial Level",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    colSpan: 1,
  },
];

const SKILL_BARS = [
  { label: "PHP / Laravel", pct: 95, color: "var(--accent)" },
  { label: "TypeScript / Next.js", pct: 88, color: "#38bdf8" },
  { label: "Python / AI Agents", pct: 80, color: "#a78bfa" },
  { label: "Kotlin / Android", pct: 72, color: "#f97316" },
  { label: "Go / Systems", pct: 65, color: "#fbbf24" },
];

const TECH_CHIPS = [
  "Laravel 12/13", "Next.js 15", "NestJS", "React", "Vue.js",
  "Flutter", "React Native", "Node.js", "Livewire", "Filament",
  "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Supabase",
  "Docker", "Nginx", "Linux", "Git", "Figma",
  "LLM Workflows", "RAG", "Prompt Eng.", "MLOps",
];

export default function ProjectBento() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="bento" ref={ref} className="py-20 max-w-6xl mx-auto px-6 scroll-mt-20">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="section-label mb-2">At a Glance</p>
        <h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white"
        >
          Engineering Credentials
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Verified achievements, technical leadership, and core competencies
        </p>
      </motion.div>

      {/* Metrics bento - Unified Obsidian Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group relative p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
          >
            {/* Subtle glow on hover */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
              style={{ background: m.bg, border: `1px solid ${m.border}` }}
            >
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <p
              className="text-3xl font-extrabold font-mono mb-1 tracking-tight"
              style={{ color: m.color }}
            >
              {m.value}
            </p>
            <p className="text-sm font-semibold text-zinc-200">
              {m.label}
            </p>
            <p className="text-xs mt-1 text-zinc-400 leading-relaxed">
              {m.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom row: skill bars + tech cloud */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Skill proficiency (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-5 p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Code2 size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Core Proficiencies
              </p>
              <p className="text-[11px] text-zinc-500">Benchmark capability assessment</p>
            </div>
          </div>
          <div className="space-y-4">
            {SKILL_BARS.map((s, i) => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                  <span className="text-zinc-300 font-medium">
                    {s.label}
                  </span>
                  <span className="text-zinc-400">
                    {s.pct}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden bg-zinc-800/80 p-0.5"
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${s.pct}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech cloud (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-7 p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <Cpu size={16} className="text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Production Tech Stack
                </p>
                <p className="text-[11px] text-zinc-500">Frameworks, languages, databases & AI tools</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_CHIPS.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-6 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>Enterprise-ready architectures</span>
            <span className="text-emerald-400">100% Type-Safe</span>
          </div>
        </motion.div>
      </div>

      {/* Wide feature card — AI / IBM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-6 rounded-2xl mt-4 bg-gradient-to-r from-purple-950/20 via-zinc-900/60 to-zinc-900/60 border border-purple-500/20"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20"
            >
              <Sparkles size={22} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                IBM SkillsBuild × Hacktiv8 — AI Top Graduate
              </p>
              <p className="text-xs mt-0.5 text-zinc-400">
                End-to-end Agentic AI Workflows · LLM · RAG · MLOps · IBM Bob Architecture
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="badge" style={{ borderColor: "rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.08)", color: "#a78bfa" }}>
              IBM SkillsBuild
            </span>
            <span className="badge" style={{ borderColor: "rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.08)", color: "#a78bfa" }}>
              Hacktiv8
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
