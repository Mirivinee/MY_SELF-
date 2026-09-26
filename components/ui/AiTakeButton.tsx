"use client";

import { useState } from "react";
import { pickCannedTake } from "@/lib/ai/canned-takes";

export default function AiTakeButton({
  kind,
  title,
  description,
}: {
  kind: "project" | "certificate";
  title: string;
  description: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [take, setTake] = useState("");

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (state !== "idle") return;

    setState("loading");
    try {
      const res = await fetch("/api/ai-take", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, title, description }),
      });
      const body = await res.json().catch(() => null);
      setTake(body?.text ?? pickCannedTake(title));
    } catch {
      setTake(pickCannedTake(title));
    } finally {
      setState("done");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-2 rounded-lg bg-accent/10 px-3 py-2 text-xs italic text-foreground">
        &ldquo;{take}&rdquo;
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      className="mt-2 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-foreground disabled:opacity-60"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
      </svg>
      {state === "loading" ? "Thinking…" : "AI take"}
    </button>
  );
}
