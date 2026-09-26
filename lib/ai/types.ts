import type { Emotion } from "@/lib/content";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatReply {
  text: string;
  emotion: Emotion;
}

export interface TakeRequest {
  kind: "project" | "certificate";
  title: string;
  description: string;
}

export interface AiProvider {
  /** Name shown in logs/errors, e.g. "anthropic" or "mock". */
  readonly name: string;
  chat(messages: ChatMessage[]): Promise<ChatReply>;
  generateTake(request: TakeRequest): Promise<string>;
}
