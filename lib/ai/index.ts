import { AnthropicAiProvider } from "./anthropic-provider";
import { MockAiProvider } from "./mock-provider";
import type { AiProvider } from "./types";

let cached: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (cached) return cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  cached = apiKey ? new AnthropicAiProvider(apiKey) : new MockAiProvider();
  return cached;
}

export type { AiProvider, ChatMessage, ChatReply, TakeRequest } from "./types";
