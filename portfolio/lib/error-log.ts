import { prisma } from "@/lib/prisma";

/** Best-effort server-side error recording. Never throws. */
export async function logServerError(message: string, path = "/") {
  try {
    const clean = String(message ?? "Unknown error").slice(0, 1000);
    await prisma.errorLog.create({
      data: { message: clean, path: String(path ?? "/").slice(0, 200), source: "server" },
    });
  } catch {
    /* ignore */
  }
}
