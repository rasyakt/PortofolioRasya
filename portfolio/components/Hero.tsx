"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ArrowRight, Copy, Check } from "lucide-react";
import RecruiterModal from "./RecruiterModal";
import ProfilePhoto from "./ProfilePhoto";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/rasyakt" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rasya-syahreza-maulana-zen" },
  { label: "Website", href: "https://gasela.my.id" },
];

const STATS = [
  { value: "12+", label: "Production projects" },
  { value: "3×", label: "Registered IP copyrights" },
  { value: "CTO", label: "BotHax, since 2023" },
];

export default function Hero() {
  const [emailCopied, setEmailCopied] = useState(false);
  const [recruiterOpen, setRecruiterOpen] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("rasyasyahrezamaulanazen@gmail.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <>
      <section
        id="hero"
        className="relative flex flex-col justify-center hero-wash"
        style={{ minHeight: "88vh", paddingTop: "64px" }}
      >
        <div className="max-w-5xl mx-auto px-6 w-full py-16 grid lg:grid-cols-[1fr_280px] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Status */}
            <div className="flex flex-wrap items-center gap-3 mb-7">
              <span className="status-available">
                <span className="status-dot" />
                Open for Internship / Full-time
              </span>
              <span className="text-xs font-mono t-muted">
                Ciamis, West Java
              </span>
            </div>

            {/* Name + role */}
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight t-primary leading-[1.1] mb-4">
              Rasya Syahreza
              <br />
              Maulana Zen
            </h1>
            <p className="text-[15px] t-secondary mb-5">
              Fullstack Developer · AI Engineer ·{" "}
              <span style={{ color: "var(--accent)" }}>CTO at BotHax</span>
            </p>

            {/* Bio */}
            <p className="text-[15px] leading-relaxed max-w-xl t-secondary mb-9">
              I build enterprise web systems, AI workflows, and mobile apps that
              run in production. 3× Kemenkumham IP copyright holder and
              West Java LKS delegate.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <a
                href="#projects"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View Projects
                <ArrowRight size={15} />
              </a>
              <a href="/cv.pdf" download="Rasya_Syahreza_CV.pdf" className="btn btn-secondary">
                <Download size={15} />
                Download CV
              </a>
              <button
                onClick={() => setRecruiterOpen(true)}
                className="text-[13px] link-hover cursor-pointer bg-transparent border-none px-1"
              >
                For recruiters →
              </button>
            </div>

            {/* Socials */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-12 lg:mb-0">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-mono link-hover"
                >
                  {s.label}
                </a>
              ))}
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 text-[13px] font-mono link-hover cursor-pointer bg-transparent border-none p-0"
              >
                {emailCopied ? (
                  <span className="inline-flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
                    <Check size={13} /> Copied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <Copy size={13} /> Email
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="max-w-[280px] w-full mx-auto lg:mx-0"
          >
            <ProfilePhoto />
            <p className="text-center text-xs font-mono t-muted mt-3">
              rasya@workspace —cto
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto px-6 w-full pb-16">
          <div
            className="grid grid-cols-3 gap-4 pt-7 max-w-3xl"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-xl font-semibold tracking-tight t-primary">{s.value}</p>
                <p className="text-xs t-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RecruiterModal open={recruiterOpen} onClose={() => setRecruiterOpen(false)} />
    </>
  );
}
