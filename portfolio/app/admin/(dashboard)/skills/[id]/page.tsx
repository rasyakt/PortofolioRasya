import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SkillForm from "@/components/admin/SkillForm";
import { getSkillGroups } from "@/actions/skills";

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, groups] = await Promise.all([
    prisma.skill.findUnique({ where: { id } }),
    getSkillGroups(),
  ]);
  if (!item) notFound();
  return <SkillForm item={item} groups={groups} />;
}
