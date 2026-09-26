import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function OgImage() {
  const [profile, projectCount, hkiCount] = await Promise.all([
    prisma.profileConfig.findFirst().catch(() => null),
    prisma.project.count().catch(() => 0),
    prisma.certification.count({ where: { type: "hki" } }).catch(() => 0),
  ]);

  const name = profile?.name || "Rasya Syahreza Maulana Zen";
  const parts = name.split(" ").filter(Boolean);
  const mid = Math.max(1, Math.ceil(parts.length / 2));
  const line1 = parts.slice(0, mid).join(" ");
  const line2 = parts.slice(mid).join(" ");
  const roles = (profile?.headline || "Fullstack Developer | AI Engineer | CTO at BotHax")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0b",
          color: "#fafafa",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "10px",
            backgroundColor: "#10b981",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 4,
            color: "#71717a",
            marginBottom: 24,
          }}
        >
          RASYA.DEV — PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
          <div>{line1}</div>
          {line2 ? <div>{line2}</div> : null}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#a1a1aa",
            marginTop: 28,
          }}
        >
          {roles.map((r, i) => (
            <span key={i} style={{ display: "flex" }}>
              {i > 0 ? <span style={{ margin: "0 16px" }}>·</span> : null}
              <span style={i === roles.length - 1 ? { color: "#10b981" } : undefined}>
                {r}
              </span>
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#71717a",
            marginTop: 20,
          }}
        >
          {projectCount}+ production projects&nbsp;&nbsp;·&nbsp;&nbsp;{hkiCount}× HKI Kemenkumham
        </div>
      </div>
    ),
    { ...size }
  );
}
