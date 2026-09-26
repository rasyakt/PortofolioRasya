"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createSession, destroySession, verifyAdminCredentials } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  headline: z.string().min(1, "Headline is required").trim(),
  bio: z.string().min(1, "Bio is required").trim(),
  location: z.string().min(1, "Location is required").trim(),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").trim(),
  github: z.string().trim().url("Invalid GitHub URL"),
  linkedin: z.string().trim().url("Invalid LinkedIn URL"),
  portfolioUrl: z.string().trim().url("Invalid Portfolio URL"),
  cvUrl: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  isAvailable: z.boolean().default(true),
  availabilityText: z.string().min(1, "Availability text is required").trim(),
});

export async function getProfile() {
  const profile = await prisma.profileConfig.findFirst();
  return profile;
}

export async function updateProfile(data: z.infer<typeof ProfileSchema>) {
  await requireAuth();
  const validated = ProfileSchema.parse(data);
  const existing = await prisma.profileConfig.findFirst();
  const payload = {
    ...validated,
    cvUrl: validated.cvUrl || null,
    photoUrl: validated.photoUrl || null,
  };
  let profile;
  if (existing) {
    profile = await prisma.profileConfig.update({ where: { id: existing.id }, data: payload });
  } else {
    profile = await prisma.profileConfig.create({ data: payload });
  }
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/profile");
  return { success: true, profile };
}

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return "unknown";
  } catch {
    return "unknown";
  }
}

export async function loginAdmin(username: string, password: string) {
  const ip = await clientIp();
  const clean = username.trim().toLowerCase().slice(0, 64);
  if (!checkRateLimit(`login:${clean}:${ip}`, 5, 10 * 60 * 1000)) {
    return { success: false, error: "Too many attempts — try again in 10 minutes." };
  }
  const user = await verifyAdminCredentials(username, password);
  if (!user) {
    return { success: false, error: "Invalid credentials" };
  }
  await createSession(user.id);
  return { success: true };
}

export async function logoutAdmin() {
  await destroySession();
  redirect("/admin/login");
}

const PasswordSchema = z.object({
  current: z.string().min(1, "Current password is required"),
  next: z.string().min(8, "New password must be at least 8 characters"),
});

export async function changeAdminPassword(current: string, next: string) {
  const session = await requireAuth();
  const validated = PasswordSchema.parse({ current, next });
  const user = await prisma.adminUser.findUnique({ where: { id: session.id } });
  if (!user) throw new Error("User not found");
  const bcrypt = (await import("bcryptjs")).default;
  const valid = await bcrypt.compare(validated.current, user.password);
  if (!valid) throw new Error("Current password is incorrect");
  const hash = await bcrypt.hash(validated.next, 12);
  await prisma.adminUser.update({ where: { id: user.id }, data: { password: hash } });
  return { success: true };
}
