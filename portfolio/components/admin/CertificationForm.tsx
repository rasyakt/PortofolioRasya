"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCertification, updateCertification } from "@/actions/certifications";
import { Save, X } from "lucide-react";

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

  const set = (key: keyof Certification, val: string | number) =>
    setData((d) => ({ ...d, [key]: val }));

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
      router.push("/admin/certifications");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-2xl">
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
          <button type="submit" className="btn btn-primary" disabled={saving}>
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

        <FormField
          label="Badge Image URL (optional)"
          value={data.badgeImage ?? ""}
          onChange={(val) => set("badgeImage", val)}
          placeholder="/badges/cert.png"
        />
      </div>
    </form>
  );
}
