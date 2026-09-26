"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut, Download, FileWarning } from "lucide-react";

if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

/**
 * Full PDF preview: renders every page stacked (canvas only, no extra CSS
 * needed), with zoom controls and a download fallback on load failure.
 */
export default function CVPdfViewer({ cvUrl }: { cvUrl: string }) {
  return <ViewerInner key={cvUrl} cvUrl={cvUrl} />;
}

function ViewerInner({ cvUrl }: { cvUrl: string }) {
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);
  const [baseWidth, setBaseWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setBaseWidth(Math.max(0, el.clientWidth - 48));
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const download = () => {
    const a = document.createElement("a");
    a.href = cvUrl;
    a.download = "Rasya_Syahreza_CV.pdf";
    a.click();
  };

  if (failed) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center gap-4 p-8 text-center">
        <FileWarning size={32} className="t-muted" />
        <p className="text-sm t-secondary max-w-sm">
          Preview couldn&apos;t load this file. Download it to view instead.
        </p>
        <button onClick={download} className="btn btn-primary">
          <Download size={14} /> Download CV
        </button>
      </div>
    );
  }

  const pageWidth = Math.max(220, Math.floor(baseWidth * zoom));

  return (
    <div ref={containerRef} className="w-full px-6 py-5">
      {/* Zoom bar */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))}
          disabled={zoom <= 0.6}
          className="p-1.5 rounded-lg link-hover cursor-pointer bg-transparent border-none disabled:opacity-30"
          style={{ border: "1px solid var(--border)" }}
          aria-label="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-xs font-mono t-muted w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2, +(z + 0.2).toFixed(1)))}
          disabled={zoom >= 2}
          className="p-1.5 rounded-lg link-hover cursor-pointer bg-transparent border-none disabled:opacity-30"
          style={{ border: "1px solid var(--border)" }}
          aria-label="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        {numPages > 0 && (
          <span className="text-xs font-mono t-muted ml-2">
            {numPages} page{numPages > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <Document
        key={cvUrl}
        file={cvUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={() => setFailed(true)}
        loading={
          <p className="text-center text-sm t-muted py-16 animate-pulse">
            Loading preview…
          </p>
        }
        className="flex flex-col items-center gap-5"
      >
        {baseWidth > 0 &&
          Array.from({ length: numPages }).map((_, i) => (
            <div
              key={i}
              className="rounded-md overflow-hidden"
              style={{ border: "1px solid var(--border-strong)", boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}
            >
              <Page
                pageNumber={i + 1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading=""
              />
            </div>
          ))}
      </Document>
    </div>
  );
}
