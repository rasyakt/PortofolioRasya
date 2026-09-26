import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { logServerError } from "@/lib/error-log";

const ALLOWED_TYPES = new Set([
  "page_view",
  "cv_download",
  "recruiter_open",
  "project_open",
  "contact_click",
]);

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    if (!checkRateLimit(`events:${ip}`, 120, 60 * 1000)) {
      return new NextResponse(null, { status: 429 });
    }
    const body = await req.json().catch(() => null);
    const type = body?.type;
    const rawPath = typeof body?.path === "string" ? body.path : "/";
    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }
    await prisma.siteEvent.create({
      data: { type, path: rawPath.slice(0, 200) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    await logServerError(err instanceof Error ? err.message : "events API failed", "/api/events");
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
