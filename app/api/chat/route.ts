import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import { isRateLimited, clientKeyFrom } from "@/lib/ai/rate-limit";
import type { ChatMessage } from "@/lib/ai/types";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 12;

function isValidMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as { role?: unknown; content?: unknown };
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.length > 0 &&
    content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(request: Request) {
  if (isRateLimited(clientKeyFrom(request))) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages must be a non-empty array." }, { status: 400 });
  }
  if (messages.length > MAX_HISTORY) {
    return NextResponse.json(
      { error: `messages must contain at most ${MAX_HISTORY} entries.` },
      { status: 400 },
    );
  }
  if (!messages.every(isValidMessage)) {
    return NextResponse.json(
      {
        error: `Each message needs role "user"/"assistant" and content up to ${MAX_MESSAGE_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  try {
    const provider = getAiProvider();
    const reply = await provider.chat(messages as ChatMessage[]);
    return NextResponse.json(reply);
  } catch (error) {
    console.error("[api/chat] provider error:", error);
    return NextResponse.json(
      { error: "The twin couldn't come up with a reply. Please try again." },
      { status: 502 },
    );
  }
}
