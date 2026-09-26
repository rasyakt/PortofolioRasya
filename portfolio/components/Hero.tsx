"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Download, ArrowRight, Copy, Check } from "lucide-react";
import type { ProfileConfig, Certification } from "@prisma/client";
import RecruiterModal from "./RecruiterModal";
import ProfileIDCard from "./ProfileIDCard";
import { track } from "@/lib/analytics";
import { copyText } from "@/lib/clipboard";
import { toast } from "./ui/Toaster";
import { useMagnetic } from "@/lib/interactions";

interface HeroProps {
  profile: ProfileConfig | null;
  projectCount: number;
  hkiCount: number;
  certCount: number;
  hkiCerts: Certification[];
  tech: string[];
}

const FALLBACK = {
  name: "Rasya Syahreza Maulana Zen",
  headline: "Fullstack Developer | AI Engineer | CTO at BotHax",
  bio: "I build enterprise web systems, AI workflows, and mobile apps that run in production.",
  location: "Ciamis, West Java",
  email: "rasyasyahrezamaulanazen@gmail.com",
  github: "https://github.com/rasyakt",
  linkedin: "https://linkedin.com/in/rasya-syahreza-maulana-zen",
  portfolioUrl: "https://gasela.my.id",
  availabilityText: "Open for Internship / Full-time",
};

/** Animated number for stat values with a numeric prefix (e.g. "12+"). */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [progress, setProgress] = useState(0);

  const match = value.match(/^(\d+)(.*)$/);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = inView && !!match && !reduced;

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  if (!animate || !match) return <span ref={ref}>{value}</span>;
  const target = parseInt(match[1], 10);
  const eased = 1 - Math.pow(1 - progress, 3);
  return <span ref={ref}>{`${Math.round(target * eased)}${match[2]}`}</span>;
}

export default function Hero({
  profile,
  projectCount,
  hkiCount,
  certCount,
  hkiCerts,
  tech,
}: HeroProps) {
  const [emailCopied, setEmailCopied] = useState(false);
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const primaryBtnRef = useMagnetic<HTMLAnchorElement>(12);
  const secondaryBtnRef = useMagnetic<HTMLAnchorElement>(10);

  const name = profile?.name || FALLBACK.name;
  const words = name.split(" ").filter(Boolean);
  const mid = Math.max(1, Math.ceil(words.length / 2));
  const nameLines = words.length > 1
    ? [words.slice(0, mid).join(" "), words.slice(mid).join(" ")]
    : [name, ""];

  const headline = profile?.headline || FALLBACK.headline;
  const roles = headline.split("|").map((s) => s.trim()).filter(Boolean);
  const bio = profile?.bio || FALLBACK.bio;
  const location = profile?.location || FALLBACK.location;
  const email = profile?.email || FALLBACK.email;
  const cvUrl = profile?.cvUrl || "/cv.pdf";
  const available = profile ? profile.isAvailable : true;
  const availabilityText = profile?.availabilityText || FALLBACK.availabilityText;

  const socials = [
    { label: "GitHub", href: profile?.github || FALLBACK.github },
    { label: "LinkedIn", href: profile?.linkedin || FALLBACK.linkedin },
    { label: "Website", href: profile?.portfolioUrl || FALLBACK.portfolioUrl },
  ];

  const stats = [
    { value: `${projectCount}+`, label: "Production projects" },
    { value: `${hkiCount}×`, label: "Registered IP copyrights" },
    { value: `${certCount}`, label: "Certifications & awards" },
  ];

  const copyEmail = async () => {
    const ok = await copyText(email);
    if (!ok) {
      toast(`Copy failed — email: ${email}`, "error");
      return;
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <>
      <section
        id="hero"
        className="relative flex flex-col justify-center hero-wash overflow-hidden"
        style={{ minHeight: "88vh", paddingTop: "64px" }}
      >
        {/* Aurora blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full animate-drift"
            style={{ background: "radial-gradient(circle, var(--accent-soft) 0%, transparent 65%)", filter: "blur(50px)" }}
          />
          <div
            className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full animate-drift-alt"
            style={{ background: "radial-gradient(circle, var(--accent-soft) 0%, transparent 65%)", filter: "blur(60px)" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 w-full py-16 grid lg:grid-cols-[1fr_280px] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Status */}
            <div className="flex flex-wrap items-center gap-3 mb-7">
              {available ? (
                <span className="status-available">
                  <span className="status-dot" />
                  {availabilityText}
                </span>
              ) : (
                <span className="badge">{availabilityText}</span>
              )}
              <span className="text-xs font-mono t-muted">
                {location}
              </span>
            </div>

            {/* Name + role */}
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight t-primary leading-[1.1] mb-4">
              {nameLines[0]}
              {nameLines[1] ? <><br />{nameLines[1]}</> : null}
            </h1>
            <p className="text-[15px] t-secondary mb-5">
              {roles.map((r, i) => (
                <span key={i}>
                  {i > 0 && " · "}
                  {i === roles.length - 1
                    ? <span style={{ color: "var(--accent)" }}>{r}</span>
                    : r}
                </span>
              ))}
            </p>

            {/* Bio */}
            <p className="text-[15px] leading-relaxed max-w-xl t-secondary mb-9">
              {bio}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <a
                href="#projects"
                ref={primaryBtnRef}
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View Projects
                <ArrowRight size={15} />
              </a>
              <a
                ref={secondaryBtnRef}
                href={cvUrl}
                download="Rasya_Syahreza_CV.pdf"
                className="btn btn-secondary"
                onClick={() => track("cv_download")}
              >
                <Download size={15} />
                Download CV
              </a>
              <button
                onClick={() => { track("recruiter_open"); setRecruiterOpen(true); }}
                className="text-[13px] link-hover cursor-pointer bg-transparent border-none px-1"
              >
                For recruiters →
              </button>
            </div>

            {/* Socials */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-12 lg:mb-0">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("contact_click")}
                  className="text-[13px] font-mono link-hover"
                >
                  {s.label}
                </a>
              ))}
              <button
                onClick={() => { track("contact_click"); copyEmail(); }}
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
            className="relative max-w-[280px] w-full mx-auto lg:mx-0"
          >
            <div aria-hidden="true" className="absolute -inset-3 rounded-[28px] portrait-halo animate-spin-slow" />
            <div className="relative">
              <ProfileIDCard
                name={name}
                headline={roles.join(" · ")}
                location={location}
                email={email}
                photoUrl={profile?.photoUrl}
              />
            </div>
            <p className="text-center text-xs font-mono t-muted mt-3">
              rasya@workspace:~
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto px-6 w-full pb-16">
          <div
            className="grid grid-cols-3 gap-4 pt-7 max-w-3xl"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-xl font-semibold tracking-tight t-primary"><CountUp value={s.value} /></p>
                <p className="text-xs t-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Tech marquee */}
        {tech.length > 0 && (
          <div
            className="mt-2 border-y marquee-mask marquee-hover overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex w-max animate-marquee">
              {[0, 1].map((half) => (
                <div key={half} className="flex shrink-0" aria-hidden={half === 1}>
                  {tech.map((t) => (
                    <span key={`${half}-${t}`} className="flex items-center whitespace-nowrap">
                      <span className="px-6 py-3.5 text-xs font-mono t-muted uppercase tracking-widest">
                        {t}
                      </span>
                      <span style={{ color: "var(--accent)", fontSize: "8px" }}>●</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <RecruiterModal
        open={recruiterOpen}
        onClose={() => setRecruiterOpen(false)}
        profile={profile}
        hkiCerts={hkiCerts}
        tech={tech}
        projectCount={projectCount}
      />
    </>
  );
}
