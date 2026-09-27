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
    include: { images: { orderBy: { order: "asc" } } },
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
    const max = await prisma.project.aggregate({ _max: { order: true } });
    const project = await prisma.project.create({
      data: { ...validated, order: (max._max.order ?? -1) + 1 },
    });
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
    const { order: _ignoredOrder, ...rest } = validated;
    void _ignoredOrder;
    const project = await prisma.project.update({ where: { id }, data: rest });
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
  const max = await prisma.project.aggregate({ _max: { order: true } });
  const copy = await prisma.project.create({
    data: { ...rest, title: `${src.title} (Copy)`, slug, featured: false, order: (max._max.order ?? -1) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true, project: copy };
}

/**
 * Persist a drag-and-drop order. `ids` must be the FULL ordered list
 * (dragging is disabled while searching) — positions are written 0..n.
 */
export async function reorderProjects(ids: string[]) {
  await requireAuth();
  const clean = ids.filter((id) => typeof id === "string").slice(0, 500);
  await prisma.$transaction(
    clean.map((id, index) => prisma.project.update({ where: { id }, data: { order: index } }))
  );
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

const ProjectImageUrlSchema = z.string().min(1).max(500);

export async function addProjectImages(projectId: string, urls: string[]) {
  await requireAuth();
  const clean = urls
    .map((u) => ProjectImageUrlSchema.parse(u.trim()))
    .filter(Boolean)
    .slice(0, 20);
  if (clean.length === 0) return { success: false };
  // Base on MAX order, not count — rows may have been deleted/reordered.
  const agg = await prisma.projectImage.aggregate({
    _max: { order: true },
    where: { projectId },
  });
  const base = (agg._max.order ?? -1) + 1;
  await prisma.projectImage.createMany({
    data: clean.map((url, i) => ({ projectId, url, order: base + i })),
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProjectImage(id: string) {
  await requireAuth();
  await prisma.projectImage.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function moveProjectImage(id: string, direction: "up" | "down") {
  await requireAuth();
  const item = await prisma.projectImage.findUnique({ where: { id } });
  if (!item) return { success: false };
  const list = await prisma.projectImage.findMany({
    where: { projectId: item.projectId },
    orderBy: { order: "asc" },
  });
  const idx = list.findIndex((x) => x.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return { success: false };
  const a = list[idx];
  const b = list[swapIdx];
  await prisma.$transaction([
    prisma.projectImage.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.projectImage.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

/**
 * Move the legacy single cover into the gallery as the FIRST (main) image,
 * then clear the legacy field so there is exactly one source of truth.
 */
export async function importLegacyCover(projectId: string) {
  await requireAuth();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { images: true },
  });
  if (!project?.coverImage) throw new Error("No legacy cover to import");
  await prisma.projectImage.create({
    data: { projectId, url: project.coverImage, order: -1 },
  });
  await prisma.project.update({
    where: { id: projectId },
    data: { coverImage: null },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}
