"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/actions/projects";
import { Save, X } from "lucide-react";

interface Project {
  id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  longDesc?: string | null;
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  impact?: string | null;
  techStack: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  coverImage?: string | null;
  hkiNumber?: string | null;
  featured: boolean;
  order: number;
}

const EMPTY: Project = {
  title: "", slug: "", category: "fullstack", description: "",
  longDesc: "", problem: "", solution: "", architecture: "", impact: "",
  techStack: "[]", liveUrl: "", githubUrl: "", coverImage: "", hkiNumber: "",
  featured: false, order: 0,
};

function safeParseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  textarea?: boolean;
  placeholder?: string;
  required?: boolean;
}

function FormField({
  label,
  value,
  onChange,
  textarea = false,
  placeholder = "",
  required = false,
}: FormFieldProps) {
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
          placeholder={placeholder}
          required={required}
          rows={3}
        />
      ) : (
        <input
          className="input-base"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [data, setData] = useState<Project>(project ?? EMPTY);
  const [techInput, setTechInput] = useState(
    safeParseJsonArray(project?.techStack).join(", ")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof Project, val: string | boolean | number) =>
    setData((d) => ({ ...d, [key]: val }));

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...data,
        techStack: JSON.stringify(
          techInput.split(",").map((s: string) => s.trim()).filter(Boolean)
        ),
        liveUrl: data.liveUrl || undefined,
        githubUrl: data.githubUrl || undefined,
        hkiNumber: data.hkiNumber || undefined,
      } as Parameters<typeof createProject>[0];

      if (data.id) {
        await updateProject(data.id, payload);
      } else {
        await createProject(payload);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {data.id ? "Edit Project" : "New Project"}
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
            <Save size={14} /> {saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="p-4 rounded-xl mb-6 text-sm"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
        >
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title + Slug */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Title *
            </label>
            <input
              className="input-base"
              required
              value={data.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!data.id) set("slug", autoSlug(e.target.value));
              }}
              placeholder="ARTIKA POS"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Slug *
            </label>
            <input
              className="input-base font-mono"
              required
              value={data.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="artika-pos"
            />
          </div>
        </div>

        {/* Category + Order */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Category *
            </label>
            <select
              className="input-base"
              value={data.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="enterprise">Enterprise</option>
              <option value="fullstack">Fullstack</option>
              <option value="mobile">Mobile</option>
              <option value="ai">AI / Agents</option>
              <option value="systems">Systems</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Order
            </label>
            <input
              type="number"
              className="input-base"
              value={data.order}
              onChange={(e) => set("order", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="accent-emerald-500 w-4 h-4"
              />
              <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Featured project
              </span>
            </label>
          </div>
        </div>

        <FormField
          label="Short Description *"
          value={data.description}
          onChange={(val) => set("description", val)}
          textarea
          required
          placeholder="Retail POS ecosystem with barcode scanning..."
        />
        <FormField
          label="Long Description"
          value={data.longDesc ?? ""}
          onChange={(val) => set("longDesc", val)}
          textarea
          placeholder="Detailed overview..."
        />

        {/* Tech stack */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Tech Stack (comma-separated)
          </label>
          <input
            className="input-base font-mono"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Laravel 12, MySQL, Tailwind CSS, PHP"
          />
        </div>

        {/* Case study */}
        <div
          className="p-4 rounded-xl space-y-4"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
            Case Study
          </p>
          <FormField
            label="Problem"
            value={data.problem ?? ""}
            onChange={(val) => set("problem", val)}
            textarea
            placeholder="What problem did this solve?"
          />
          <FormField
            label="Solution"
            value={data.solution ?? ""}
            onChange={(val) => set("solution", val)}
            textarea
            placeholder="How did you solve it?"
          />
          <FormField
            label="Architecture"
            value={data.architecture ?? ""}
            onChange={(val) => set("architecture", val)}
            textarea
            placeholder="Tech stack & system design..."
          />
          <FormField
            label="Impact / Results"
            value={data.impact ?? ""}
            onChange={(val) => set("impact", val)}
            textarea
            placeholder="Measurable outcomes..."
          />
        </div>

        {/* Links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="Live URL"
            value={data.liveUrl ?? ""}
            onChange={(val) => set("liveUrl", val)}
            placeholder="https://example.com"
          />
          <FormField
            label="GitHub URL"
            value={data.githubUrl ?? ""}
            onChange={(val) => set("githubUrl", val)}
            placeholder="https://github.com/..."
          />
        </div>

        {/* HKI */}
        <FormField
          label="HKI Registration Number (Kemenkumham)"
          value={data.hkiNumber ?? ""}
          onChange={(val) => set("hkiNumber", val)}
          placeholder="001416260"
        />
      </div>
    </form>
  );
}
