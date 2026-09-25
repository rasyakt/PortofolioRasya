"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Star, ExternalLink } from "lucide-react";

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  badgeImage?: string | null;
  type: string;
  regNumber?: string | null;
  order: number;
}

const TYPE_CONFIG = {
  hki: {
    label: "Hak Cipta — Kemenkumham RI",
    icon: <Shield size={18} />,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    badge: "badge-hki",
  },
  cert: {
    label: "Certificate",
    icon: <Star size={18} />,
    color: "var(--accent)",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.15)",
    badge: "badge-accent",
  },
  award: {
    label: "Award / Achievement",
    icon: <Award size={18} />,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.06)",
    border: "rgba(167,139,250,0.15)",
    badge: "",
  },
};

export default function CertificationsGrid({ certs }: { certs: Certification[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const hkiCerts = certs.filter((c) => c.type === "hki");
  const other = certs.filter((c) => c.type !== "hki");

  return (
    <section id="certifications" ref={ref} className="py-20 max-w-6xl mx-auto px-6 scroll-mt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="section-label mb-2">Legal & Recognition</p>
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Certifications & IP Copyrights
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Verified intellectual property registrations and professional certifications
        </p>
      </motion.div>

      {/* HKI Section — Featured */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={14} style={{ color: "#fbbf24" }} />
          <p className="text-xs font-semibold uppercase tracking-widest font-mono" style={{ color: "#fbbf24" }}>
            Kemenkumham RI — Hak Cipta Terdaftar
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {hkiCerts.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass glass-hover p-5 rounded-xl"
              style={{
                borderColor: "rgba(251,191,36,0.25)",
                background: "rgba(251,191,36,0.05)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
              >
                <Shield size={18} style={{ color: "#fbbf24" }} />
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                {cert.title}
              </p>
              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                {cert.issuer}
              </p>
              <div className="flex items-center justify-between">
                {cert.regNumber && (
                  <span className="badge badge-hki" style={{ fontSize: "10px" }}>
                    Reg. {cert.regNumber}
                  </span>
                )}
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {cert.issueDate}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Official HKI notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-xl mb-8 flex items-start gap-3"
        style={{
          background: "rgba(251,191,36,0.04)",
          border: "1px solid rgba(251,191,36,0.12)",
        }}
      >
        <Shield size={14} style={{ color: "#fbbf24", flexShrink: 0, marginTop: 2 }} />
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          All Hak Cipta (intellectual property copyrights) are officially registered with{" "}
          <strong style={{ color: "#fbbf24" }}>
            Direktorat Jenderal Kekayaan Intelektual (DJKI) Kemenkumham RI
          </strong>{" "}
          and are legally protected under Indonesian IP law. Registration numbers are publicly verifiable
          through the DJKI e-service portal.
        </p>
      </motion.div>

      {/* Other certs grid */}
      <div className="flex items-center gap-2 mb-4">
        <Star size={14} style={{ color: "var(--accent)" }} />
        <p className="text-xs font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
          Professional Certifications & Awards
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {other.map((cert, i) => {
          const cfg = TYPE_CONFIG[cert.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.cert;
          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="glass glass-hover p-4 rounded-xl"
              style={{ borderColor: cfg.border, background: cfg.bg }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}28` }}
                >
                  <span style={{ color: cfg.color }}>{cfg.icon}</span>
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = cfg.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)", lineHeight: 1.3 }}>
                {cert.title}
              </p>
              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                {cert.issuer}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="badge text-xs"
                  style={{ borderColor: cfg.border, background: `${cfg.color}10`, color: cfg.color }}
                >
                  {cert.type === "hki" ? "HKI" : cert.type === "award" ? "Award" : "Cert"}
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {cert.issueDate}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
