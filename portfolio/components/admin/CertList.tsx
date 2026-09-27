"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import { Shield, Star, Award, Pencil, Copy, GripVertical, Search } from "lucide-react";
import type { Certification } from "@prisma/client";
import {
  deleteCertification, duplicateCertification, reorderCertifications,
} from "@/actions/certifications";
import { toast } from "../ui/Toaster";
import DeleteButton from "./DeleteButton";

const TYPE_ICON: Record<string, React.ReactNode> = {
  hki: <Shield size={14} style={{ color: "var(--amber)" }} />,
  cert: <Star size={14} style={{ color: "var(--accent)" }} />,
  award: <Award size={14} style={{ color: "var(--violet)" }} />,
};

const iconBtn =
  "p-2 rounded-lg transition-all cursor-pointer bg-transparent border-none";

interface RowActions {
  onDuplicate: (c: Certification) => void;
  onDelete: (c: Certification) => Promise<unknown>;
}

function CertRow({ cert, draggable, actions }: { cert: Certification; draggable: boolean; actions: RowActions }) {
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
      <div className="shrink-0">{TYPE_ICON[cert.type] || <Star size={14} />}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate t-primary">{cert.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs t-muted truncate">{cert.issuer}</span>
          {cert.regNumber && (
            <>
              <span className="t-muted shrink-0" style={{ fontSize: "10px" }}>·</span>
              <span className="text-xs font-mono shrink-0" style={{ color: "var(--amber)" }}>
                Reg. {cert.regNumber}
              </span>
            </>
          )}
        </div>
      </div>
      <span className="text-xs font-mono shrink-0 t-muted hidden sm:block">{cert.issueDate}</span>
      <div className="flex items-center gap-0.5 shrink-0">
        <Link
          href={`/admin/certifications/${cert.id}`}
          className={iconBtn}
          style={{ color: "var(--text-muted)", display: "inline-block" }}
          title="Edit"
        >
          <Pencil size={13} />
        </Link>
        <button
          onClick={() => actions.onDuplicate(cert)}
          className={iconBtn}
          style={{ color: "var(--text-muted)" }}
          title="Duplicate"
        >
          <Copy size={13} />
        </button>
        <DeleteButton onDelete={() => actions.onDelete(cert)} itemName="Record" />
      </div>
    </>
  );

  if (!draggable) {
    return <div className="card p-4 flex items-center gap-4">{content}</div>;
  }
  return (
    <Reorder.Item
      value={cert}
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

export default function CertList({ certs }: { certs: Certification[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [ordered, setOrdered] = useState(certs);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const t = setTimeout(() => setOrdered(certs), 0);
    return () => clearTimeout(t);
  }, [certs]);

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
    onDuplicate: (c) => run(() => duplicateCertification(c.id), "Record duplicated"),
    onDelete: (c) => deleteCertification(c.id),
  };

  const handleReorder = (next: Certification[]) => {
    setOrdered(next);
    startTransition(async () => {
      try {
        await reorderCertifications(next.map((c) => c.id));
        router.refresh();
      } catch {
        toast("Failed to save order", "error");
      }
    });
  };

  const q = query.trim().toLowerCase();
  const dragging = q === "";
  const filtered = q
    ? ordered.filter((c) =>
        [c.title, c.issuer, c.type, c.regNumber ?? ""].join(" ").toLowerCase().includes(q)
      )
    : ordered;

  return (
    <div>
      <div className="relative mb-4 max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search records..."
          aria-label="Search certifications"
          className="input-base"
          style={{ paddingLeft: "32px", fontSize: "13px" }}
        />
      </div>

      <div style={{ opacity: pending ? 0.6 : 1 }}>
        {dragging ? (
          <Reorder.Group axis="y" values={ordered} onReorder={handleReorder} className="space-y-2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {ordered.map((cert) => (
              <CertRow key={cert.id} cert={cert} draggable actions={actions} />
            ))}
          </Reorder.Group>
        ) : (
          <div className="space-y-2">
            {filtered.map((cert) => (
              <CertRow key={cert.id} cert={cert} draggable={false} actions={actions} />
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-12 font-mono text-sm t-muted">
          {q ? `No records match "${query}".` : "No records yet."}
        </p>
      )}
      {dragging && ordered.length > 1 && (
        <p className="text-xs font-mono t-muted mt-3">Drag the handle to reorder.</p>
      )}
    </div>
  );
}
