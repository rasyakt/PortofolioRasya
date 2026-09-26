import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import SkillList from "@/components/admin/SkillList";

export default async function AdminSkillsPage() {
  const items = await prisma.skill.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">CMS</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Skills & Stack</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {items.length} items — expertise areas & tech chips
          </p>
        </div>
        <Link href="/admin/skills/new" className="btn btn-primary">
          <Plus size={15} /> New Skill
        </Link>
      </div>

      <SkillList items={items} />
    </div>
  );
}
