"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, GraduationCap, Trophy, Code2 } from "lucide-react";

export interface TimelineItem {
  year: string;
  role: string;
  company: string;
  points: string[];
}

function pickIcon(role: string, company: string) {
  const text = `${role} ${company}`.toLowerCase();
  if (/lks|hki|copyright|award|graduate|delegate/.test(text)) return <Trophy size={14} />;
  if (/student|school|education|smk|university|mentor/.test(text)) return <GraduationCap size={14} />;
  if (/cto|chief|lead|architect|manager/.test(text)) return <Briefcase size={14} />;
  return <Code2 size={14} />;
}

export default function ExperienceTimeline({ items }: { items: TimelineItem[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (items.length === 0) return null;

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
        <p className="section-desc">{items.length} roles & milestones.</p>
      </motion.div>

      <div className="relative">
        {/* Vertical line — draws in on scroll */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-[15px] top-1 bottom-1 w-px origin-top"
          style={{ background: "var(--border-strong)" }}
        />

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={`${item.role}-${i}`}
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
                {pickIcon(item.role, item.company)}
              </div>

              {/* Card */}
              <div className="card card-hover p-5">
                <p className="text-[11px] font-mono t-muted mb-1">
                  {item.year}
                </p>
                <h3 className="font-semibold text-sm t-primary">
                  {item.role}
                </h3>
                <p className="text-xs t-muted mt-0.5 mb-3">
                  {item.company}
                </p>
                {item.points.length > 0 && (
                  <ul className="space-y-1">
                    {item.points.map((pt, j) => (
                      <li key={j} className="text-[13px] leading-relaxed t-secondary">
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
