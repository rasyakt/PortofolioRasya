"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface ExpertiseArea {
  title: string;
  desc: string;
}

export default function ProjectBento({
  areas,
  tech,
}: {
  areas: ExpertiseArea[];
  tech: string[];
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (areas.length === 0 && tech.length === 0) return null;

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
        {areas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 card p-6 sm:p-7"
          >
            <div className="space-y-6">
              {areas.map((item, i) => (
                <div
                  key={item.title}
                  className={i > 0 ? "pt-6" : ""}
                  style={i > 0 ? { borderTop: "1px solid var(--border)" } : undefined}
                >
                  <p className="text-sm font-semibold t-primary mb-1">{item.title}</p>
                  <p className="text-[13px] leading-relaxed t-secondary">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stack */}
        {tech.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-5 card p-6 sm:p-7 flex flex-col"
          >
            <p className="text-sm font-semibold t-primary mb-1">Preferred stack</p>
            <p className="text-[13px] t-muted mb-5">
              Tools I reach for first.
            </p>
            <div className="flex flex-wrap gap-2">
              {tech.map((t) => (
                <span key={t} className="badge">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
