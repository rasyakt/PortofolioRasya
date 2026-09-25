"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, GraduationCap, Trophy, Code2, ArrowRight } from "lucide-react";

const TIMELINE = [
  {
    year: "2023 – Present",
    role: "Chief Technology Officer (CTO)",
    company: "BotHax",
    type: "work",
    color: "var(--accent)",
    icon: <Briefcase size={16} />,
    points: [
      "Defined and owned full technical architecture across all BotHax products",
      "Lua scripting for automation, packet handling, and event hooking systems",
      "Hardware & network administration — ensuring 99.9% uptime",
      "Led system maintenance, security hardening, and performance optimization",
    ],
  },
  {
    year: "2026",
    role: "LKS West Java Delegate",
    company: "Dinas Pendidikan & Olahraga Jawa Barat",
    type: "award",
    color: "#a78bfa",
    icon: <Trophy size={16} />,
    points: [
      "Selected as West Java Province delegate for Web Technologies competition",
      "Competed at the Provincial (Tingkat Provinsi) level representing SMK Negeri 1 Ciamis",
      "One of the most prestigious vocational skill competitions in Indonesia",
    ],
  },
  {
    year: "2026",
    role: "3× Kemenkumham IP Copyright Holder",
    company: "DJKI Kemenkumham RI",
    type: "award",
    color: "#fbbf24",
    icon: <Trophy size={16} />,
    points: [
      "ARTIKA-POS — Reg. No. 001416260 (Retail POS Ecosystem)",
      "ETAMU-KCD — Reg. No. 001449497 (Face Recognition Guestbook)",
      "Calakan — Reg. No. 001448869 (Ramadan Activity Tracker)",
    ],
  },
  {
    year: "2025 – 2026",
    role: "School Software Showcase Lead",
    company: "SMK Negeri 1 Ciamis",
    type: "work",
    color: "#38bdf8",
    icon: <Code2 size={16} />,
    points: [
      "Led development of 5+ internal systems used by the school daily",
      "MAS-PKL, a-Sign, Calakan, ETAMU-KCD — all in active production use",
      "Mentored fellow students in web development and system architecture",
    ],
  },
  {
    year: "2025",
    role: "AI Top Graduate",
    company: "IBM SkillsBuild × Hacktiv8 Indonesia",
    type: "cert",
    color: "#a78bfa",
    icon: <Trophy size={16} />,
    points: [
      "Completed end-to-end Agentic AI workflow training",
      "LLM orchestration, RAG pipelines, MLOps, IBM Bob",
      "Recognized as top graduate in cohort",
    ],
  },
  {
    year: "2024 – 2027",
    role: "Student — Software & Game Development",
    company: "SMK Negeri 1 Ciamis (PPLG / RPL)",
    type: "edu",
    color: "var(--text-muted)",
    icon: <GraduationCap size={16} />,
    points: [
      "Rekayasa Perangkat Lunak (RPL) / Pengembangan Perangkat Lunak dan Gim (PPLG)",
      "Building real systems for real institutions since Year 1",
      "Maintaining 12+ production projects alongside studies",
    ],
  },
];

export default function ExperienceTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref} className="py-20 max-w-6xl mx-auto px-6 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="section-label mb-2">Journey</p>
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Experience & Leadership
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          From student to CTO — engineering at every step
        </p>
      </motion.div>

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-px"
          style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }}
        />

        <div className="space-y-8 pl-16">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              {/* Dot */}
              <div
                className="absolute -left-12 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: `${item.color}18`,
                  border: `1.5px solid ${item.color}50`,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>

              {/* Card */}
              <div
                className="glass glass-hover p-5 rounded-xl"
                style={{ borderColor: `${item.color}20` }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-mono mb-1" style={{ color: item.color }}>
                      {item.year}
                    </p>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      {item.role}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {item.company}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {item.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <ArrowRight
                        size={12}
                        style={{ color: item.color, flexShrink: 0, marginTop: 3 }}
                      />
                      <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {pt}
                      </span>
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
