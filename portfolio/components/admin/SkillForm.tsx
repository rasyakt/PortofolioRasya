"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSkill, updateSkill } from "@/actions/skills";
import { Save, X } from "lucide-react";
import { toast } from "../ui/Toaster";
import { useFormGuard } from "@/lib/form-guard";

interface Skill {
  id?: string;
  kind: string;
  title: string;
  desc?: string | null;
  order: number;
}

const EMPTY: Skill = { kind: "tech", title: "", desc: "", order: 0 };

export default function SkillForm({ item }: { item?: Skill }) {
  const router = useRouter();
  const [data, setData] = useState<Skill>(item ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useFormGuard(dirty, () => formRef.current?.requestSubmit());

  const set = (key: keyof Skill, val: string | number) => {
    setDirty(true);
    setData((d) => ({ ...d, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        kind: (data.kind === "area" ? "area" : "tech") as "area" | "tech",
        title: data.title,
        desc: data.desc || undefined,
        order: Number(data.order) || 0,
      };
      if (data.id) {
        await updateSkill(data.id, payload);
      } else {
        await createSkill(payload);
      }
      setDirty(false);
      toast("Skill saved");
      router.push("/admin/skills");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
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
            {data.id ? "Edit Skill" : "New Skill"}
          </h1>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
            <X size={14} /> Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving} title="Save (Ctrl+S)">
            <Save size={14} /> {saving ? "Saving..." : "Save"}
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
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Type *
            </label>
            <select
              className="input-base"
              value={data.kind}
              onChange={(e) => set("kind", e.target.value)}
            >
              <option value="tech">Tech chip</option>
              <option value="area">Expertise area</option>
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
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
            {data.kind === "area" ? "Area Title *" : "Label *"}
          </label>
          <input
            className="input-base"
            required
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder={data.kind === "area" ? "Web Systems" : "Laravel"}
          />
        </div>

        {data.kind === "area" && (
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Description
            </label>
            <textarea
              className="input-base"
              rows={3}
              value={data.desc ?? ""}
              onChange={(e) => set("desc", e.target.value)}
              placeholder="What this area covers..."
            />
          </div>
        )}
      </div>
    </form>
  );
}
