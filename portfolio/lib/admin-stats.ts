import { readFileSync } from "node:fs";
import { join } from "node:path";
import { readdir } from "node:fs/promises";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface StatsSnapshot {
  generatedAt: string;
  live: { viewsToday: number; eventsHour: number; errors24h: number; totalEvents: number };
  byType: { type: string; count: number }[];
  topPaths: { path: string; count: number }[];
  recent: { id: string; type: string; path: string; createdAt: string }[];
  topErrors: { message: string; count: number; lastSeen: string; source: string }[];
  content: { projects: number; certifications: number; experiences: number; skills: number };
  system: {
    node: string;
    platform: string;
    env: string;
    uptime: string;
    memoryMb: { rss: number; heap: number };
    nextVersion: string;
    prismaVersion: string;
    dbVersion: string;
    dbSizeMb: number;
    tables: { name: string; rows: number; sizeMb: number }[];
    media: { covers: number; badges: number; docs: number };
  };
}

const DAY = 24 * 60 * 60 * 1000;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatUptime(totalSeconds: number) {
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

async function countDir(dir: string): Promise<number> {
  try {
    const entries = await readdir(join(process.cwd(), "public", dir));
    return entries.filter((f) => !f.startsWith(".")).length;
  } catch {
    return 0;
  }
}

function nextVersion(): string {
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf-8")
    ) as { dependencies?: Record<string, string> };
    return (pkg.dependencies?.["next"] || "?").replace(/^[^\d]*/, "");
  } catch {
    return "?";
  }
}

export async function getStatsSnapshot(): Promise<StatsSnapshot> {
  const now = new Date();
  const today = startOfToday();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const dayAgo = new Date(now.getTime() - DAY);
  const weekAgo = new Date(now.getTime() - 7 * DAY);
  const monthAgo = new Date(now.getTime() - 30 * DAY);

  const [
    viewsToday,
    eventsHour,
    errors24h,
    totalEvents,
    byTypeGroups,
    recentRows,
    contentCounts,
  ] = await Promise.all([
    prisma.siteEvent.count({ where: { type: "page_view", createdAt: { gte: today } } }),
    prisma.siteEvent.count({ where: { createdAt: { gte: hourAgo } } }),
    prisma.errorLog.count({ where: { createdAt: { gte: dayAgo } } }),
    prisma.siteEvent.count(),
    prisma.siteEvent.groupBy({
      by: ["type"],
      where: { createdAt: { gte: monthAgo } },
      _count: { type: true },
    }),
    prisma.siteEvent.findMany({ orderBy: { createdAt: "desc" }, take: 15 }),
    Promise.all([
      prisma.project.count(),
      prisma.certification.count(),
      prisma.experience.count(),
      prisma.skill.count(),
    ]),
  ]);

  // Top paths + top errors aggregated in JS (TEXT columns can't GROUP BY on MySQL)
  const [pathRows, errorRows] = await Promise.all([
    prisma.siteEvent.findMany({
      where: { createdAt: { gte: weekAgo } },
      select: { path: true },
      take: 3000,
    }),
    prisma.errorLog.findMany({
      where: { createdAt: { gte: monthAgo } },
      select: { message: true, source: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
  ]);

  const pathCounts = new Map<string, number>();
  for (const r of pathRows) {
    pathCounts.set(r.path, (pathCounts.get(r.path) ?? 0) + 1);
  }
  const topPaths = [...pathCounts.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const errAgg = new Map<string, { count: number; lastSeen: Date; source: string }>();
  for (const r of errorRows) {
    const cur = errAgg.get(r.message);
    if (cur) {
      cur.count += 1;
      if (r.createdAt > cur.lastSeen) cur.lastSeen = r.createdAt;
    } else {
      errAgg.set(r.message, { count: 1, lastSeen: r.createdAt, source: r.source });
    }
  }
  const topErrors = [...errAgg.entries()]
    .map(([message, v]) => ({ message, ...v, lastSeen: v.lastSeen.toISOString() }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // System info
  const mem = process.memoryUsage();
  let dbVersion = "?";
  let dbSizeMb = 0;
  let tables: StatsSnapshot["system"]["tables"] = [];
  try {
    const v = await prisma.$queryRaw<{ v: string }[]>`SELECT VERSION() as v`;
    dbVersion = String(v[0]?.v ?? "?").split("-")[0];
    const info = await prisma.$queryRaw<
      { name: string; rowCount: number; bytes: number }[]
    >`SELECT table_name as name, table_rows as rowCount, (data_length + index_length) as bytes FROM information_schema.tables WHERE table_schema = DATABASE()`;
    tables = info
      .map((t) => ({
        name: String(t.name),
        rows: Number(t.rowCount ?? 0),
        sizeMb: Math.round((Number(t.bytes ?? 0) / 1024 / 1024) * 100) / 100,
      }))
      .sort((a, b) => b.sizeMb - a.sizeMb);
    dbSizeMb = Math.round(tables.reduce((s, t) => s + t.sizeMb, 0) * 100) / 100;
  } catch {
    /* ignore */
  }

  const [covers, badges, docs] = await Promise.all([
    countDir("covers"),
    countDir("badges"),
    countDir("docs"),
  ]);

  return {
    generatedAt: now.toISOString(),
    live: { viewsToday, eventsHour, errors24h, totalEvents },
    byType: byTypeGroups.map((g) => ({ type: g.type, count: g._count.type })),
    topPaths,
    recent: recentRows.map((r) => ({
      id: r.id,
      type: r.type,
      path: r.path,
      createdAt: r.createdAt.toISOString(),
    })),
    topErrors,
    content: {
      projects: contentCounts[0],
      certifications: contentCounts[1],
      experiences: contentCounts[2],
      skills: contentCounts[3],
    },
    system: {
      node: process.version,
      platform: `${process.platform} ${process.arch}`,
      env: process.env.NODE_ENV || "development",
      uptime: formatUptime(process.uptime()),
      memoryMb: {
        rss: Math.round(mem.rss / 1024 / 1024),
        heap: Math.round(mem.heapUsed / 1024 / 1024),
      },
      nextVersion: nextVersion(),
      prismaVersion: Prisma.prismaVersion.client,
      dbVersion,
      dbSizeMb,
      tables,
      media: { covers, badges, docs },
    },
  };
}
