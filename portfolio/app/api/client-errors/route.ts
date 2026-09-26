import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

/** Public beacon for client-side errors (rate-limited, length-capped). */
export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    if (!checkRateLimit(`client-errors:${ip}`, 30, 60 * 1000)) {
      return new NextResponse(null, { status: 429 });
    }
    const body = await req.json().catch(() => null);
    const message = typeof body?.message === "string" ? body.message.slice(0, 1000) : null;
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }
    const rawPath = typeof body?.path === "string" ? body.path : "/";
    await prisma.errorLog.create({
      data: { message, path: rawPath.slice(0, 200), source: "client" },
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }
}
