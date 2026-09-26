import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomUUID } from "node:crypto";
import { requireAuth } from "@/lib/auth";
import { logServerError } from "@/lib/error-log";

const ALLOWED_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_FOLDERS = new Set(["covers", "badges", "docs"]);

/** Verify the file's magic bytes match its claimed MIME type. */
function sniffMatches(buffer: Buffer, mime: string): boolean {
  const b = buffer;
  const startsWith = (sig: number[]) => sig.every((byte, i) => b[i] === byte);
  const textAt = (offset: number, text: string) =>
    b.slice(offset, offset + text.length).toString("ascii") === text;
  switch (mime) {
    case "image/png":
      return startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/jpeg":
      return startsWith([0xff, 0xd8, 0xff]);
    case "image/gif":
      return textAt(0, "GIF87a") || textAt(0, "GIF89a");
    case "image/webp":
      return textAt(0, "RIFF") && textAt(8, "WEBP");
    case "application/pdf":
      return textAt(0, "%PDF");
    default:
      return false;
  }
}

/** Admin-only file upload. Images go to covers/badges, PDFs to docs. */
export async function POST(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const rawFolder = form.get("folder");
    const folder = typeof rawFolder === "string" && ALLOWED_FOLDERS.has(rawFolder)
      ? rawFolder
      : "covers";
    const ext = ALLOWED_MIME[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Only PNG, JPEG, WebP, GIF, or PDF files are allowed" },
        { status: 400 }
      );
    }
    if (folder === "docs" && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Docs folder accepts PDF only" }, { status: 400 });
    }
    if (folder !== "docs" && file.type === "application/pdf") {
      return NextResponse.json({ error: "PDF files must go to the docs folder" }, { status: 400 });
    }
    const limit = file.type === "application/pdf" ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
    if (file.size === 0 || file.size > limit) {
      return NextResponse.json(
        { error: `File must be between 1 byte and ${limit / 1024 / 1024} MB` },
        { status: 400 }
      );
    }

    const dir = join(process.cwd(), "public", folder);
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!sniffMatches(bytes, file.type)) {
      return NextResponse.json(
        { error: "File content does not match its type" },
        { status: 400 }
      );
    }
    const prefix = folder === "badges" ? "badge" : folder === "docs" ? "doc" : "cover";
    const filename = `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}${ext || extname((file as File).name || "")}`;
    await writeFile(join(dir, filename), bytes);

    return NextResponse.json({ url: `/${folder}/${filename}` });
  } catch (err: unknown) {
    await logServerError(err instanceof Error ? err.message : "upload API failed", "/api/upload");
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
