import { getStatsSnapshot } from "@/lib/admin-stats";
import AnalyticsLive from "@/components/admin/AnalyticsLive";

export default async function AdminAnalyticsPage() {
  const initial = await getStatsSnapshot();

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <p className="section-label mb-1">Developer Tools</p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Analytics & System
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Live traffic, top errors, and environment detail.
        </p>
      </div>

      <AnalyticsLive initial={initial} />
    </div>
  );
}
