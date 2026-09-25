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

export async function createProject(data: z.infer<typeof ProjectSchema>) {
  await requireAuth();
  const validated = ProjectSchema.parse(data);
  const project = await prisma.project.create({ data: validated });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true, project };
}

export async function updateProject(id: string, data: z.infer<typeof ProjectSchema>) {
  await requireAuth();
  const validated = ProjectSchema.parse(data);
  const project = await prisma.project.update({ where: { id }, data: validated });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true, project };
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
