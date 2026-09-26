"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CertSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  issuer: z.string().min(1, "Issuer is required").trim(),
  issueDate: z.string().min(1, "Issue date is required").trim(),
  credentialUrl: z.string().url().nullable().optional().or(z.literal("")),
  badgeImage: z.string().nullable().optional(),
  type: z.enum(["cert", "hki", "award"]),
  regNumber: z.string().nullable().optional(),
  order: z.number().default(0),
});

export async function getCertifications(type?: string) {
  const where = type && type !== "all" ? { type } : {};
  return prisma.certification.findMany({ where, orderBy: { order: "asc" } });
}

export async function getCertificationById(id: string) {
  return prisma.certification.findUnique({ where: { id } });
}

export async function createCertification(data: z.infer<typeof CertSchema>) {
  await requireAuth();
  const validated = CertSchema.parse(data);
  const cert = await prisma.certification.create({ data: validated });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true, cert };
}

export async function updateCertification(id: string, data: z.infer<typeof CertSchema>) {
  await requireAuth();
  const validated = CertSchema.parse(data);
  const cert = await prisma.certification.update({ where: { id }, data: validated });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true, cert };
}

export async function deleteCertification(id: string) {
  await requireAuth();
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true };
}

export async function duplicateCertification(id: string) {
  await requireAuth();
  const src = await prisma.certification.findUnique({ where: { id } });
  if (!src) throw new Error("Record not found");
  const { id: _omitId, createdAt: _omitCreated, ...rest } = src;
  void _omitId;
  void _omitCreated;
  const copy = await prisma.certification.create({
    data: { ...rest, title: `${src.title} (Copy)` },
  });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true, cert: copy };
}

export async function moveCertification(id: string, direction: "up" | "down") {
  await requireAuth();
  const list = await prisma.certification.findMany({ orderBy: { order: "asc" } });
  const idx = list.findIndex((c) => c.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return { success: false };
  const a = list[idx];
  const b = list[swapIdx];
  await prisma.$transaction([
    prisma.certification.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.certification.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true };
}
