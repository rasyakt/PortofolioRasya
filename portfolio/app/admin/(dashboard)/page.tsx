import { prisma } from "@/lib/prisma";
import { FolderOpen, Award, Users, BarChart3, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [projectCount, certCount, profile] = await Promise.all([
    prisma.project.count(),
    prisma.certification.count(),
    prisma.profileConfig.findFirst(),
  ]);
  const featuredCount = await prisma.project.count({ where: { featured: true } });

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="section-label mb-1">Admin CMS</p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Welcome back, {profile?.name?.split(" ")[0] ?? "Rasya"} 👋
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <FolderOpen size={18} />, label: "Total Projects", value: projectCount, color: "var(--accent)", href: "/admin/projects" },
          { icon: <Award size={18} />, label: "Certifications", value: certCount, color: "#fbbf24", href: "/admin/certifications" },
          { icon: <Users size={18} />, label: "Featured", value: featuredCount, color: "#38bdf8", href: "/admin/projects" },
          { icon: <BarChart3 size={18} />, label: "Categories", value: 5, color: "#a78bfa", href: "/admin/projects" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="glass glass-hover p-5 rounded-xl block"
            style={{ borderColor: `${s.color}20` }}
          >
            <div style={{ color: s.color }} className="mb-2">{s.icon}</div>
            <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/projects/new" className="btn btn-primary justify-center">
          + New Project
        </Link>
        <Link href="/admin/certifications" className="btn btn-secondary justify-center">
          Manage Certs
        </Link>
        <Link href="/admin/profile" className="btn btn-secondary justify-center">
          Edit Profile
        </Link>
      </div>

      {/* Status card */}
      <div
        className="p-5 rounded-xl flex items-center justify-between"
        style={{ background: "var(--accent-muted)", border: "1px solid var(--accent-border)" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Portfolio is{" "}
            <span style={{ color: "var(--accent)" }}>
              {profile?.isAvailable ? "Open for work" : "Not available"}
            </span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {profile?.availabilityText}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/profile" className="btn btn-secondary" style={{ fontSize: "12px", padding: "6px 12px" }}>
            Edit Status
          </Link>
          <a
            href="/"
            target="_blank"
            className="btn btn-ghost flex items-center gap-1.5"
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            <ExternalLink size={12} /> View Site
          </a>
        </div>
      </div>
    </div>
  );
}
