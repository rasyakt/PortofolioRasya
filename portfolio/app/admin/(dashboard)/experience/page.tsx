import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import ExperienceList from "@/components/admin/ExperienceList";

export default async function AdminExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Experience</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {items.length} entries in timeline order
          </p>
        </div>
        <Link href="/admin/experience/new" className="btn btn-primary">
          <Plus size={15} /> New Entry
        </Link>
      </div>

      <ExperienceList items={items} />
    </div>
  );
}
