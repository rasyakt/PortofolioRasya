import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ExperienceForm from "@/components/admin/ExperienceForm";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) notFound();
  return <ExperienceForm item={item} />;
}
