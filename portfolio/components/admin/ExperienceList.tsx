"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Copy, ChevronUp, ChevronDown, Search, Briefcase } from "lucide-react";
import type { Experience } from "@prisma/client";
import {
  deleteExperience, duplicateExperience, moveExperience,
} from "@/actions/experience";
import { toast } from "../ui/Toaster";
import DeleteButton from "./DeleteButton";

const iconBtn =
  "p-2 rounded-lg transition-all cursor-pointer bg-transparent border-none";

export default function ExperienceList({ items }: { items: Experience[] }) {
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

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((e) =>
        [e.year, e.role, e.company].join(" ").toLowerCase().includes(q)
      )
    : items;

  return (
    <div>
      <div className="relative mb-4 max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search experience..."
          aria-label="Search experience"
          className="input-base"
          style={{ paddingLeft: "32px", fontSize: "13px" }}
        />
      </div>

      <div className="space-y-2" style={{ opacity: pending ? 0.6 : 1 }}>
        {filtered.map((e, i) => (
          <div key={e.id} className="card p-4 flex items-center gap-4">
            <span className="t-muted shrink-0"><Briefcase size={14} /></span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate t-primary">{e.role}</p>
              <p className="text-xs t-muted mt-0.5">
                {e.company} · <span className="font-mono">{e.year}</span>
              </p>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <Link
                href={`/admin/experience/${e.id}`}
                className={iconBtn}
                style={{ color: "var(--text-muted)", display: "inline-block" }}
                title="Edit"
              >
                <Pencil size={13} />
              </Link>
              <button
                onClick={() => run(() => duplicateExperience(e.id), "Entry duplicated")}
                className={iconBtn}
                style={{ color: "var(--text-muted)" }}
                title="Duplicate"
              >
                <Copy size={13} />
              </button>
              <button
                onClick={() => run(() => moveExperience(e.id, "up"), "Moved up")}
                disabled={i === 0}
                className={iconBtn}
                style={{ color: "var(--text-muted)", opacity: i === 0 ? 0.3 : 1 }}
                title="Move up"
              >
                <ChevronUp size={13} />
              </button>
              <button
                onClick={() => run(() => moveExperience(e.id, "down"), "Moved down")}
                disabled={i === filtered.length - 1}
                className={iconBtn}
                style={{ color: "var(--text-muted)", opacity: i === filtered.length - 1 ? 0.3 : 1 }}
                title="Move down"
              >
                <ChevronDown size={13} />
              </button>
              <DeleteButton onDelete={() => deleteExperience(e.id)} itemName="Entry" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-12 font-mono text-sm t-muted">
          {q ? `No entries match "${query}".` : "No entries yet."}
        </p>
      )}
    </div>
  );
}
