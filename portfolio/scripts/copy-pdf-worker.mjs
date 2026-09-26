// Ensures the PDF.js worker exists in public/ (required by the CV preview).
// Safe to run on every install: never throws, always exits 0.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

try {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const src = join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
  const dest = join(root, "public", "pdf.worker.min.mjs");
  if (existsSync(src)) {
    mkdirSync(join(root, "public"), { recursive: true });
    copyFileSync(src, dest);
    console.log("[copy-pdf-worker] worker ready");
  } else {
    console.log("[copy-pdf-worker] pdfjs-dist not installed, skipped");
  }
} catch (err) {
  console.log("[copy-pdf-worker] skipped:", err && err.message ? err.message : err);
}
