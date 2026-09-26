"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Copy, ChevronUp, ChevronDown, Search, Layers, Cpu } from "lucide-react";
import type { Skill } from "@prisma/client";
import { deleteSkill, duplicateSkill, moveSkill } from "@/actions/skills";
import { toast } from "../ui/Toaster";
import DeleteButton from "./DeleteButton";

const iconBtn =
  "p-2 rounded-lg transition-all cursor-pointer bg-transparent border-none";

export default function SkillList({ items }: { items: Skill[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<unknown>, okMsg: string) => {
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
        toast(okMsg);
      } catch {
        toast("Action failed", "error");
      }
    });
  };

  const areas = items.filter((s) => s.kind === "area");
  const techs = items.filter((s) => s.kind !== "area");
  const q = query.trim().toLowerCase();
  const matchQ = (s: Skill) =>
    !q || [s.title, s.desc ?? ""].join(" ").toLowerCase().includes(q);

  const renderRow = (s: Skill, list: Skill[], i: number) => (
    <div key={s.id} className="card p-4 flex items-center gap-4">
      <span className="t-muted shrink-0">
        {s.kind === "area" ? <Layers size={14} /> : <Cpu size={14} />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate t-primary">{s.title}</p>
          <span className={`badge ${s.kind === "area" ? "badge-accent" : ""}`}>
            {s.kind === "area" ? "Area" : "Tech"}
          </span>
        </div>
        {s.desc && (
          <p className="text-xs t-muted mt-0.5 truncate">{s.desc}</p>
        )}
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <Link
          href={`/admin/skills/${s.id}`}
          className={iconBtn}
          style={{ color: "var(--text-muted)", display: "inline-block" }}
          title="Edit"
        >
          <Pencil size={13} />
        </Link>
        <button
          onClick={() => run(() => duplicateSkill(s.id), "Skill duplicated")}
          className={iconBtn}
          style={{ color: "var(--text-muted)" }}
          title="Duplicate"
        >
          <Copy size={13} />
        </button>
        <button
          onClick={() => run(() => moveSkill(s.id, s.kind === "area" ? "area" : "tech", "up"), "Moved up")}
          disabled={i === 0}
          className={iconBtn}
          style={{ color: "var(--text-muted)", opacity: i === 0 ? 0.3 : 1 }}
          title="Move up"
        >
          <ChevronUp size={13} />
        </button>
        <button
          onClick={() => run(() => moveSkill(s.id, s.kind === "area" ? "area" : "tech", "down"), "Moved down")}
          disabled={i === list.length - 1}
          className={iconBtn}
          style={{ color: "var(--text-muted)", opacity: i === list.length - 1 ? 0.3 : 1 }}
          title="Move down"
        >
          <ChevronDown size={13} />
        </button>
        <DeleteButton onDelete={() => deleteSkill(s.id)} itemName="Skill" />
      </div>
    </div>
  );

  const shownAreas = areas.filter(matchQ);
  const shownTech = techs.filter(matchQ);

  return (
    <div>
      <div className="relative mb-6 max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills..."
          aria-label="Search skills"
          className="input-base"
          style={{ paddingLeft: "32px", fontSize: "13px" }}
        />
      </div>

      <div style={{ opacity: pending ? 0.6 : 1 }}>
        <p className="text-xs font-mono t-muted mb-3">Expertise areas ({shownAreas.length})</p>
        <div className="space-y-2 mb-8">
          {shownAreas.map((s, i) => renderRow(s, shownAreas, i))}
        </div>
        <p className="text-xs font-mono t-muted mb-3">Tech stack ({shownTech.length})</p>
        <div className="space-y-2">
          {shownTech.map((s, i) => renderRow(s, shownTech, i))}
        </div>
      </div>

      {shownAreas.length === 0 && shownTech.length === 0 && (
        <p className="text-center py-12 font-mono text-sm t-muted">
          {q ? `No skills match "${query}".` : "No skills yet."}
        </p>
      )}
    </div>
  );
}
