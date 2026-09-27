"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Star, ExternalLink, FileText, Expand } from "lucide-react";
import { isPdfUrl } from "@/lib/media";
import CertLightbox from "./CertLightbox";

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

function PdfChips({ pdfs }: { pdfs: string[] }) {
  if (pdfs.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
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
  const [lightbox, setLightbox] = useState<{ pics: string[]; title: string; index: number } | null>(null);

  const openPreview = (pics: string[], title: string) => {
    if (pics.length === 0) return;
    setLightbox({ pics, title, index: 0 });
  };

  const hkiCerts = certs.filter((c) => c.type === "hki");
  const other = certs.filter((c) => c.type !== "hki");

  const renderThumb = (pics: string[], title: string, icon: React.ReactNode) => {
    if (pics.length === 0) {
      return (
        <span className="t-muted shrink-0 mt-0.5" aria-hidden="true">
          {icon}
        </span>
      );
    }
    return (
      <button
        onClick={() => openPreview(pics, title)}
        className="relative shrink-0 rounded-xl overflow-hidden cursor-zoom-in group/thumb w-24 h-24 sm:w-28 sm:h-28"
        style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
        title="Preview"
        aria-label={`Preview ${title}`}
      >
        <Image
          src={pics[0]}
          alt={title}
          fill
          sizes="112px"
          style={{ objectFit: "cover" }}
          unoptimized
        />
        <span
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
          style={{ background: "rgba(0,0,0,0.45)", color: "#fff" }}
          aria-hidden="true"
        >
          <Expand size={16} />
        </span>
        {pics.length > 1 && (
          <span className="absolute bottom-1 right-1 badge" style={{ fontSize: "9px", background: "rgba(0,0,0,0.65)" }}>
            +{pics.length - 1}
          </span>
        )}
      </button>
    );
  };

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
          <div className="grid sm:grid-cols-2 gap-3">
            {hkiCerts.map((cert, i) => {
              const { pics, pdfs } = splitMedia(cert);
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="card card-hover spotlight p-4 flex gap-4"
                >
                  {renderThumb(pics, cert.title, <Shield size={16} style={{ color: "var(--amber)" }} />)}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1 t-primary leading-snug">
                      {cert.title}
                    </p>
                    <p className="text-xs t-muted mb-2.5 leading-relaxed">
                      {cert.issuer}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {cert.regNumber && (
                        <span className="badge badge-hki" style={{ fontSize: "10px" }}>
                          {cert.regNumber}
                        </span>
                      )}
                      <span className="text-xs font-mono t-muted">
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
          <div className="grid sm:grid-cols-2 gap-3">
            {other.map((cert, i) => {
              const { pics, pdfs } = splitMedia(cert);
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
                  className="card card-hover spotlight p-4 flex gap-4"
                >
                  {renderThumb(pics, cert.title, TYPE_ICON[cert.type] || TYPE_ICON.cert)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold t-primary leading-snug mb-1">
                        {cert.title}
                      </p>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-hover shrink-0 mt-0.5"
                          title="Verify credential"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                    <p className="text-xs t-muted mb-2">
                      {cert.issuer}
                    </p>
                    <p className="text-xs font-mono t-muted">
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

      {/* Lightbox */}
      {lightbox && (
        <CertLightbox
          images={lightbox.pics}
          title={lightbox.title}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox((s) => (s ? { ...s, index } : s))}
        />
      )}
    </section>
  );
}
