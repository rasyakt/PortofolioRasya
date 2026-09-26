"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createCertification, updateCertification } from "@/actions/certifications";
import { Save, X, Upload, Trash2 } from "lucide-react";
import { toast } from "../ui/Toaster";
import { useFormGuard } from "@/lib/form-guard";

interface Certification {
  id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  badgeImage?: string | null;
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
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useFormGuard(dirty, () => formRef.current?.requestSubmit());

  const handleBadgeSelect = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "badges");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Upload failed");
      set("badgeImage", json.url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
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

      if (data.id) {
        await updateCertification(data.id, payload);
      } else {
        await createCertification(payload);
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
    <form ref={formRef} onSubmit={handleSubmit} className="p-8 max-w-2xl">
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

        {/* Badge upload */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Badge Image (upload — PNG/JPG/WebP/GIF, maks 5 MB)
          </label>
          {data.badgeImage ? (
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ border: "1px solid var(--border)" }}>
                <Image
                  src={data.badgeImage}
                  alt="Badge preview"
                  fill
                  sizes="80px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: "12px", padding: "6px 12px" }}
                onClick={() => set("badgeImage", "")}
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ) : (
            <label
              className="flex items-center justify-center gap-2 p-6 rounded-xl cursor-pointer transition-colors"
              style={{ border: "1px dashed var(--border-strong)", color: "var(--text-muted)" }}
            >
              <Upload size={15} />
              <span className="text-xs font-medium">
                {uploading ? "Uploading..." : "Pilih file badge..."}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleBadgeSelect(e.target.files?.[0])}
              />
            </label>
          )}
          {uploadError && (
            <p className="text-xs mt-2" style={{ color: "#f87171" }}>{uploadError}</p>
          )}
        </div>
      </div>
    </form>
  );
}
