"use client";

import type { ProfileConfig } from "@prisma/client";
import { track } from "@/lib/analytics";

function digitsOnly(phone: string) {
  return phone.replace(/\D/g, "");
}

export default function Footer({ profile }: { profile: ProfileConfig | null }) {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const email = profile?.email || "rasyasyahrezamaulanazen@gmail.com";
  const phone = profile?.phone || "+62 838 4055 9238";
  const github = profile?.github || "https://github.com/rasyakt";
  const linkedin = profile?.linkedin || "https://linkedin.com/in/rasya-syahreza-maulana-zen";
  const owner = profile?.name || "Rasya Syahreza Maulana Zen";

  const contacts = [
    { label: "Email", href: `mailto:${email}` },
    { label: "WhatsApp", href: `https://wa.me/${digitsOnly(phone)}` },
    { label: "GitHub", href: github },
    { label: "LinkedIn", href: linkedin },
  ];

  return (
    <footer
      id="contact"
      className="border-t scroll-mt-20"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="text-sm font-semibold t-primary mb-3">
              rasya<span style={{ color: "var(--accent)" }}>.</span>dev
            </p>
            <p className="text-[13px] leading-relaxed t-muted">
              {profile?.headline || "Fullstack developer & AI engineer."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="section-label mb-4">Sitemap</p>
            <div className="space-y-2.5">
              {[
                ["Projects", "#projects"],
                ["Experience", "#experience"],
                ["Certifications", "#certifications"],
              ].map(([label, href]) => (
                <button
                  key={label}
                  onClick={() => scrollTo(href)}
                  className="link-hover block text-[13px] cursor-pointer bg-transparent border-none p-0"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label mb-4">Contact</p>
            <div className="space-y-2.5 text-[13px]">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("contact_click")}
                  className="link-hover block"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs font-mono t-muted">
            © {new Date().getFullYear()} {owner}
          </p>
          <p className="text-xs font-mono t-muted">
            Next.js · Tailwind · Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
