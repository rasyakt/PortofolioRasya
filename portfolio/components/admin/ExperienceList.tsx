"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import { Pencil, Copy, GripVertical, Search, Briefcase } from "lucide-react";
import type { Experience } from "@prisma/client";
import {
  deleteExperience, duplicateExperience, reorderExperiences,
} from "@/actions/experience";
import { toast } from "../ui/Toaster";
import DeleteButton from "./DeleteButton";

const iconBtn =
  "p-2 rounded-lg transition-all cursor-pointer bg-transparent border-none";

interface RowActions {
  onDuplicate: (e: Experience) => void;
  onDelete: (e: Experience) => Promise<unknown>;
}

function ExperienceRow({ item, draggable, actions }: { item: Experience; draggable: boolean; actions: RowActions }) {
  const controls = useDragControls();

  const content = (
    <>
      {draggable && (
        <button
          onPointerDown={(e) => controls.start(e)}
          className={`${iconBtn} touch-none cursor-grab active:cursor-grabbing shrink-0`}
          style={{ color: "var(--text-muted)", touchAction: "none" }}
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <GripVertical size={14} />
        </button>
      )}
      <span className="t-muted shrink-0"><Briefcase size={14} /></span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate t-primary">{item.role}</p>
        <p className="text-xs t-muted mt-0.5 truncate">
          {item.company} · <span className="font-mono">{item.year}</span>
        </p>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <Link
          href={`/admin/experience/${item.id}`}
          className={iconBtn}
          style={{ color: "var(--text-muted)", display: "inline-block" }}
          title="Edit"
        >
          <Pencil size={13} />
        </Link>
        <button
          onClick={() => actions.onDuplicate(item)}
          className={iconBtn}
          style={{ color: "var(--text-muted)" }}
          title="Duplicate"
        >
          <Copy size={13} />
        </button>
        <DeleteButton onDelete={() => actions.onDelete(item)} itemName="Entry" />
      </div>
    </>
  );

  if (!draggable) {
    return <div className="card p-4 flex items-center gap-4">{content}</div>;
  }
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02 }}
      className="card p-4 flex items-center gap-3"
      style={{ listStyle: "none" }}
    >
      {content}
    </Reorder.Item>
  );
}

export default function ExperienceList({ items }: { items: Experience[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [ordered, setOrdered] = useState(items);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const t = setTimeout(() => setOrdered(items), 0);
    return () => clearTimeout(t);
  }, [items]);

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

  const actions: RowActions = {
    onDuplicate: (e) => run(() => duplicateExperience(e.id), "Entry duplicated"),
    onDelete: (e) => deleteExperience(e.id),
  };

  const handleReorder = (next: Experience[]) => {
    setOrdered(next);
    startTransition(async () => {
      try {
        await reorderExperiences(next.map((e) => e.id));
        router.refresh();
      } catch {
        toast("Failed to save order", "error");
      }
    });
  };

  const q = query.trim().toLowerCase();
  const dragging = q === "";
  const filtered = q
    ? ordered.filter((e) =>
        [e.year, e.role, e.company].join(" ").toLowerCase().includes(q)
      )
    : ordered;

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

      <div style={{ opacity: pending ? 0.6 : 1 }}>
        {dragging ? (
          <Reorder.Group axis="y" values={ordered} onReorder={handleReorder} className="space-y-2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {ordered.map((e) => (
              <ExperienceRow key={e.id} item={e} draggable actions={actions} />
            ))}
          </Reorder.Group>
        ) : (
          <div className="space-y-2">
            {filtered.map((e) => (
              <ExperienceRow key={e.id} item={e} draggable={false} actions={actions} />
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-12 font-mono text-sm t-muted">
          {q ? `No entries match "${query}".` : "No entries yet."}
        </p>
      )}
      {dragging && ordered.length > 1 && (
        <p className="text-xs font-mono t-muted mt-3">Drag the handle to reorder.</p>
      )}
    </div>
  );
}
