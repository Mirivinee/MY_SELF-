import Anthropic from "@anthropic-ai/sdk";
import { profile } from "@/lib/content";
import { buildTwinSystemPrompt } from "./system-prompt";
import { pickCannedTake } from "./canned-takes";
import type { AiProvider, ChatMessage, ChatReply, TakeRequest } from "./types";

const MODEL = "claude-sonnet-4-5";

function parseChatReply(raw: string): ChatReply {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.text === "string" && typeof parsed.emotion === "string") {
      return { text: parsed.text, emotion: parsed.emotion };
    }
  } catch {
    // fall through to plain-text fallback below
  }
  return { text: raw.trim(), emotion: "neutral" };
}

export class AnthropicAiProvider implements AiProvider {
  readonly name = "anthropic";
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async chat(messages: ChatMessage[]): Promise<ChatReply> {
    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: buildTwinSystemPrompt(),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const block = response.content.find((c) => c.type === "text");
    if (!block || block.type !== "text") {
      return { text: "Sorry, I couldn't come up with a reply just now.", emotion: "neutral" };
    }
    return parseChatReply(block.text);
  }

  async generateTake(request: TakeRequest): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: MODEL,
        max_tokens: 80,
        system: `You are writing a single short, playful, never-mean one-liner comment (max 20 words) as ${profile.name}'s AI about their own ${request.kind}. Never invent details beyond what's given. Respond with plain text only, no quotes.`,
        messages: [
          {
            role: "user",
            content: `${request.kind}: "${request.title}" — ${request.description}`,
          },
        ],
      });
      const block = response.content.find((c) => c.type === "text");
      const text = block && block.type === "text" ? block.text.trim() : "";
      return text || pickCannedTake(request.title);
    } catch {
      return pickCannedTake(request.title);
    }
  }
}
