"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { updateProfile } from "@/actions/profile";
import { Save, CheckCircle2, Upload, Trash2, FileText } from "lucide-react";
import { toast } from "../ui/Toaster";
import { useFormGuard } from "@/lib/form-guard";

interface Profile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  portfolioUrl: string;
  cvUrl: string | null;
  photoUrl: string | null;
  isAvailable: boolean;
  availabilityText: string;
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  textarea?: boolean;
}

function FormField({ label, value, onChange, textarea = false }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          className="input-base"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      ) : (
        <input
          className="input-base"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [data, setData] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState<"photo" | "cv" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useFormGuard(dirty, () => formRef.current?.requestSubmit());

  const uploadFile = async (file: File | undefined, kind: "photo" | "cv") => {
    if (!file) return;
    setUploading(kind);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      if (kind === "cv") form.append("folder", "docs");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Upload failed");
      if (kind === "photo") set("photoUrl", json.url);
      else set("cvUrl", json.url);
      toast(kind === "photo" ? "Photo uploaded" : "CV uploaded");
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const set = (key: keyof Profile, val: string | boolean) => {
    setDirty(true);
    setData((d) => ({ ...d, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await updateProfile({
          ...data,
          cvUrl: data.cvUrl || undefined,
          photoUrl: data.photoUrl || undefined,
        });
        if (res?.success) {
          setDirty(false);
          setSaved(true);
          toast("Profile saved");
          setTimeout(() => setSaved(false), 3000);
        } else {
          setError("Failed to update profile");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to update profile");
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="p-4 sm:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Profile Settings
          </h1>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isPending} title="Save (Ctrl+S)">
          {saved ? (
            <><CheckCircle2 size={14} /> Saved!</>
          ) : (
            <><Save size={14} /> {isPending ? "Saving..." : "Save Changes"}</>
          )}
        </button>
      </div>

      {error && (
        <div
          className="p-4 rounded-xl mb-6 text-sm"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
        >
          {error}
        </div>
      )}

      {/* Availability toggle */}
      <div
        className="flex items-center justify-between p-4 rounded-xl mb-6"
        style={{ background: "var(--accent-soft)", border: "1px solid var(--accent-border)" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Available for Work
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Shows/hides the green status badge on the portfolio
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={data.isAvailable}
            onChange={(e) => set("isAvailable", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
            style={{
              background: data.isAvailable ? "var(--accent)" : "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          />
        </label>
      </div>

      <div className="space-y-4">
        {/* Photo + CV uploads */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Profile Photo
            </label>
            {data.photoUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0" style={{ border: "1px solid var(--border)" }}>
                  <Image src={data.photoUrl} alt="Profile preview" fill sizes="64px" style={{ objectFit: "cover" }} unoptimized />
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                  onClick={() => set("photoUrl", "")}
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            ) : (
              <label
                className="flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer"
                style={{ border: "1px dashed var(--border-strong)", color: "var(--text-muted)" }}
              >
                <Upload size={14} />
                <span className="text-xs font-medium">
                  {uploading === "photo" ? "Uploading..." : "Upload photo..."}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading !== null}
                  onChange={(e) => uploadFile(e.target.files?.[0], "photo")}
                />
              </label>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              CV File (PDF)
            </label>
            {data.cvUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ border: "1px solid var(--border)" }}>
                <FileText size={16} className="t-muted shrink-0" />
                <span className="text-xs font-mono t-secondary truncate flex-1">CV uploaded</span>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                  onClick={() => set("cvUrl", "")}
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            ) : (
              <label
                className="flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer"
                style={{ border: "1px dashed var(--border-strong)", color: "var(--text-muted)" }}
              >
                <Upload size={14} />
                <span className="text-xs font-medium">
                  {uploading === "cv" ? "Uploading..." : "Upload CV (PDF)..."}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  disabled={uploading !== null}
                  onChange={(e) => uploadFile(e.target.files?.[0], "cv")}
                />
              </label>
            )}
          </div>
        </div>
        {uploadError && (
          <p className="text-xs" style={{ color: "#f87171" }}>{uploadError}</p>
        )}

        <FormField label="Full Name" value={data.name} onChange={(val) => set("name", val)} />
        <FormField label="Headline" value={data.headline} onChange={(val) => set("headline", val)} />
        <FormField label="Bio" value={data.bio} onChange={(val) => set("bio", val)} textarea />
        <FormField label="Availability Text" value={data.availabilityText} onChange={(val) => set("availabilityText", val)} />
        <FormField label="Location" value={data.location} onChange={(val) => set("location", val)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Email" value={data.email} onChange={(val) => set("email", val)} />
          <FormField label="Phone (WhatsApp)" value={data.phone} onChange={(val) => set("phone", val)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="GitHub URL" value={data.github} onChange={(val) => set("github", val)} />
          <FormField label="LinkedIn URL" value={data.linkedin} onChange={(val) => set("linkedin", val)} />
        </div>
        <FormField label="Portfolio URL" value={data.portfolioUrl} onChange={(val) => set("portfolioUrl", val)} />
        <FormField label="CV URL (external link — optional if uploaded above)" value={data.cvUrl ?? ""} onChange={(val) => set("cvUrl", val)} />
      </div>
    </form>
  );
}
