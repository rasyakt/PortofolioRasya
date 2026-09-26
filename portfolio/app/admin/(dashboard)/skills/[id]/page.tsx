import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SkillForm from "@/components/admin/SkillForm";

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.skill.findUnique({ where: { id } });
  if (!item) notFound();
  return <SkillForm item={item} />;
}
