"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createExperience, updateExperience } from "@/actions/experience";
import { Save, X } from "lucide-react";
import { toast } from "../ui/Toaster";
import { useFormGuard } from "@/lib/form-guard";

interface Experience {
  id?: string;
  year: string;
  role: string;
  company: string;
  points: string;
  order: number;
}

const EMPTY: Experience = { year: "", role: "", company: "", points: "[]", order: 0 };

function safeParseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return str.split("\n").map((s) => s.trim()).filter(Boolean);
  }
}

export default function ExperienceForm({ item }: { item?: Experience }) {
  const router = useRouter();
  const initial = item ?? EMPTY;
  const [data, setData] = useState<Experience>(initial);
  const [pointsText, setPointsText] = useState(
    safeParseJsonArray(initial.points).join("\n")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useFormGuard(dirty, () => formRef.current?.requestSubmit());

  const set = (key: keyof Experience, val: string | number) => {
    setDirty(true);
    setData((d) => ({ ...d, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        year: data.year,
        role: data.role,
        company: data.company,
        points: JSON.stringify(
          pointsText.split("\n").map((s: string) => s.trim()).filter(Boolean)
        ),
        order: Number(data.order) || 0,
      };
      if (data.id) {
        await updateExperience(data.id, payload);
      } else {
        await createExperience(payload);
      }
      setDirty(false);
      toast("Experience saved");
      router.push("/admin/experience");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
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
            {data.id ? "Edit Experience" : "New Experience"}
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
              Year *
            </label>
            <input
              className="input-base"
              required
              value={data.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="2023 – Present"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Role *
            </label>
            <input
              className="input-base"
              required
              value={data.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="Chief Technology Officer"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Company / Organization *
            </label>
            <input
              className="input-base"
              required
              value={data.company}
              onChange={(e) => set("company", e.target.value)}
              placeholder="BotHax"
            />
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
            Highlights (one per line)
          </label>
          <textarea
            className="input-base"
            rows={4}
            value={pointsText}
            onChange={(e) => { setDirty(true); setPointsText(e.target.value); }}
            placeholder="Led the engineering team...&#10;Shipped 5 production systems..."
          />
        </div>
      </div>
    </form>
  );
}
