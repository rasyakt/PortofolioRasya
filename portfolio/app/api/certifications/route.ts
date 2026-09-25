import { NextRequest, NextResponse } from "next/server";
import { getCertifications } from "@/actions/certifications";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;

  try {
    const certs = await getCertifications(type);
    return NextResponse.json({
      success: true,
      count: certs.length,
      data: certs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
