"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  GraduationCap,
  Copy,
  CheckCircle2,
  ExternalLink,
  Zap,
  Shield,
  Star,
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
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl scrollbar-hide"
            style={{
              background: "#111113",
              border: "1px solid rgba(16,185,129,0.25)",
              boxShadow: "0 0 0 1px rgba(16,185,129,0.1), 0 32px 80px rgba(0,0,0,0.8)",
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
                borderColor: "rgba(63,63,70,0.5)",
                background: "rgba(17,17,19,0.95)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <Zap size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="section-label text-xs">HRD / Recruiter Fast-Track</p>
                  <p className="text-white font-semibold text-sm mt-0.5">60-Second Executive Summary</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Identity */}
              <div className="flex gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #10b981, #38bdf8)", color: "#022c22" }}
                >
                  R
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Rasya Syahreza Maulana Zen</h2>
                  <p className="text-zinc-400 text-sm mt-0.5">Fullstack Mobile & Web Developer | AI Engineer | CTO at BotHax</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="status-available">
                      <span className="status-dot" />
                      Open for Internship / Full-time
                    </span>
                  </div>
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
                    style={{ background: "#18181b", border: "1px solid rgba(63,63,70,0.4)" }}
                  >
                    <span className="text-zinc-500">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500">{item.label}</p>
                      <p className="text-xs text-zinc-300 truncate font-mono">{item.value}</p>
                    </div>
                    {item.copyKey && (
                      <button
                        onClick={() => copy(item.value, item.copyKey!)}
                        className="p-1 rounded text-zinc-600 hover:text-emerald-400 transition-colors shrink-0"
                      >
                        {copied === item.copyKey ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    )}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-1 rounded text-zinc-600 hover:text-emerald-400 transition-colors shrink-0">
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
                    className="text-center p-3 rounded-lg"
                    style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}
                  >
                    <p className="text-lg font-bold text-emerald-400 font-mono">{m.value}</p>
                    <p className="text-xs text-zinc-500">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* HKI Intellectual Property */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-yellow-400" />
                  <p className="text-sm font-semibold text-white">Kemenkumham Hak Cipta (IP Copyright)</p>
                </div>
                <div className="space-y-2">
                  {HKI_CERTS.map((cert) => (
                    <div
                      key={cert.reg}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{cert.name}</p>
                        <p className="text-xs text-zinc-500 font-mono">Reg. No. {cert.reg}</p>
                      </div>
                      <span className="badge badge-hki">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Skills */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star size={14} className="text-emerald-400" />
                  <p className="text-sm font-semibold text-white">Core Technical Skills</p>
                </div>
                <div className="space-y-2">
                  {CORE_SKILLS.map((group) => (
                    <div key={group.category} className="flex gap-3 items-start">
                      <span className="text-xs text-zinc-500 w-20 shrink-0 pt-0.5 font-mono">{group.category}</span>
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
                <div className="p-4 rounded-xl" style={{ background: "#18181b", border: "1px solid rgba(63,63,70,0.4)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap size={14} className="text-zinc-500" />
                    <p className="text-xs font-semibold text-zinc-400">Education</p>
                  </div>
                  <p className="text-sm font-medium text-white">SMK Negeri 1 Ciamis</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Software & Game Dev (PPLG)</p>
                  <p className="text-xs text-zinc-600 mt-1 font-mono">2024 – 2027</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "#18181b", border: "1px solid rgba(63,63,70,0.4)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={14} className="text-zinc-500" />
                    <p className="text-xs font-semibold text-zinc-400">Current Role</p>
                  </div>
                  <p className="text-sm font-medium text-white">CTO at BotHax</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Technical Architecture & Engineering</p>
                  <p className="text-xs text-zinc-600 mt-1 font-mono">2023 – Present</p>
                </div>
              </div>

              {/* Award highlight */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award size={14} className="text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-400">LKS Jawa Barat 2026</p>
                </div>
                <p className="text-xs text-zinc-400">
                  Provincial delegate for Web Technologies competition — Dinas Pendidikan & Olahraga Jawa Barat
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
