import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex h-screen" style={{ background: "var(--bg-base)" }}>
      <AdminSidebar username={session.username} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
