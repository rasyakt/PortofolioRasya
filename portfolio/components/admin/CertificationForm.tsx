"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createCertification, updateCertification } from "@/actions/certifications";
import { Save, X, Upload, Trash2, ChevronUp, ChevronDown, FileText } from "lucide-react";
import { toast } from "../ui/Toaster";
import { useFormGuard } from "@/lib/form-guard";
import { isPdfUrl } from "@/lib/media";
import {
  addCertificationImages,
  deleteCertificationImage,
  moveCertificationImage,
} from "@/actions/certifications";

interface CertImage {
  id: string;
  url: string;
  order: number;
}

interface Certification {
  id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  badgeImage?: string | null;
  images?: CertImage[];
  type: "cert" | "hki" | "award" | string;
  regNumber?: string | null;
  order: number;
}

const EMPTY: Certification = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialUrl: "",
  badgeImage: "",
  type: "cert",
  regNumber: "",
  order: 0,
};

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

function FormField({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <input
        className="input-base"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default function CertificationForm({ cert }: { cert?: Certification }) {
  const router = useRouter();
  const [data, setData] = useState<Certification>(cert ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pending, setPending] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useFormGuard(dirty, () => formRef.current?.requestSubmit());

  const existingImages = [...(data.images ?? [])].sort((a, b) => a.order - b.order);

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", file.type === "application/pdf" ? "docs" : "badges");
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error ?? `Upload failed: ${file.name}`);
        urls.push(json.url);
      }
      setPending((p) => [...p, ...urls]);
      setDirty(true);
      toast(urls.length > 1 ? `${urls.length} files uploaded` : "File uploaded");
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const moveExisting = async (id: string, direction: "up" | "down") => {
    try {
      await moveCertificationImage(id, direction);
      setData((d) => {
        const imgs = [...(d.images ?? [])].sort((a, b) => a.order - b.order);
        const idx = imgs.findIndex((x) => x.id === id);
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (idx < 0 || swapIdx < 0 || swapIdx >= imgs.length) return d;
        const next = [...imgs];
        const [a, b] = [next[idx], next[swapIdx]];
        next[idx] = { ...a, order: b.order };
        next[swapIdx] = { ...b, order: a.order };
        next.sort((x, y) => x.order - y.order);
        return { ...d, images: next };
      });
    } catch {
      setUploadError("Failed to reorder");
    }
  };

  const deleteExisting = async (id: string) => {
    try {
      await deleteCertificationImage(id);
      setData((d) => ({ ...d, images: (d.images ?? []).filter((x) => x.id !== id) }));
      toast("Image deleted");
    } catch {
      setUploadError("Failed to delete image");
    }
  };

  const set = (key: keyof Certification, val: string | number) => {
    setDirty(true);
    setData((d) => ({ ...d, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: data.title,
        issuer: data.issuer,
        issueDate: data.issueDate,
        type: data.type as "cert" | "hki" | "award",
        credentialUrl: data.credentialUrl || undefined,
        badgeImage: data.badgeImage || undefined,
        regNumber: data.regNumber || undefined,
        order: Number(data.order) || 0,
      };

      let id = data.id;
      if (id) {
        await updateCertification(id, payload);
      } else {
        const created = await createCertification(payload);
        id = created.cert.id;
      }
      if (pending.length > 0 && id) {
        await addCertificationImages(id, pending);
      }
      setDirty(false);
      toast("Record saved");
      router.push("/admin/certifications");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="p-4 sm:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {data.id ? "Edit Record" : "New Certification / HKI"}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.back()}
          >
            <X size={14} /> Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving} title="Save (Ctrl+S)">
            <Save size={14} /> {saving ? "Saving..." : "Save Record"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="p-4 rounded-xl mb-6 text-sm"
          style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
            color: "#f87171",
          }}
        >
          {error}
        </div>
      )}

      <div className="space-y-5">
        <FormField
          label="Title *"
          value={data.title}
          onChange={(val) => set("title", val)}
          placeholder="ARTIKA-POS — Hak Cipta Kemenkumham RI"
          required
        />

        <FormField
          label="Issuer / Organization *"
          value={data.issuer}
          onChange={(val) => set("issuer", val)}
          placeholder="Direktorat Jenderal Kekayaan Intelektual (DJKI) — Kemenkumham RI"
          required
        />

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Record Type *
            </label>
            <select
              className="input-base"
              value={data.type}
              onChange={(e) => set("type", e.target.value)}
            >
              <option value="cert">Certificate</option>
              <option value="hki">Hak Cipta (HKI)</option>
              <option value="award">Award / Achievement</option>
            </select>
          </div>

          <div>
            <FormField
              label="Issue Date *"
              value={data.issueDate}
              onChange={(val) => set("issueDate", val)}
              placeholder="Agustus 2026 / 2025"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Display Order
            </label>
            <input
              type="number"
              className="input-base"
              value={data.order}
              onChange={(e) => set("order", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <FormField
          label="Registration Number (optional, for HKI / Cert No)"
          value={data.regNumber ?? ""}
          onChange={(val) => set("regNumber", val)}
          placeholder="001416260"
        />

        <FormField
          label="Credential URL (optional link to verify certificate)"
          value={data.credentialUrl ?? ""}
          onChange={(val) => set("credentialUrl", val)}
          placeholder="https://example.com/certificate/..."
        />

        {/* Gallery — multiple images + PDFs */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Gallery (gambar & PDF — gambar pertama = utama)
          </label>

          {(existingImages.length > 0 || pending.length > 0 || (data.badgeImage && existingImages.length === 0)) && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {existingImages.map((img, i) => (
                <div key={img.id} className="relative rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", aspectRatio: "1 / 1", background: "var(--bg-elevated)" }}>
                  {isPdfUrl(img.url) ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 t-muted">
                      <FileText size={18} />
                      <span className="text-[9px] font-mono">PDF</span>
                    </div>
                  ) : (
                    <Image src={img.url} alt="" fill sizes="120px" style={{ objectFit: "cover" }} unoptimized />
                  )}
                  {i === 0 && (
                    <span className="absolute top-1 left-1 badge badge-accent" style={{ fontSize: "9px" }}>Utama</span>
                  )}
                  <div className="absolute bottom-1 right-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveExisting(img.id, "up")}
                      disabled={i === 0}
                      className="p-1 rounded icon-btn"
                      style={{ background: "rgba(0,0,0,0.55)", opacity: i === 0 ? 0.3 : 1 }}
                      title="Move left"
                      aria-label="Move left"
                    >
                      <ChevronUp size={11} style={{ transform: "rotate(-90deg)" }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveExisting(img.id, "down")}
                      disabled={i === existingImages.length - 1}
                      className="p-1 rounded icon-btn"
                      style={{ background: "rgba(0,0,0,0.55)", opacity: i === existingImages.length - 1 ? 0.3 : 1 }}
                      title="Move right"
                      aria-label="Move right"
                    >
                      <ChevronDown size={11} style={{ transform: "rotate(-90deg)" }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExisting(img.id)}
                      className="p-1 rounded icon-btn"
                      style={{ background: "rgba(0,0,0,0.55)" }}
                      title="Delete"
                      aria-label="Delete image"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Legacy single badge (kept for display until re-uploaded) */}
              {data.badgeImage && existingImages.length === 0 && (
                <div className="relative rounded-lg overflow-hidden" style={{ border: "1px dashed var(--border-strong)", aspectRatio: "1 / 1", background: "var(--bg-elevated)" }}>
                  <Image src={data.badgeImage} alt="" fill sizes="120px" style={{ objectFit: "cover" }} unoptimized />
                  <span className="absolute top-1 left-1 badge" style={{ fontSize: "9px" }}>Lama</span>
                  <button
                    type="button"
                    onClick={() => set("badgeImage", "")}
                    className="absolute bottom-1 right-1 p-1 rounded icon-btn"
                    style={{ background: "rgba(0,0,0,0.55)" }}
                    title="Remove legacy badge (save to apply)"
                    aria-label="Remove legacy badge"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}

              {pending.map((url) => (
                <div key={url} className="relative rounded-lg overflow-hidden" style={{ border: "1px dashed var(--accent-border)", aspectRatio: "1 / 1", background: "var(--bg-elevated)" }}>
                  {isPdfUrl(url) ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 t-muted">
                      <FileText size={18} />
                      <span className="text-[9px] font-mono">PDF</span>
                    </div>
                  ) : (
                    <Image src={url} alt="" fill sizes="120px" style={{ objectFit: "cover" }} unoptimized />
                  )}
                  <span className="absolute top-1 left-1 badge badge-accent" style={{ fontSize: "9px" }}>Baru</span>
                  <button
                    type="button"
                    onClick={() => setPending((p) => p.filter((x) => x !== url))}
                    className="absolute bottom-1 right-1 p-1 rounded icon-btn"
                    style={{ background: "rgba(0,0,0,0.55)" }}
                    title="Remove"
                    aria-label="Remove pending upload"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label
            className="flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-colors"
            style={{ border: "1px dashed var(--border-strong)", color: "var(--text-muted)" }}
          >
            <Upload size={15} />
            <span className="text-xs font-medium">
              {uploading ? "Uploading..." : "Tambah gambar / PDF (bisa banyak sekaligus)..."}
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => uploadFiles(e.target.files)}
            />
          </label>
          {uploadError && (
            <p className="text-xs mt-2" style={{ color: "#f87171" }}>{uploadError}</p>
          )}
        </div>
      </div>
    </form>
  );
}
