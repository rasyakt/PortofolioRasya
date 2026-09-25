import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/actions/projects";

function safeParseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  
  try {
    const projects = await getProjects(category);
    return NextResponse.json({
      success: true,
      count: projects.length,
      data: projects.map((p: Awaited<ReturnType<typeof getProjects>>[number]) => ({
        ...p,
        techStack: safeParseJsonArray(p.techStack),
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
