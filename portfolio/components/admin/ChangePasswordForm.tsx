"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { changeAdminPassword } from "@/actions/profile";
import { toast } from "../ui/Toaster";

/** Self-service password rotation for the admin account. */
export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await changeAdminPassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      toast("Password changed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string
  ) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="input-base"
          style={{ paddingRight: "40px" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          autoComplete={label.includes("Current") ? "current-password" : "new-password"}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide passwords" : "Show passwords"}
          className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={submit} className="mt-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound size={15} style={{ color: "var(--accent)" }} />
        <h2 className="text-base font-semibold t-primary">Change Password</h2>
      </div>

      {error && (
        <div
          className="p-3 rounded-lg mb-4 text-xs"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
        >
          {error}
        </div>
      )}

      <div className="card p-5 space-y-4">
        {field("Current password", current, setCurrent, "••••••••")}
        {field("New password (min 8 characters)", next, setNext, "••••••••")}
        {field("Confirm new password", confirm, setConfirm, "••••••••")}
        <button type="submit" className="btn btn-secondary" disabled={saving} style={{ fontSize: "13px" }}>
          {saving ? "Saving..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}
