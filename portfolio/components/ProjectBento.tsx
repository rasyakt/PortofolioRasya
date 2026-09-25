"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EXPERTISE = [
  {
    title: "Web Systems",
    desc: "Enterprise dashboards, POS ecosystems, and school information systems — Laravel, Next.js, NestJS.",
  },
  {
    title: "Mobile Apps",
    desc: "Cross-platform and native apps shipped to real users — Flutter, React Native, Kotlin.",
  },
  {
    title: "AI Engineering",
    desc: "Agentic workflows, RAG pipelines, and LLM integrations — Python, MLOps practices.",
  },
];

const STACK = [
  "Laravel",
  "Next.js",
  "TypeScript",
  "NestJS",
  "Flutter",
  "Python",
  "PostgreSQL",
  "MySQL",
  "Docker",
  "Git",
  "Linux",
  "Figma",
];

export default function ProjectBento() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="bento" ref={ref} className="py-20 max-w-5xl mx-auto px-6 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <p className="section-label mb-2">Expertise</p>
        <h2 className="section-title">What I work with</h2>
        <p className="section-desc">Production experience across web, mobile, and AI.</p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-4">
        {/* Expertise list */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-7 card p-6 sm:p-7"
        >
          <div className="space-y-6">
            {EXPERTISE.map((item, i) => (
              <div
                key={item.title}
                className={i > 0 ? "pt-6" : ""}
                style={i > 0 ? { borderTop: "1px solid var(--border)" } : undefined}
              >
                <p className="text-sm font-semibold t-primary mb-1">{item.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stack */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-5 card p-6 sm:p-7 flex flex-col"
        >
          <p className="text-sm font-semibold t-primary mb-1">Preferred stack</p>
          <p className="text-[13px] mb-5" style={{ color: "var(--text-muted)" }}>
            Tools I reach for first.
          </p>
          <div className="flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <span key={tech} className="badge">
                {tech}
              </span>
            ))}
          </div>
          <p
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)", marginTop: "24px", paddingTop: "20px" }}
          >
            IBM SkillsBuild × Hacktiv8 — AI Top Graduate
          </p>
        </motion.div>
      </div>
    </section>
  );
}
