"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { profile } from "@/lib/content";
import type { Emotion } from "@/lib/content";

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
  emotion?: Emotion;
}

const MAX_LENGTH = 500;

export default function ChatPanel() {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      role: "assistant",
      content: `Hi, I'm an AI twin of ${profile.name} — not the real person, just a chatbot grounded in their public info. Ask me anything!`,
      emotion: profile.defaultEmotion,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: DisplayMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong.");
      }

      const reply = (await res.json()) as { text: string; emotion: Emotion };
      setMessages((prev) => [...prev, { role: "assistant", content: reply.text, emotion: reply.emotion }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with the AI twin"
        className="flex max-h-[60vh] min-h-[320px] flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-surface p-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
              m.role === "user"
                ? "self-end bg-foreground text-background"
                : "self-start bg-background text-foreground"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start rounded-2xl bg-background px-4 py-2 text-sm text-muted">
            Thinking…
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <label htmlFor="twin-input" className="sr-only">
          Message the AI twin
        </label>
        <input
          id="twin-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="Ask me something…"
          maxLength={MAX_LENGTH}
          disabled={loading}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus-visible:border-accent"
        />
        <button
          type="submit"
          disabled={loading || input.trim().length === 0}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
