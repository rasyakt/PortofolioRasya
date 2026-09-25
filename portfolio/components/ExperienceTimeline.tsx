"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, GraduationCap, Trophy, Code2 } from "lucide-react";

const TIMELINE = [
  {
    year: "2023 – Present",
    role: "Chief Technology Officer",
    company: "BotHax",
    icon: <Briefcase size={14} />,
    points: [
      "Own full technical architecture across all BotHax products",
      "Automation scripting, hardware & network administration",
      "System maintenance, security hardening, performance optimization",
    ],
  },
  {
    year: "2026",
    role: "LKS West Java Delegate — Web Technologies",
    company: "Dinas Pendidikan Jawa Barat",
    icon: <Trophy size={14} />,
    points: [
      "Provincial-level vocational skill competition",
      "Representing SMK Negeri 1 Ciamis",
    ],
  },
  {
    year: "2026",
    role: "3× Kemenkumham IP Copyright Holder",
    company: "DJKI Kemenkumham RI",
    icon: <Trophy size={14} />,
    points: [
      "ARTIKA-POS — Reg. No. 001416260",
      "ETAMU-KCD — Reg. No. 001449497",
      "Calakan — Reg. No. 001448869",
    ],
  },
  {
    year: "2025 – 2026",
    role: "School Software Showcase Lead",
    company: "SMK Negeri 1 Ciamis",
    icon: <Code2 size={14} />,
    points: [
      "5+ internal systems in daily production use",
      "Mentored peers in web development and system design",
    ],
  },
  {
    year: "2025",
    role: "AI Top Graduate",
    company: "IBM SkillsBuild × Hacktiv8",
    icon: <Trophy size={14} />,
    points: [
      "Agentic AI workflows, LLM orchestration, RAG, MLOps",
    ],
  },
  {
    year: "2024 – 2027",
    role: "Software & Game Development Student",
    company: "SMK Negeri 1 Ciamis (PPLG / RPL)",
    icon: <GraduationCap size={14} />,
    points: [
      "Building production systems alongside studies",
    ],
  },
];

export default function ExperienceTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref} className="py-20 max-w-5xl mx-auto px-6 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <p className="section-label mb-2">Journey</p>
        <h2 className="section-title">Experience</h2>
        <p className="section-desc">From student to CTO.</p>
      </motion.div>

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[15px] top-1 bottom-1 w-px"
          style={{ background: "var(--border)" }}
        />

        <div className="space-y-3">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="relative pl-12"
            >
              {/* Dot */}
              <div
                className="absolute left-0 top-5 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-secondary)",
                }}
              >
                {item.icon}
              </div>

              {/* Card */}
              <div className="card card-hover p-5">
                <p className="text-[11px] font-mono mb-1" style={{ color: "var(--text-muted)" }}>
                  {item.year}
                </p>
                <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {item.role}
                </h3>
                <p className="text-xs mt-0.5 mb-3" style={{ color: "var(--text-muted)" }}>
                  {item.company}
                </p>
                <ul className="space-y-1">
                  {item.points.map((pt, j) => (
                    <li key={j} className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
