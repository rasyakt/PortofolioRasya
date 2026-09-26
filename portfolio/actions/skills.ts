"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SkillSchema = z.object({
  kind: z.enum(["area", "tech"]),
  title: z.string().min(1, "Title is required").trim(),
  desc: z.string().nullable().optional(),
  order: z.number().default(0),
});

export async function getSkills() {
  return prisma.skill.findMany({ orderBy: { order: "asc" } });
}

export async function createSkill(data: z.infer<typeof SkillSchema>) {
  await requireAuth();
  const validated = SkillSchema.parse(data);
  const item = await prisma.skill.create({ data: validated });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true, item };
}

export async function updateSkill(id: string, data: z.infer<typeof SkillSchema>) {
  await requireAuth();
  const validated = SkillSchema.parse(data);
  const item = await prisma.skill.update({ where: { id }, data: validated });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true, item };
}

export async function deleteSkill(id: string) {
  await requireAuth();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}

export async function duplicateSkill(id: string) {
  await requireAuth();
  const src = await prisma.skill.findUnique({ where: { id } });
  if (!src) throw new Error("Skill not found");
  const { id: _omitId, createdAt: _omitCreated, updatedAt: _omitUpdated, ...rest } = src;
  void _omitId;
  void _omitCreated;
  void _omitUpdated;
  const copy = await prisma.skill.create({
    data: { ...rest, title: `${src.title} (Copy)` },
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true, item: copy };
}

export async function moveSkill(id: string, kind: "area" | "tech", direction: "up" | "down") {
  await requireAuth();
  const list = await prisma.skill.findMany({
    where: { kind },
    orderBy: { order: "asc" },
  });
  const idx = list.findIndex((s) => s.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return { success: false };
  const a = list[idx];
  const b = list[swapIdx];
  await prisma.$transaction([
    prisma.skill.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.skill.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}
