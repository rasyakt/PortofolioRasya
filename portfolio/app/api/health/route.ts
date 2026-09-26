import { NextResponse } from "next/server";

/** Liveness probe for Docker healthchecks and tunnel monitors. */
export async function GET() {
  return NextResponse.json(
    { ok: true, service: "portfolio", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
