"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/actions/projects";
import {
  addProjectImages,
  deleteProjectImage,
  moveProjectImage,
  importLegacyCover,
} from "@/actions/projects";
import { Save, X, Upload, Trash2, ChevronUp, ChevronDown, ArrowRightToLine } from "lucide-react";
import { toast } from "../ui/Toaster";
import { useFormGuard } from "@/lib/form-guard";
import SafeImage from "../SafeImage";

interface ProjectImage {
  id: string;
  url: string;
  order: number;
}

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
  images?: ProjectImage[];
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
        form.append("folder", "covers");
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
      await moveProjectImage(id, direction);
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
      await deleteProjectImage(id);
      setData((d) => ({ ...d, images: (d.images ?? []).filter((x) => x.id !== id) }));
      toast("Image deleted");
    } catch {
      setUploadError("Failed to delete image");
    }
  };

  const importLegacy = async () => {
    if (!data.id || !data.coverImage) return;
    try {
      await importLegacyCover(data.id);
      const url = data.coverImage;
      setData((d) => ({
        ...d,
        coverImage: null,
        images: [{ id: `legacy-${Date.now()}`, url, order: -1 }, ...(d.images ?? [])],
      }));
      toast("Old cover moved to gallery as main image");
      router.refresh();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to import cover");
    }
  };

  const set = (key: keyof Project, val: string | boolean | number) => {
    setDirty(true);
    setData((d) => ({ ...d, [key]: val }));
  };

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
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        coverImage: data.coverImage || null,
        hkiNumber: data.hkiNumber || null,
      } as Parameters<typeof createProject>[0];

      let id = data.id;
      if (id) {
        await updateProject(id, payload);
      } else {
        const created = await createProject(payload);
        id = created.project.id;
      }
      if (pending.length > 0 && id) {
        await addProjectImages(id, pending);
      }
      setDirty(false);
      toast("Project saved");
      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="p-4 sm:p-8 max-w-3xl">
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
          <button type="submit" className="btn btn-primary" disabled={saving} title="Save (Ctrl+S)">
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

        {/* Category + Featured */}
        <div className="grid sm:grid-cols-2 gap-4">
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
            onChange={(e) => { setDirty(true); setTechInput(e.target.value); }}
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

        {/* Gallery — multiple covers, first = main */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Gallery (gambar pertama = utama, ideal 1200×675)
          </label>

          {(existingImages.length > 0 || pending.length > 0 || data.coverImage) && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {existingImages.map((img, i) => (
                <div key={img.id} className="relative rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", aspectRatio: "4 / 3", background: "var(--bg-elevated)" }}>
                  <SafeImage key={img.url} src={img.url} alt="" sizes="192px" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 badge badge-accent" style={{ fontSize: "9px" }}>Utama</span>
                  )}
                  <div className="absolute bottom-1 right-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveExisting(img.id, "up")}
                      disabled={i === 0}
                      className="p-1 rounded overlay-btn"
                      style={{ opacity: i === 0 ? 0.3 : 1 }}
                      title="Move left"
                      aria-label="Move left"
                    >
                      <ChevronUp size={11} style={{ transform: "rotate(-90deg)" }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveExisting(img.id, "down")}
                      disabled={i === existingImages.length - 1}
                      className="p-1 rounded overlay-btn"
                      style={{ opacity: i === existingImages.length - 1 ? 0.3 : 1 }}
                      title="Move right"
                      aria-label="Move right"
                    >
                      <ChevronDown size={11} style={{ transform: "rotate(-90deg)" }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExisting(img.id)}
                      className="p-1 rounded overlay-btn"
                      title="Delete"
                      aria-label="Delete image"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Legacy single cover */}
              {data.coverImage && (
                <div className="relative rounded-lg overflow-hidden" style={{ border: "1px dashed var(--border-strong)", aspectRatio: "4 / 3", background: "var(--bg-elevated)" }}>
                  <SafeImage key={data.coverImage} src={data.coverImage} alt="" sizes="192px" />
                  <span className="absolute top-1 left-1 badge" style={{ fontSize: "9px" }}>Lama</span>
                  <div className="absolute bottom-1 right-1 flex gap-1">
                    <button
                      type="button"
                      onClick={importLegacy}
                      className="p-1 rounded overlay-btn"
                      title="Move to gallery as main image"
                      aria-label="Move old cover to gallery as main image"
                    >
                      <ArrowRightToLine size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => set("coverImage", "")}
                      className="p-1 rounded overlay-btn"
                      title="Remove legacy cover (save to apply)"
                      aria-label="Remove legacy cover"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              )}

              {pending.map((url) => (
                <div key={url} className="relative rounded-lg overflow-hidden" style={{ border: "1px dashed var(--accent-border)", aspectRatio: "4 / 3", background: "var(--bg-elevated)" }}>
                  <SafeImage key={url} src={url} alt="" sizes="192px" />
                  <span className="absolute top-1 left-1 badge badge-accent" style={{ fontSize: "9px" }}>Baru</span>
                  <button
                    type="button"
                    onClick={() => setPending((p) => p.filter((x) => x !== url))}
                    className="absolute bottom-1 right-1 p-1 rounded overlay-btn"
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
              {uploading ? "Uploading..." : "Tambah gambar (bisa banyak sekaligus)..."}
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
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
