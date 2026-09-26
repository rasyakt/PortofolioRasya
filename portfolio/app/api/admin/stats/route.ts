import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getStatsSnapshot } from "@/lib/admin-stats";

/** Protected live stats feed for the admin analytics page (polled). */
export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const snapshot = await getStatsSnapshot();
    return NextResponse.json(snapshot, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
