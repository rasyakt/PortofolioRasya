"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .trim()
    .transform((s) => s.toLowerCase())
    .refine((s) => /^[a-z0-9-]+$/.test(s), "Slug must be lowercase alphanumeric with hyphens"),
  category: z.enum(["enterprise", "mobile", "ai", "systems", "fullstack"]),
  description: z.string().min(1, "Description is required").trim(),
  longDesc: z.string().nullable().optional(),
  problem: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  architecture: z.string().nullable().optional(),
  impact: z.string().nullable().optional(),
  techStack: z.string().min(1, "Tech stack is required"),
  liveUrl: z.string().url().nullable().optional().or(z.literal("")),
  githubUrl: z.string().url().nullable().optional().or(z.literal("")),
  coverImage: z.string().nullable().optional(),
  hkiNumber: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export async function getProjects(category?: string) {
  const where = category && category !== "all" ? { category } : {};
  return prisma.project.findMany({
    where,
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

function friendlyError(err: unknown): never {
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  ) {
    throw new Error("Slug already exists — please use a different slug.");
  }
  throw err;
}

export async function createProject(data: z.infer<typeof ProjectSchema>) {
  await requireAuth();
  const validated = ProjectSchema.parse(data);
  try {
    const project = await prisma.project.create({ data: validated });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true, project };
  } catch (err: unknown) {
    friendlyError(err);
  }
}

export async function updateProject(id: string, data: z.infer<typeof ProjectSchema>) {
  await requireAuth();
  const validated = ProjectSchema.parse(data);
  try {
    const project = await prisma.project.update({ where: { id }, data: validated });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true, project };
  } catch (err: unknown) {
    friendlyError(err);
  }
}

export async function deleteProject(id: string) {
  await requireAuth();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function toggleFeatured(id: string, featured: boolean) {
  await requireAuth();
  await prisma.project.update({ where: { id }, data: { featured } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function duplicateProject(id: string) {
  await requireAuth();
  const src = await prisma.project.findUnique({ where: { id } });
  if (!src) throw new Error("Project not found");
  const slugBase = `${src.slug}-copy`;
  let slug = slugBase;
  let n = 2;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${n++}`;
  }
  const { id: _omitId, createdAt: _omitCreated, updatedAt: _omitUpdated, ...rest } = src;
  void _omitId;
  void _omitCreated;
  void _omitUpdated;
  const copy = await prisma.project.create({
    data: { ...rest, title: `${src.title} (Copy)`, slug, featured: false },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true, project: copy };
}

export async function moveProject(id: string, direction: "up" | "down") {
  await requireAuth();
  const list = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  const idx = list.findIndex((p) => p.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return { success: false };
  const a = list[idx];
  const b = list[swapIdx];
  await prisma.$transaction([
    prisma.project.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.project.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}
