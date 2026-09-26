"use client";

import { useRef } from "react";
import Image from "next/image";
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
    icon: <Shield size={16} />,
    badge: "badge-hki",
  },
  cert: {
    label: "Certificate",
    icon: <Star size={16} />,
    badge: "badge-accent",
  },
  award: {
    label: "Award / Achievement",
    icon: <Award size={16} />,
    badge: "",
  },
};

export default function CertificationsGrid({ certs }: { certs: Certification[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const hkiCerts = certs.filter((c) => c.type === "hki");
  const other = certs.filter((c) => c.type !== "hki");

  const renderMark = (cert: Certification, fallback: React.ReactNode) => {
    if (cert.badgeImage) {
      return (
        <span
          className="relative block w-10 h-10 rounded-lg overflow-hidden shrink-0"
          style={{ border: "1px solid var(--border)" }}
        >
          <Image
            src={cert.badgeImage}
            alt={cert.title}
            fill
            sizes="40px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </span>
      );
    }
    return fallback;
  };

  return (
    <section id="certifications" ref={ref} className="py-20 max-w-5xl mx-auto px-6 scroll-mt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <p className="section-label mb-2">Recognition</p>
        <h2 className="section-title">Certifications & IP rights</h2>
        <p className="section-desc">Registered intellectual property and professional certifications.</p>
      </motion.div>

      {/* HKI Section */}
      <div className="mb-8">
        <p className="text-xs font-mono mb-4" style={{ color: "var(--text-muted)" }}>
          Kemenkumham RI — Registered Hak Cipta
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {hkiCerts.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="card card-hover p-5"
            >
              <div className="mb-4">
                {renderMark(cert, <Shield size={16} style={{ color: "var(--amber)" }} />)}
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                {cert.title}
              </p>
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                {cert.issuer}
              </p>
              <div className="flex items-center justify-between">
                {cert.regNumber && (
                  <span className="badge badge-hki" style={{ fontSize: "10px" }}>
                    {cert.regNumber}
                  </span>
                )}
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {cert.issueDate}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs leading-relaxed mt-4 max-w-2xl" style={{ color: "var(--text-muted)" }}>
          All copyrights are registered with DJKI Kemenkumham RI and verifiable
          through the public e-service portal.
        </p>
      </div>

      {/* Other certs grid */}
      <p className="text-xs font-mono mb-4" style={{ color: "var(--text-muted)" }}>
        Professional certifications & awards
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {other.map((cert, i) => {
          const cfg = TYPE_CONFIG[cert.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.cert;
          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
              className="card card-hover p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                {renderMark(cert, <span style={{ color: "var(--text-muted)" }}>{cfg.icon}</span>)}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-hover"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)", lineHeight: 1.35 }}>
                {cert.title}
              </p>
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                {cert.issuer}
              </p>
              <div className="flex items-center justify-between">
                <span className={`badge ${cfg.badge}`}>
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
