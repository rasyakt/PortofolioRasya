"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import { Pencil, Copy, GripVertical, Search, Layers, Cpu } from "lucide-react";
import type { Skill } from "@prisma/client";
import { deleteSkill, duplicateSkill, reorderSkills } from "@/actions/skills";
import { toast } from "../ui/Toaster";
import DeleteButton from "./DeleteButton";

const iconBtn =
  "p-2 rounded-lg transition-all cursor-pointer bg-transparent border-none";

interface RowActions {
  onDuplicate: (s: Skill) => void;
  onDelete: (s: Skill) => Promise<unknown>;
}

interface Section {
  key: string;
  title: string;
  items: Skill[];
}

function SkillRow({ skill, draggable, actions }: { skill: Skill; draggable: boolean; actions: RowActions }) {
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
      <span className="t-muted shrink-0">
        {skill.kind === "area" ? <Layers size={14} /> : <Cpu size={14} />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate t-primary">{skill.title}</p>
          <span className={`badge ${skill.kind === "area" ? "badge-accent" : ""}`}>
            {skill.kind === "area" ? "Area" : "Tech"}
          </span>
        </div>
        {skill.desc && (
          <p className="text-xs t-muted mt-0.5 truncate">{skill.desc}</p>
        )}
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <Link
          href={`/admin/skills/${skill.id}`}
          className={iconBtn}
          style={{ color: "var(--text-muted)", display: "inline-block" }}
          title="Edit"
        >
          <Pencil size={13} />
        </Link>
        <button
          onClick={() => actions.onDuplicate(skill)}
          className={iconBtn}
          style={{ color: "var(--text-muted)" }}
          title="Duplicate"
        >
          <Copy size={13} />
        </button>
        <DeleteButton onDelete={() => actions.onDelete(skill)} itemName="Skill" />
      </div>
    </>
  );

  if (!draggable) {
    return <div className="card p-4 flex items-center gap-4">{content}</div>;
  }
  return (
    <Reorder.Item
      value={skill}
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

function SkillSection({
  section,
  actions,
  onItemsReorder,
}: {
  section: Section;
  actions: RowActions;
  onItemsReorder: (next: Skill[]) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={section.key}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.01 }}
      className="mb-8"
      style={{ listStyle: "none" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <button
          onPointerDown={(e) => controls.start(e)}
          className={`${iconBtn} touch-none cursor-grab active:cursor-grabbing shrink-0`}
          style={{ color: "var(--text-muted)", touchAction: "none" }}
          title="Drag to move this whole section"
          aria-label={`Drag to move section ${section.title}`}
        >
          <GripVertical size={13} />
        </button>
        <p className="text-xs font-mono t-muted">
          {section.title} ({section.items.length})
        </p>
      </div>
      <Reorder.Group
        axis="y"
        values={section.items}
        onReorder={onItemsReorder}
        className="space-y-2"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {section.items.map((s) => (
          <SkillRow key={s.id} skill={s} draggable actions={actions} />
        ))}
      </Reorder.Group>
    </Reorder.Item>
  );
}

export default function SkillList({ items }: { items: Skill[] }) {
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
    onDuplicate: (s) => run(() => duplicateSkill(s.id), "Skill duplicated"),
    onDelete: (s) => deleteSkill(s.id),
  };

  const persistOrder = (next: Skill[]) => {
    setOrdered(next);
    startTransition(async () => {
      try {
        await reorderSkills(next.map((s) => s.id));
        router.refresh();
      } catch {
        toast("Failed to save order", "error");
      }
    });
  };

  const handleItemsReorder = (next: Skill[]) => {
    // Splice the section's new order into the global sequence.
    const nextIds = new Set(next.map((s) => s.id));
    const result: Skill[] = [];
    const queue = [...next];
    for (const s of ordered) {
      if (nextIds.has(s.id)) {
        const n = queue.shift();
        if (n) result.push(n);
      } else {
        result.push(s);
      }
    }
    persistOrder(result);
  };

  const handleSectionReorder = (nextKeys: string[]) => {
    const byKey = new Map(sections.map((s) => [s.key, s]));
    const flat: Skill[] = [];
    for (const key of nextKeys) {
      const sec = byKey.get(key);
      if (sec) flat.push(...sec.items);
    }
    // Include any items missing from sections (safety net).
    const seen = new Set(flat.map((s) => s.id));
    for (const s of ordered) {
      if (!seen.has(s.id)) flat.push(s);
    }
    persistOrder(flat);
  };

  const q = query.trim().toLowerCase();
  const dragging = q === "";

  const sections = ((): Section[] => {
    const areas = ordered.filter((s) => s.kind === "area");
    const techs = ordered.filter((s) => s.kind !== "area");
    const byGroup = new Map<string, Skill[]>();
    const ungrouped: Skill[] = [];
    for (const t of techs) {
      if (t.group) {
        const arr = byGroup.get(t.group) ?? [];
        arr.push(t);
        byGroup.set(t.group, arr);
      } else {
        ungrouped.push(t);
      }
    }
    const named = [...byGroup.entries()]
      .map(([name, list]) => ({ key: `group:${name}`, title: name, items: list }))
      .sort(
        (a, b) =>
          Math.min(...a.items.map((s) => s.order)) - Math.min(...b.items.map((s) => s.order))
      );
    const out: Section[] = [];
    if (areas.length > 0) out.push({ key: "areas", title: "Expertise areas", items: areas });
    out.push(...named);
    if (ungrouped.length > 0) out.push({ key: "ungrouped", title: "Ungrouped", items: ungrouped });
    return out;
  })();

  const matchQ = (s: Skill) =>
    !q || [s.title, s.desc ?? "", s.group ?? ""].join(" ").toLowerCase().includes(q);
  const flatFiltered = ordered.filter(matchQ);

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
        {dragging ? (
          <>
            <Reorder.Group
              axis="y"
              values={sections.map((s) => s.key)}
              onReorder={handleSectionReorder}
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              {sections.map((sec) => (
                <SkillSection
                  key={sec.key}
                  section={sec}
                  actions={actions}
                  onItemsReorder={handleItemsReorder}
                />
              ))}
            </Reorder.Group>
            {sections.length === 0 && (
              <p className="text-center py-12 font-mono text-sm t-muted">No skills yet.</p>
            )}
          </>
        ) : (
          <div className="space-y-2">
            {flatFiltered.map((s) => (
              <SkillRow key={s.id} skill={s} draggable={false} actions={actions} />
            ))}
            {flatFiltered.length === 0 && (
              <p className="text-center py-12 font-mono text-sm t-muted">
                No skills match &quot;{query}&quot;.
              </p>
            )}
          </div>
        )}
      </div>

      {dragging && ordered.length > 1 && (
        <p className="text-xs font-mono t-muted mt-3">
          Drag rows to reorder items, or drag a section header to move the whole group.
        </p>
      )}
    </div>
  );
}
