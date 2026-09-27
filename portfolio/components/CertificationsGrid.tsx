"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Star, ExternalLink, FileText } from "lucide-react";
import { isPdfUrl } from "@/lib/media";

export interface CertImage {
  id: string;
  url: string;
  order: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  badgeImage?: string | null;
  images?: CertImage[];
  type: string;
  regNumber?: string | null;
  order: number;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  hki: <Shield size={16} />,
  cert: <Star size={16} />,
  award: <Award size={16} />,
};

/** Split gallery into displayable pictures + PDF documents. */
function splitMedia(cert: Certification): { pics: string[]; pdfs: string[] } {
  const urls = (cert.images ?? []).map((i) => i.url);
  if (urls.length === 0 && cert.badgeImage) urls.push(cert.badgeImage);
  return {
    pics: urls.filter((u) => !isPdfUrl(u)),
    pdfs: urls.filter((u) => isPdfUrl(u)),
  };
}

/** Large banner cycling through pictures. Click to advance when several. */
function CertBanner({ pics, title }: { pics: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  if (pics.length === 0) return null;
  const current = pics[idx % pics.length];
  const multi = pics.length > 1;

  return (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: "16 / 10", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}
      onClick={multi ? () => setIdx((i) => (i + 1) % pics.length) : undefined}
      title={multi ? "Click for next image" : undefined}
      role={multi ? "button" : undefined}
      tabIndex={multi ? 0 : undefined}
      onKeyDown={multi ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIdx((i) => (i + 1) % pics.length); } } : undefined}
      aria-label={multi ? `Certificate images, ${idx + 1} of ${pics.length}` : undefined}
    >
      <div className={multi ? "cursor-pointer w-full h-full" : "w-full h-full"}>
        <Image
          key={current}
          src={current}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>
      {multi && (
        <span className="absolute bottom-2 right-2 badge" style={{ fontSize: "10px", background: "rgba(0,0,0,0.6)" }}>
          {idx + 1}/{pics.length}
        </span>
      )}
    </div>
  );
}

function PdfChips({ pdfs }: { pdfs: string[] }) {
  if (pdfs.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {pdfs.map((u, i) => (
        <a
          key={u}
          href={u}
          target="_blank"
          rel="noopener noreferrer"
          className="badge link-hover"
          style={{ textDecoration: "none" }}
        >
          <FileText size={11} /> PDF{i > 0 ? ` ${i + 1}` : ""}
        </a>
      ))}
    </div>
  );
}

export default function CertificationsGrid({ certs }: { certs: Certification[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const hkiCerts = certs.filter((c) => c.type === "hki");
  const other = certs.filter((c) => c.type !== "hki");

  return (
    <section id="certifications" ref={ref} className="py-14 sm:py-20 max-w-5xl mx-auto px-6 scroll-mt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.45 }}
        className="mb-10"
      >
        <p className="section-label mb-2">Recognition</p>
        <h2 className="section-title">Certifications & IP rights</h2>
        <p className="section-desc">Registered intellectual property and professional certifications.</p>
      </motion.div>

      {/* HKI Section */}
      {hkiCerts.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-mono mb-4" style={{ color: "var(--text-muted)" }}>
            Kemenkumham RI — Registered Hak Cipta
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {hkiCerts.map((cert, i) => {
              const { pics, pdfs } = splitMedia(cert);
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="card card-hover spotlight overflow-hidden"
                >
                  {pics.length > 0 ? (
                    <CertBanner pics={pics} title={cert.title} />
                  ) : (
                    <div className="px-5 pt-5">
                      <Shield size={16} style={{ color: "var(--amber)" }} />
                    </div>
                  )}
                  <div className="p-5 pt-4">
                    <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                      {cert.title}
                    </p>
                    <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                      {cert.issuer}
                    </p>
                    <div className="flex items-center justify-between">
                      {cert.regNumber && (
                        <span className="badge badge-hki" style={{ fontSize: "10px" }}>
                          {cert.regNumber}
                        </span>
                      )}
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        {cert.issueDate}
                      </span>
                    </div>
                    <PdfChips pdfs={pdfs} />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-xs leading-relaxed mt-4 max-w-2xl" style={{ color: "var(--text-muted)" }}>
            All copyrights are registered with DJKI Kemenkumham RI and verifiable
            through the public e-service portal.
          </p>
        </div>
      )}

      {/* Other certs grid */}
      {other.length > 0 && (
        <>
          <p className="text-xs font-mono mb-4" style={{ color: "var(--text-muted)" }}>
            Professional certifications & awards
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {other.map((cert, i) => {
              const { pics, pdfs } = splitMedia(cert);
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
                  className="card card-hover spotlight overflow-hidden"
                >
                  {pics.length > 0 ? (
                    <CertBanner pics={pics} title={cert.title} />
                  ) : null}
                  <div className="p-4">
                    {(pics.length === 0 || cert.credentialUrl) && (
                      <div className="flex items-start justify-between gap-2 mb-3">
                        {pics.length === 0 ? (
                          <span style={{ color: "var(--text-muted)" }}>
                            {TYPE_ICON[cert.type] || TYPE_ICON.cert}
                          </span>
                        ) : (
                          <span />
                        )}
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-hover"
                            title="Verify credential"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    )}
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)", lineHeight: 1.35 }}>
                      {cert.title}
                    </p>
                    <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                      {cert.issuer}
                    </p>
                    <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                      {cert.issueDate}
                    </p>
                    <PdfChips pdfs={pdfs} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
