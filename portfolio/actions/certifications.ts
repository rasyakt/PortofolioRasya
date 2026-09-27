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
  return prisma.certification.findMany({
    where,
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
}

export async function getCertificationById(id: string) {
  return prisma.certification.findUnique({ where: { id } });
}

export async function createCertification(data: z.infer<typeof CertSchema>) {
  await requireAuth();
  const validated = CertSchema.parse(data);
  const max = await prisma.certification.aggregate({ _max: { order: true } });
  const cert = await prisma.certification.create({
    data: { ...validated, order: (max._max.order ?? -1) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true, cert };
}

export async function updateCertification(id: string, data: z.infer<typeof CertSchema>) {
  await requireAuth();
  const validated = CertSchema.parse(data);
  const { order: _ignoredOrder, ...rest } = validated;
  void _ignoredOrder;
  const cert = await prisma.certification.update({ where: { id }, data: rest });
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
  const max = await prisma.certification.aggregate({ _max: { order: true } });
  const copy = await prisma.certification.create({
    data: { ...rest, title: `${src.title} (Copy)`, order: (max._max.order ?? -1) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true, cert: copy };
}

/**
 * Persist a drag-and-drop order. `ids` must be the FULL ordered list
 * (dragging is disabled while searching) — positions are written 0..n.
 */
export async function reorderCertifications(ids: string[]) {
  await requireAuth();
  const clean = ids.filter((id) => typeof id === "string").slice(0, 500);
  await prisma.$transaction(
    clean.map((id, index) => prisma.certification.update({ where: { id }, data: { order: index } }))
  );
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true };
}

const ImageUrlSchema = z.string().min(1).max(500);

export async function addCertificationImages(certificationId: string, urls: string[]) {
  await requireAuth();
  const clean = urls
    .map((u) => ImageUrlSchema.parse(u.trim()))
    .filter(Boolean)
    .slice(0, 20);
  if (clean.length === 0) return { success: false };
  const existing = await prisma.certificationImage.count({ where: { certificationId } });
  await prisma.certificationImage.createMany({
    data: clean.map((url, i) => ({ certificationId, url, order: existing + i })),
  });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true };
}

export async function deleteCertificationImage(id: string) {
  await requireAuth();
  await prisma.certificationImage.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true };
}

export async function moveCertificationImage(id: string, direction: "up" | "down") {
  await requireAuth();
  const item = await prisma.certificationImage.findUnique({ where: { id } });
  if (!item) return { success: false };
  const list = await prisma.certificationImage.findMany({
    where: { certificationId: item.certificationId },
    orderBy: { order: "asc" },
  });
  const idx = list.findIndex((x) => x.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return { success: false };
  const a = list[idx];
  const b = list[swapIdx];
  await prisma.$transaction([
    prisma.certificationImage.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.certificationImage.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true };
}
