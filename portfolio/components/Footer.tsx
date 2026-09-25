"use client";

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

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
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Fullstack developer & AI engineer.
              Building systems that run in production.
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
              <a href="mailto:rasyasyahrezamaulanazen@gmail.com" className="link-hover block">
                Email
              </a>
              <a href="https://wa.me/6283840559238" target="_blank" rel="noopener noreferrer" className="link-hover block">
                WhatsApp
              </a>
              <a href="https://github.com/rasyakt" target="_blank" rel="noopener noreferrer" className="link-hover block">
                GitHub
              </a>
              <a href="https://linkedin.com/in/rasya-syahreza-maulana-zen" target="_blank" rel="noopener noreferrer" className="link-hover block">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Rasya Syahreza Maulana Zen
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            Next.js · Tailwind · Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
