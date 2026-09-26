"use client";

import { useState, useEffect, useRef } from "react";
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
  Eye,
} from "lucide-react";
import type { ProfileConfig, Certification } from "@prisma/client";
import { GithubIcon } from "./icons/BrandIcons";
import CVPreviewModal from "./CVPreviewModal";
import { track } from "@/lib/analytics";
import { copyText } from "@/lib/clipboard";
import { toast } from "./ui/Toaster";
import { useFocusTrap } from "@/lib/focus-trap";

interface RecruiterModalProps {
  open: boolean;
  onClose: () => void;
  profile: ProfileConfig | null;
  hkiCerts: Certification[];
  tech: string[];
  projectCount: number;
}

export default function RecruiterModal({
  open,
  onClose,
  profile,
  hkiCerts,
  tech,
  projectCount,
}: RecruiterModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [cvPreviewOpen, setCvPreviewOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open && !cvPreviewOpen);

  useEffect(() => {
    if (!open || cvPreviewOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, cvPreviewOpen]);

  const name = profile?.name || "Rasya Syahreza Maulana Zen";
  const headline = profile?.headline || "Fullstack Developer · AI Engineer · CTO at BotHax";
  const email = profile?.email || "rasyasyahrezamaulanazen@gmail.com";
  const phone = profile?.phone || "+62 838 4055 9238";
  const location = profile?.location || "Ciamis, West Java, Indonesia";
  const github = profile?.github || "https://github.com/rasyakt";
  const cvUrl = profile?.cvUrl || "/cv.pdf";
  const available = profile ? profile.isAvailable : true;
  const availabilityText = profile?.availabilityText || "Open for Internship / Full-time";
  const waNumber = phone.replace(/\D/g, "");

  const copy = async (text: string, label: string) => {
    const ok = await copyText(text);
    if (!ok) {
      toast("Copy failed", "error");
      return;
    }
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
          role="dialog"
          aria-modal="true"
          aria-label="Recruiter summary"
        >
          <motion.div
            ref={dialogRef}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius)",
            }}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-surface)",
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
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Identity */}
              <div>
                <h2 className="text-xl font-semibold t-primary tracking-tight">{name}</h2>
                <p className="text-sm t-secondary mt-1">{headline}</p>
                <div className="flex items-center gap-2 mt-3">
                  {available ? (
                    <span className="status-available">
                      <span className="status-dot" />
                      {availabilityText}
                    </span>
                  ) : (
                    <span className="badge">{availabilityText}</span>
                  )}
                </div>
              </div>

              {/* Contact row */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <Mail size={14} />, label: "Email", value: email, copyKey: "email" },
                  { icon: <Phone size={14} />, label: "WhatsApp", value: phone, copyKey: "phone" },
                  { icon: <MapPin size={14} />, label: "Location", value: location, copyKey: null },
                  { icon: <GithubIcon size={14} />, label: "GitHub", value: github.replace("https://", ""), copyKey: null, link: github },
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
                        onClick={() => copy(item.label === "Email" ? email : phone, item.copyKey!)}
                        className="p-1 rounded icon-btn shrink-0"
                        aria-label={`Copy ${item.label}`}
                      >
                        {copied === item.copyKey ? <CheckCircle2 size={12} style={{ color: "var(--accent)" }} /> : <Copy size={12} />}
                      </button>
                    )}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-1 rounded icon-btn shrink-0" aria-label="Open GitHub">
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: `${projectCount}+`, label: "Projects" },
                  { value: `${hkiCerts.length}x`, label: "HKI Reg." },
                  { value: "CTO", label: "BotHax" },
                  { value: "LKS", label: "Jabar 2026" },
                ].map((m) => (
                  <div key={m.label} className="text-center p-3 card">
                    <p className="text-lg font-semibold t-primary font-mono">{m.value}</p>
                    <p className="text-xs t-muted">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* HKI Intellectual Property */}
              {hkiCerts.length > 0 && (
                <div>
                  <p className="text-sm font-semibold t-primary mb-3">Kemenkumham Hak Cipta</p>
                  <div className="space-y-2">
                    {hkiCerts.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 card">
                        <div>
                          <p className="text-sm font-medium t-primary">{cert.title}</p>
                          {cert.regNumber && (
                            <p className="text-xs font-mono t-muted">Reg. No. {cert.regNumber}</p>
                          )}
                        </div>
                        <span className="badge badge-hki">{cert.issueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Skills */}
              {tech.length > 0 && (
                <div>
                  <p className="text-sm font-semibold t-primary mb-3">Technical stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tech.map((t) => (
                      <span key={t} className="badge">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 card">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap size={14} className="t-muted" />
                    <p className="text-xs font-semibold t-secondary">Education</p>
                  </div>
                  <p className="text-sm font-medium t-primary">SMK Negeri 1 Ciamis</p>
                  <p className="text-xs t-muted mt-0.5">Software & Game Dev (PPLG)</p>
                  <p className="text-xs t-muted mt-1 font-mono">2024 – 2027</p>
                </div>
                <div className="p-4 card">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={14} className="t-muted" />
                    <p className="text-xs font-semibold t-secondary">Current Role</p>
                  </div>
                  <p className="text-sm font-medium t-primary">CTO at BotHax</p>
                  <p className="text-xs t-muted mt-0.5">Technical Architecture & Engineering</p>
                  <p className="text-xs t-muted mt-1 font-mono">2023 – Present</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <a
                  href={cvUrl}
                  download="Rasya_Syahreza_CV.pdf"
                  onClick={() => track("cv_download")}
                  className="btn btn-primary flex-1 text-center justify-center"
                >
                  <Download size={15} />
                  Download CV (PDF)
                </a>
                <button
                  onClick={() => setCvPreviewOpen(true)}
                  className="btn btn-secondary"
                  style={{ padding: "10px 14px" }}
                  title="Preview CV"
                  aria-label="Preview CV"
                >
                  <Eye size={15} />
                </button>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("contact_click")}
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
      <CVPreviewModal
        open={cvPreviewOpen}
        onClose={() => setCvPreviewOpen(false)}
        cvUrl={cvUrl}
      />
    </AnimatePresence>
  );
}
