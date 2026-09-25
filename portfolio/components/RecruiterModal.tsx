"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Copy,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { GithubIcon } from "./icons/BrandIcons";

interface RecruiterModalProps {
  open: boolean;
  onClose: () => void;
}

const HKI_CERTS = [
  { name: "ARTIKA-POS", reg: "001416260", date: "Aug 2026" },
  { name: "ETAMU-KCD", reg: "001449497", date: "Aug 2026" },
  { name: "Calakan", reg: "001448869", date: "Aug 2026" },
];

const CORE_SKILLS = [
  { category: "Languages", items: ["PHP", "TypeScript", "Python", "Kotlin", "Go", "SQL"] },
  { category: "Frameworks", items: ["Laravel 12/13", "Next.js", "NestJS", "React", "Flutter"] },
  { category: "Databases", items: ["MySQL", "PostgreSQL", "SQLite", "MongoDB", "Supabase"] },
  { category: "AI & Agents", items: ["LLM Workflows", "RAG", "Prompt Eng.", "MLOps"] },
  { category: "Tools", items: ["Docker", "Git", "Nginx", "Figma", "Linux"] },
];

export default function RecruiterModal({ open, onClose }: RecruiterModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "var(--overlay)", backdropFilter: "blur(8px)" }}
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
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-surface)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="section-label">Recruiter summary</p>
                  <p className="t-primary font-semibold text-sm mt-1">60-second overview</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg link-hover cursor-pointer bg-transparent border-none"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Identity */}
              <div>
                <h2 className="text-xl font-semibold t-primary tracking-tight">Rasya Syahreza Maulana Zen</h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Fullstack Developer · AI Engineer · CTO at BotHax</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="status-available">
                    <span className="status-dot" />
                    Open for Internship / Full-time
                  </span>
                </div>
              </div>

              {/* Contact row */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <Mail size={14} />, label: "Email", value: "rasyasyahrezamaulanazen@gmail.com", copyKey: "email" },
                  { icon: <Phone size={14} />, label: "WhatsApp", value: "+62 838 4055 9238", copyKey: "phone" },
                  { icon: <MapPin size={14} />, label: "Location", value: "Ciamis, West Java, Indonesia", copyKey: null },
                  { icon: <GithubIcon size={14} />, label: "GitHub", value: "github.com/rasyakt", copyKey: null, link: "https://github.com/rasyakt" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 p-3 rounded-lg"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                  >
                    <span className="t-muted">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs t-muted">{item.label}</p>
                      <p className="text-xs t-secondary truncate font-mono">{item.value}</p>
                    </div>
                    {item.copyKey && (
                      <button
                        onClick={() => copy(item.value, item.copyKey!)}
                        className="p-1 rounded icon-btn shrink-0"
                      >
                        {copied === item.copyKey ? <CheckCircle2 size={12} style={{ color: "var(--accent)" }} /> : <Copy size={12} />}
                      </button>
                    )}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-1 rounded icon-btn shrink-0">
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "12+", label: "Projects" },
                  { value: "3x", label: "HKI Reg." },
                  { value: "CTO", label: "BotHax" },
                  { value: "LKS", label: "Jabar 2026" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="text-center p-3 card"
                  >
                    <p className="text-lg font-semibold t-primary font-mono">{m.value}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.label}</p>
                  </div>
                ))}
              </div>

              {/* HKI Intellectual Property */}
              <div>
                <p className="text-sm font-semibold t-primary mb-3">Kemenkumham Hak Cipta</p>
                <div className="space-y-2">
                  {HKI_CERTS.map((cert) => (
                    <div
                      key={cert.reg}
                      className="flex items-center justify-between p-3 card"
                    >
                      <div>
                        <p className="text-sm font-medium t-primary">{cert.name}</p>
                        <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Reg. No. {cert.reg}</p>
                      </div>
                      <span className="badge badge-hki">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Skills */}
              <div>
                <p className="text-sm font-semibold t-primary mb-3">Core technical skills</p>
                <div className="space-y-2">
                  {CORE_SKILLS.map((group) => (
                    <div key={group.category} className="flex gap-3 items-start">
                      <span className="text-xs t-muted w-20 shrink-0 pt-0.5 font-mono">{group.category}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span key={item} className="badge">{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 card" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap size={14} className="t-muted" />
                    <p className="text-xs font-semibold t-secondary">Education</p>
                  </div>
                  <p className="text-sm font-medium t-primary">SMK Negeri 1 Ciamis</p>
                  <p className="text-xs t-muted mt-0.5">Software & Game Dev (PPLG)</p>
                  <p className="text-xs t-muted mt-1 font-mono">2024 – 2027</p>
                </div>
                <div className="p-4 card" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={14} className="t-muted" />
                    <p className="text-xs font-semibold t-secondary">Current Role</p>
                  </div>
                  <p className="text-sm font-medium t-primary">CTO at BotHax</p>
                  <p className="text-xs t-muted mt-0.5">Technical Architecture & Engineering</p>
                  <p className="text-xs t-muted mt-1 font-mono">2023 – Present</p>
                </div>
              </div>

              {/* Award highlight */}
              <div className="p-4 card">
                <p className="text-sm font-semibold t-primary mb-1">LKS Jawa Barat 2026</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Provincial delegate for Web Technologies — Dinas Pendidikan Jawa Barat
                </p>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <a
                  href="/cv.pdf"
                  download="Rasya_Syahreza_CV.pdf"
                  className="btn btn-primary flex-1 text-center justify-center"
                >
                  <Download size={15} />
                  Download CV (PDF)
                </a>
                <a
                  href="https://wa.me/6283840559238"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary flex-1 text-center justify-center"
                >
                  <Phone size={15} />
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
