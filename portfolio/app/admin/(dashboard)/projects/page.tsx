import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProjectList from "@/components/admin/ProjectList";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Projects</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {projects.length} projects total
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          <Plus size={15} /> New Project
        </Link>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
