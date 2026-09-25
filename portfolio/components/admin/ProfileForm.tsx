"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/actions/profile";
import { Save, CheckCircle2 } from "lucide-react";

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
  const [isPending, startTransition] = useTransition();

  const set = (key: keyof Profile, val: string | boolean) =>
    setData((d) => ({ ...d, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await updateProfile({
          ...data,
          cvUrl: data.cvUrl || undefined,
        });
        if (res?.success) {
          setSaved(true);
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
    <form onSubmit={handleSubmit} className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Profile Settings
          </h1>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
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
        style={{ background: "var(--accent-muted)", border: "1px solid var(--accent-border)" }}
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
        <FormField label="CV PDF URL" value={data.cvUrl ?? ""} onChange={(val) => set("cvUrl", val)} />
      </div>
    </form>
  );
}
