"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function clearErrorLogs() {
  await requireAuth();
  await prisma.errorLog.deleteMany();
  revalidatePath("/admin/analytics");
  return { success: true };
}
