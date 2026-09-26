"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "../ui/Toaster";

/**
 * Two-step delete button: first click arms ("Sure?"), second click
 * executes. Auto-disarms after 3 seconds. No modal needed.
 */
export default function DeleteButton({
  onDelete,
  itemName,
}: {
  onDelete: () => Promise<unknown>;
  itemName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const click = () => {
    if (!confirming) {
      setConfirming(true);
      timer.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    startTransition(async () => {
      try {
        await onDelete();
        toast(`${itemName} deleted`);
      } catch {
        toast(`Failed to delete ${itemName.toLowerCase()}`, "error");
      } finally {
        setConfirming(false);
      }
    });
  };

  return (
    <button
      onClick={click}
      disabled={pending}
      title={confirming ? "Click again to confirm delete" : "Delete"}
      className="p-2 rounded-lg transition-all cursor-pointer bg-transparent border-none"
      style={{ color: confirming ? "#f87171" : "var(--text-muted)", opacity: pending ? 0.5 : 1 }}
    >
      {confirming ? <AlertTriangle size={13} /> : <Trash2 size={13} />}
    </button>
  );
}
