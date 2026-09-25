"use client";

import { ExternalLink, Mail, Phone, MapPin, Terminal, Heart, Search } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import { useCommandPalette } from "./CommandPaletteProvider";

export default function Footer() {
  const { open } = useCommandPalette();

  return (
    <footer
      className="border-t py-16"
      style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: "var(--accent-muted)", border: "1px solid var(--accent-border)" }}
              >
                <Terminal size={14} style={{ color: "var(--accent)" }} />
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Rasya Syahreza
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
              Fullstack Mobile & Web Developer, AI Engineer, CTO at BotHax.
              Building real systems for real impact.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <GithubIcon size={15} />, href: "https://github.com/rasyakt" },
                { icon: <LinkedinIcon size={15} />, href: "https://linkedin.com/in/rasya-syahreza-maulana-zen" },
                { icon: <ExternalLink size={15} />, href: "https://gasela.my.id" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all"
                  style={{ color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                    e.currentTarget.style.borderColor = "var(--accent-border)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="section-label mb-4 text-xs">Quick Links</p>
            <div className="space-y-2.5">
              {[
                ["Hero", "#hero"],
                ["Projects", "#projects"],
                ["Certifications", "#certifications"],
                ["Experience", "#experience"],
                ["Admin CMS", "/admin"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="link-hover block text-xs"
                  style={{ color: "var(--text-muted)" }}
                  onClick={
                    href.startsWith("#")
                      ? (e) => {
                          e.preventDefault();
                          document
                            .querySelector(href)
                            ?.scrollIntoView({ behavior: "smooth" });
                        }
                      : undefined
                  }
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label mb-4 text-xs">Contact</p>
            <div className="space-y-3">
              {[
                { icon: <Mail size={13} />, label: "rasyasyahrezamaulanazen@gmail.com", href: "mailto:rasyasyahrezamaulanazen@gmail.com" },
                { icon: <Phone size={13} />, label: "+62 838 4055 9238", href: "https://wa.me/6283840559238" },
                { icon: <MapPin size={13} />, label: "Ciamis, West Java, Indonesia", href: null },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <span style={{ color: "var(--text-muted)" }}>{c.icon}</span>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs link-hover"
                    >
                      {c.label}
                    </a>
                  ) : (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{c.label}</span>
                  )}
                </div>
              ))}

              {/* Command palette hint */}
              <button
                onClick={open}
                className="flex items-center gap-2 mt-4 text-xs transition-colors"
                style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <Search size={12} />
                Press Ctrl+K to search
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Rasya Syahreza Maulana Zen — All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1.5 font-mono" style={{ color: "var(--text-muted)" }}>
            Built with <Heart size={11} style={{ color: "var(--accent)" }} /> using Next.js 15 + Tailwind v4
          </p>
        </div>
      </div>
    </footer>
  );
}
