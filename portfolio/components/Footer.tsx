"use client";

import type { ProfileConfig } from "@prisma/client";
import { Mail } from "lucide-react";
import { track } from "@/lib/analytics";
import Logo from "./Logo";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "./icons/BrandIcons";

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
    { label: "Email", href: `mailto:${email}`, icon: <Mail size={16} /> },
    { label: "WhatsApp", href: `https://wa.me/${digitsOnly(phone)}`, icon: <WhatsAppIcon size={16} /> },
    { label: "GitHub", href: github, icon: <GithubIcon size={16} /> },
    { label: "LinkedIn", href: linkedin, icon: <LinkedinIcon size={16} /> },
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
            <div className="mb-3">
              <Logo onClick={() => scrollTo("#hero")} />
            </div>
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
            <div className="flex items-center gap-2.5">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("contact_click")}
                  title={c.label}
                  aria-label={c.label}
                  className="contact-icon p-2.5 rounded-xl cursor-pointer"
                >
                  {c.icon}
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
