"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/actions/profile";
import { Terminal, Eye, EyeOff, Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await loginAdmin(username, password);
    if (result.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center grid-bg"
      style={{ background: "var(--bg-base)" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: "var(--accent-muted)", border: "1px solid var(--accent-border)" }}
          >
            <Terminal size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Portfolio CMS
            </p>
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              Admin Access
            </p>
          </div>
        </div>

        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Sign in
        </h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          Default: <span className="font-mono">rasya / admin123</span>
        </p>

        {error && (
          <div
            className="p-3 rounded-lg mb-4 text-xs"
            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Username
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                className="input-base"
                style={{ paddingLeft: "36px" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="rasya"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                type={showPw ? "text" : "password"}
                className="input-base"
                style={{ paddingLeft: "36px", paddingRight: "40px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full justify-center mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="link-hover">← Back to portfolio</Link>
        </p>
      </div>
    </div>
  );
}
