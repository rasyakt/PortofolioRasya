import { prisma } from "@/lib/prisma";
import { deleteCertification } from "@/actions/certifications";
import { Shield, Star, Award, Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminCertificationsPage() {
  const certs = await prisma.certification.findMany({ orderBy: { order: "asc" } });

  const TYPE_ICON: Record<string, React.ReactNode> = {
    hki: <Shield size={14} style={{ color: "#fbbf24" }} />,
    cert: <Star size={14} style={{ color: "var(--accent)" }} />,
    award: <Award size={14} style={{ color: "#a78bfa" }} />,
  };

  const TYPE_COLOR: Record<string, string> = {
    hki: "#fbbf24", cert: "var(--accent)", award: "#a78bfa",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Certifications
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {certs.length} records — HKI, Certificates, Awards
          </p>
        </div>
        <Link href="/admin/certifications/new" className="btn btn-primary">
          <Plus size={15} /> New Record
        </Link>
      </div>

      <div className="space-y-2">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="glass p-4 rounded-xl flex items-center gap-4"
          >
            <div style={{ color: TYPE_COLOR[cert.type] || "var(--accent)" }}>
              {TYPE_ICON[cert.type] || <Star size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {cert.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{cert.issuer}</span>
                {cert.regNumber && (
                  <>
                    <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>·</span>
                    <span className="text-xs font-mono" style={{ color: "#fbbf24" }}>
                      Reg. {cert.regNumber}
                    </span>
                  </>
                )}
              </div>
            </div>
            <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-muted)" }}>
              {cert.issueDate}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={`/admin/certifications/${cert.id}`}
                className="p-2 rounded-lg transition-all"
                style={{ color: "var(--text-muted)" }}
                title="Edit"
              >
                <Pencil size={13} />
              </Link>
              <form action={async () => { "use server"; await deleteCertification(cert.id); }}>
                <button
                  type="submit"
                  className="p-2 rounded-lg transition-all text-zinc-600 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
