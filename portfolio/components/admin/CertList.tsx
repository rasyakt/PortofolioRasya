"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield, Star, Award, Pencil, Copy, ChevronUp, ChevronDown, Search,
} from "lucide-react";
import type { Certification } from "@prisma/client";
import {
  deleteCertification, duplicateCertification, moveCertification,
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

export default function CertList({ certs }: { certs: Certification[] }) {
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
    ? certs.filter((c) =>
        [c.title, c.issuer, c.type, c.regNumber ?? ""].join(" ").toLowerCase().includes(q)
      )
    : certs;

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

      <div className="space-y-2" style={{ opacity: pending ? 0.6 : 1 }}>
        {filtered.map((cert, i) => (
          <div key={cert.id} className="card p-4 flex items-center gap-4">
            <div className="shrink-0">{TYPE_ICON[cert.type] || <Star size={14} />}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate t-primary">{cert.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs t-muted">{cert.issuer}</span>
                {cert.regNumber && (
                  <>
                    <span className="t-muted" style={{ fontSize: "10px" }}>·</span>
                    <span className="text-xs font-mono" style={{ color: "var(--amber)" }}>
                      Reg. {cert.regNumber}
                    </span>
                  </>
                )}
              </div>
            </div>
            <span className="text-xs font-mono shrink-0 t-muted">{cert.issueDate}</span>
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
                onClick={() => run(() => duplicateCertification(cert.id), "Record duplicated")}
                className={iconBtn}
                style={{ color: "var(--text-muted)" }}
                title="Duplicate"
              >
                <Copy size={13} />
              </button>
              <button
                onClick={() => run(() => moveCertification(cert.id, "up"), "Moved up")}
                disabled={i === 0}
                className={iconBtn}
                style={{ color: "var(--text-muted)", opacity: i === 0 ? 0.3 : 1 }}
                title="Move up"
              >
                <ChevronUp size={13} />
              </button>
              <button
                onClick={() => run(() => moveCertification(cert.id, "down"), "Moved down")}
                disabled={i === filtered.length - 1}
                className={iconBtn}
                style={{ color: "var(--text-muted)", opacity: i === filtered.length - 1 ? 0.3 : 1 }}
                title="Move down"
              >
                <ChevronDown size={13} />
              </button>
              <DeleteButton onDelete={() => deleteCertification(cert.id)} itemName="Record" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-12 font-mono text-sm t-muted">
          {q ? `No records match "${query}".` : "No records yet."}
        </p>
      )}
    </div>
  );
}
