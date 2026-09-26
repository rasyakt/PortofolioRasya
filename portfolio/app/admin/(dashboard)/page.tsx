import { prisma } from "@/lib/prisma";
import { FolderOpen, Award, Users, BarChart3, ExternalLink, Eye, Download, Briefcase, MousePointerClick, Layers } from "lucide-react";
import Link from "next/link";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const thirtyDaysAgo = () => new Date(Date.now() - THIRTY_DAYS_MS);

const EVENT_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  page_view: { label: "Page views", icon: <Eye size={18} /> },
  cv_download: { label: "CV downloads", icon: <Download size={18} /> },
  recruiter_open: { label: "Recruiter opens", icon: <Briefcase size={18} /> },
  project_open: { label: "Project opens", icon: <MousePointerClick size={18} /> },
  contact_click: { label: "Contact clicks", icon: <ExternalLink size={18} /> },
};

export default async function AdminDashboard() {
  const [projectCount, certCount, profile] = await Promise.all([
    prisma.project.count(),
    prisma.certification.count(),
    prisma.profileConfig.findFirst(),
  ]);
  const featuredCount = await prisma.project.count({ where: { featured: true } });
  const categoryGroups = await prisma.project.groupBy({ by: ["category"] });
  const [experienceCount, skillCount] = await Promise.all([
    prisma.experience.count(),
    prisma.skill.count(),
  ]);
  const eventGroups = await prisma.siteEvent.groupBy({
    by: ["type"],
    where: { createdAt: { gte: thirtyDaysAgo() } },
    _count: { type: true },
  });
  const eventCounts = Object.fromEntries(eventGroups.map((g) => [g.type, g._count.type]));

  return (
    <div className="p-4 sm:p-8">
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
          { icon: <Award size={18} />, label: "Certifications", value: certCount, color: "var(--amber)", href: "/admin/certifications" },
          { icon: <Users size={18} />, label: "Featured", value: featuredCount, color: "var(--info)", href: "/admin/projects" },
          { icon: <BarChart3 size={18} />, label: "Categories", value: categoryGroups.length, color: "var(--violet)", href: "/admin/projects" },
          { icon: <Briefcase size={18} />, label: "Experience", value: experienceCount, color: "var(--accent)", href: "/admin/experience" },
          { icon: <Layers size={18} />, label: "Skills", value: skillCount, color: "var(--info)", href: "/admin/skills" },
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

      {/* Site analytics — last 30 days */}
      <div className="mb-8">
        <p className="section-label mb-3">Analytics — last 30 days</p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(EVENT_LABELS).map(([type, cfg]) => (
            <div key={type} className="card p-4">
              <div className="t-muted mb-2">{cfg.icon}</div>
              <p className="text-2xl font-bold font-mono t-primary">{eventCounts[type] ?? 0}</p>
              <p className="text-xs mt-1 t-secondary">{cfg.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status card */}
      <div
        className="p-5 rounded-xl flex items-center justify-between"
        style={{ background: "var(--accent-soft)", border: "1px solid var(--accent-border)" }}
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
