"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SkillSchema = z.object({
  kind: z.enum(["area", "tech"]),
  title: z.string().min(1, "Title is required").trim(),
  desc: z.string().nullable().optional(),
  group: z.string().trim().max(40).nullable().optional(),
  order: z.number().default(0),
});

function normalizeGroup(group: string | null | undefined): string | null {
  const g = (group ?? "").trim();
  return g.length > 0 ? g.slice(0, 40) : null;
}

export async function getSkills() {
  return prisma.skill.findMany({ orderBy: { order: "asc" } });
}

export async function getSkillGroups(): Promise<string[]> {
  const rows = await prisma.skill.findMany({
    where: { group: { not: null } },
    select: { group: true },
    distinct: ["group"],
  });
  return rows.map((r) => r.group as string).filter(Boolean).sort();
}

export async function createSkill(data: z.infer<typeof SkillSchema>) {
  await requireAuth();
  const validated = SkillSchema.parse(data);
  const max = await prisma.skill.aggregate({ _max: { order: true } });
  const item = await prisma.skill.create({
    data: { ...validated, group: normalizeGroup(validated.group), order: (max._max.order ?? -1) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true, item };
}

export async function updateSkill(id: string, data: z.infer<typeof SkillSchema>) {
  await requireAuth();
  const validated = SkillSchema.parse(data);
  const { order: _ignoredOrder, ...rest } = validated;
  void _ignoredOrder;
  const item = await prisma.skill.update({
    where: { id },
    data: { ...rest, group: normalizeGroup(validated.group) },
  });
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
  const max = await prisma.skill.aggregate({ _max: { order: true } });
  const copy = await prisma.skill.create({
    data: { ...rest, title: `${src.title} (Copy)`, order: (max._max.order ?? -1) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true, item: copy };
}

/**
 * Persist a drag-and-drop order within one section. `ids` must be the FULL
 * ordered id list of that section (dragging is disabled while searching).
 */
export async function reorderSkills(ids: string[]) {
  await requireAuth();
  const clean = ids.filter((id) => typeof id === "string").slice(0, 500);
  await prisma.$transaction(
    clean.map((id, index) => prisma.skill.update({ where: { id }, data: { order: index } }))
  );
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}
