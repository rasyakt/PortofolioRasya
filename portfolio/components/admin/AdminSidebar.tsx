"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/actions/profile";
import {
  LayoutDashboard, FolderOpen, Award, User, LogOut, Terminal, ExternalLink,
} from "lucide-react";

const NAV = [
  { icon: <LayoutDashboard size={16} />, label: "Dashboard", href: "/admin" },
  { icon: <FolderOpen size={16} />, label: "Projects", href: "/admin/projects" },
  { icon: <Award size={16} />, label: "Certifications", href: "/admin/certifications" },
  { icon: <User size={16} />, label: "Profile", href: "/admin/profile" },
];

export default function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar w-56 shrink-0 flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2 pt-2">
        <div
          className="p-1.5 rounded-lg"
          style={{ background: "var(--accent-muted)", border: "1px solid var(--accent-border)" }}
        >
          <Terminal size={14} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
            CMS
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {username}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
        <a
          href="/"
          target="_blank"
          className="admin-nav-item"
          style={{ fontSize: "13px" }}
        >
          <ExternalLink size={14} /> View Site
        </a>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="admin-nav-item w-full"
            style={{ color: "#f87171" }}
          >
            <LogOut size={14} /> Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
