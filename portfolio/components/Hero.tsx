"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Download, Sparkles, Search, ExternalLink, Copy, CheckCircle2, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import { useCommandPalette } from "./CommandPaletteProvider";
import RecruiterModal from "./RecruiterModal";

const LINES = [
  { type: "prompt", content: "whoami" },
  { type: "output", content: "rasya-syahreza — fullstack dev + ai engineer" },
  { type: "prompt", content: "cat skills.json | jq '.top[]'" },
  { type: "string", content: '"Laravel 12/13"  "Next.js 15"  "NestJS"' },
  { type: "string", content: '"Python AI"  "Flutter"  "React Native"' },
  { type: "prompt", content: "ls achievements/" },
  { type: "key", content: "3x_hki_kemenkumham/   lks_jabar_2026/   cto_bothax/" },
  { type: "prompt", content: "cat status.txt" },
  { type: "accent", content: "🟢 Open for Internship & Full-time roles" },
];

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [emailCopied, setEmailCopied] = useState(false);
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const { open: openCmdPalette } = useCommandPalette();

  useEffect(() => {
    if (visibleLines >= LINES.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), visibleLines === 0 ? 400 : 280);
    return () => clearTimeout(t);
  }, [visibleLines]);

  const copyEmail = () => {
    navigator.clipboard.writeText("rasyasyahrezamaulanazen@gmail.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <>
      <section
        id="hero"
        className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden grid-bg"
        style={{ paddingTop: "72px" }}
      >
        {/* Ambient atmospheric glows */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 30%, rgba(16,185,129,0.18) 0%, rgba(56,189,248,0.06) 40%, transparent 75%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-1/4 -right-16 w-[450px] h-[450px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 w-full py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column — 7 cols */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Status + Meta Badges Row */}
                <div className="flex flex-wrap items-center gap-2.5 mb-6">
                  <div className="status-available">
                    <span className="status-dot" />
                    Open for Internship / Full-time
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-zinc-900/90 border border-zinc-800 text-zinc-400">
                    <MapPin size={11} className="text-emerald-400" />
                    Ciamis, West Java
                  </span>

                  <button
                    onClick={openCmdPalette}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all cursor-pointer"
                  >
                    <Search size={11} className="text-emerald-400" />
                    <span className="text-zinc-500">⌘K</span>
                  </button>
                </div>

                {/* Headline — Balanced 2 lines */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.12]">
                  Rasya Syahreza <br />
                  <span className="text-gradient">
                    Maulana Zen
                  </span>
                </h1>

                {/* Roles & Title Tagline */}
                <div className="flex flex-wrap items-center gap-2 text-base font-medium text-zinc-300 mb-3">
                  <span>Fullstack Developer</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-emerald-400 font-semibold">AI Engineer</span>
                  <span className="text-zinc-600">·</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                    CTO @ BotHax
                  </span>
                </div>

                {/* Bio text */}
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8 max-w-xl">
                  Building enterprise-scale web systems, AI agentic workflows, and cross-platform mobile apps.
                  <span className="text-zinc-200 font-medium"> 3× HKI Kemenkumham RI IP copyright holder</span> and West Java LKS delegate. Turning complex challenges into robust, scalable software.
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <button
                    className="btn btn-primary shadow-lg shadow-emerald-500/20"
                    onClick={() => setRecruiterOpen(true)}
                  >
                    <Sparkles size={15} />
                    Recruiter Quick View
                  </button>

                  <a
                    href="#projects"
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Terminal size={15} />
                    Explore Projects
                  </a>

                  <a
                    href="/cv.pdf"
                    download="Rasya_Syahreza_CV.pdf"
                    className="btn btn-secondary border-zinc-700/60 hover:border-zinc-500 text-zinc-300 hover:text-white"
                  >
                    <Download size={15} />
                    Download CV
                  </a>
                </div>

                {/* Social links row */}
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-zinc-800/60">
                  <span className="text-xs font-mono text-zinc-500">Connect:</span>
                  {[
                    { icon: <GithubIcon size={14} />, href: "https://github.com/rasyakt", label: "GitHub" },
                    { icon: <LinkedinIcon size={14} />, href: "https://linkedin.com/in/rasya-syahreza-maulana-zen", label: "LinkedIn" },
                    { icon: <ExternalLink size={13} />, href: "https://gasela.my.id", label: "gasela.my.id" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/80 transition-all"
                    >
                      {s.icon}
                      {s.label}
                    </a>
                  ))}

                  <button
                    onClick={copyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-emerald-400 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all cursor-pointer"
                  >
                    {emailCopied ? (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Email</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column — 5 cols (Workstation Terminal) */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Glowing aura behind terminal */}
                <div
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-sky-500/20 blur-xl opacity-75"
                />

                <div
                  className="relative terminal shadow-2xl"
                  style={{
                    boxShadow: "0 25px 60px -15px rgba(0,0,0,0.85), 0 0 35px rgba(16,185,129,0.1)",
                  }}
                >
                  {/* Terminal Header */}
                  <div className="terminal-header justify-between">
                    <div className="flex items-center gap-2">
                      <div className="terminal-dot" style={{ background: "#ff5f57" }} />
                      <div className="terminal-dot" style={{ background: "#febc2e" }} />
                      <div className="terminal-dot" style={{ background: "#28c840" }} />
                      <span className="ml-2 text-xs font-mono text-zinc-400">
                        rasya@workspace:~
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>zsh (main)</span>
                    </div>
                  </div>

                  {/* Terminal Body */}
                  <div className="terminal-body space-y-1.5 p-4 sm:p-5 text-xs sm:text-[13px]">
                    {LINES.slice(0, visibleLines).map((line, i) => (
                      <motion.div
                        key={i}
                        className="terminal-line"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                      >
                        {line.type === "prompt" && (
                          <div className="flex items-center gap-2">
                            <span className="terminal-prompt font-bold">❯</span>
                            <span className="terminal-cmd font-medium">{line.content}</span>
                          </div>
                        )}
                        {line.type === "output" && (
                          <div className="terminal-output pl-4">{line.content}</div>
                        )}
                        {line.type === "string" && (
                          <div className="terminal-string pl-4">{line.content}</div>
                        )}
                        {line.type === "key" && (
                          <div className="terminal-key pl-4">{line.content}</div>
                        )}
                        {line.type === "accent" && (
                          <div className="pl-4 font-semibold text-emerald-400">
                            {line.content}
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {visibleLines < LINES.length && (
                      <div className="terminal-line flex items-center gap-2">
                        <span className="terminal-prompt font-bold">❯</span>
                        <span className="terminal-cmd animate-blink">_</span>
                      </div>
                    )}
                  </div>

                  {/* Terminal Footer Status Bar */}
                  <div className="px-4 py-2.5 bg-zinc-900/90 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1 text-emerald-400">
                      ● Active CTO
                    </span>
                    <span>3× HKI Registered</span>
                    <span>LKS Jabar &apos;26</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <p className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase">
            scroll to explore
          </p>
          <div
            className="w-px h-6"
            style={{
              background: "linear-gradient(to bottom, var(--accent), transparent)",
            }}
          />
        </motion.div>
      </section>

      <RecruiterModal open={recruiterOpen} onClose={() => setRecruiterOpen(false)} />
    </>
  );
}

