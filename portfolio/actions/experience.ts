"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ExperienceSchema = z.object({
  year: z.string().min(1, "Year is required").trim(),
  role: z.string().min(1, "Role is required").trim(),
  company: z.string().min(1, "Company is required").trim(),
  points: z.string().default("[]"),
  order: z.number().default(0),
});

export async function getExperiences() {
  return prisma.experience.findMany({ orderBy: { order: "asc" } });
}

export async function createExperience(data: z.infer<typeof ExperienceSchema>) {
  await requireAuth();
  const validated = ExperienceSchema.parse(data);
  const max = await prisma.experience.aggregate({ _max: { order: true } });
  const item = await prisma.experience.create({
    data: { ...validated, order: (max._max.order ?? -1) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true, item };
}

export async function updateExperience(id: string, data: z.infer<typeof ExperienceSchema>) {
  await requireAuth();
  const validated = ExperienceSchema.parse(data);
  const { order: _ignoredOrder, ...rest } = validated;
  void _ignoredOrder;
  const item = await prisma.experience.update({ where: { id }, data: rest });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true, item };
}

export async function deleteExperience(id: string) {
  await requireAuth();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true };
}

export async function duplicateExperience(id: string) {
  await requireAuth();
  const src = await prisma.experience.findUnique({ where: { id } });
  if (!src) throw new Error("Entry not found");
  const { id: _omitId, createdAt: _omitCreated, updatedAt: _omitUpdated, ...rest } = src;
  void _omitId;
  void _omitCreated;
  void _omitUpdated;
  const max = await prisma.experience.aggregate({ _max: { order: true } });
  const copy = await prisma.experience.create({
    data: { ...rest, role: `${src.role} (Copy)`, order: (max._max.order ?? -1) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true, item: copy };
}

/**
 * Persist a drag-and-drop order. `ids` must be the FULL ordered list
 * (dragging is disabled while searching) — positions are written 0..n.
 */
export async function reorderExperiences(ids: string[]) {
  await requireAuth();
  const clean = ids.filter((id) => typeof id === "string").slice(0, 500);
  await prisma.$transaction(
    clean.map((id, index) => prisma.experience.update({ where: { id }, data: { order: index } }))
  );
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true };
}
