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
  const item = await prisma.experience.create({ data: validated });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true, item };
}

export async function updateExperience(id: string, data: z.infer<typeof ExperienceSchema>) {
  await requireAuth();
  const validated = ExperienceSchema.parse(data);
  const item = await prisma.experience.update({ where: { id }, data: validated });
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
  const copy = await prisma.experience.create({
    data: { ...rest, role: `${src.role} (Copy)` },
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true, item: copy };
}

export async function moveExperience(id: string, direction: "up" | "down") {
  await requireAuth();
  const list = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  const idx = list.findIndex((e) => e.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return { success: false };
  const a = list[idx];
  const b = list[swapIdx];
  await prisma.$transaction([
    prisma.experience.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.experience.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true };
}
