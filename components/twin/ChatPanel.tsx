"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { profile } from "@/lib/content";
import type { Emotion } from "@/lib/content";
import { getTtsProvider } from "@/lib/voice";
import MicButton from "./MicButton";
import Captions from "./Captions";
import Avatar from "./Avatar";

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
  const [muted, setMuted] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const [captionVisible, setCaptionVisible] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [emotion, setEmotion] = useState<Emotion>(profile.defaultEmotion);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [ttsSupported, setTtsSupported] = useState(false);

  useEffect(() => {
    // One-time browser-capability check — see the matching comment in
    // MicButton.tsx for why this belongs in an effect, not render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTtsSupported(getTtsProvider().supported);
    return () => {
      getTtsProvider().cancel();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function speak(text: string) {
    if (muted) return;
    const tts = getTtsProvider();
    if (!tts.supported) return;
    tts.speak(text, {
      onStart: () => {
        setCaptionText(text);
        setCaptionVisible(true);
        setSpeaking(true);
      },
      onEnd: () => {
        setCaptionVisible(false);
        setSpeaking(false);
      },
    });
  }

  function toggleMute() {
    setMuted((prev) => {
      const next = !prev;
      if (next) {
        getTtsProvider().cancel();
        setCaptionVisible(false);
        setSpeaking(false);
      }
      return next;
    });
  }

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
      setEmotion(reply.emotion);
      speak(reply.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Avatar emotion={emotion} speaking={speaking} />
      <Captions text={captionText} visible={captionVisible} />

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

      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
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
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus-visible:border-accent"
        />
        <MicButton onTranscript={(text) => setInput(text.slice(0, MAX_LENGTH))} disabled={loading} />
        {ttsSupported && (
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label={muted ? "Unmute spoken replies" : "Mute spoken replies"}
            title={muted ? "Unmute spoken replies" : "Mute spoken replies"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="M23 9l-6 6M17 9l6 6" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        )}
        <button
          type="submit"
          disabled={loading || input.trim().length === 0}
          className="shrink-0 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
