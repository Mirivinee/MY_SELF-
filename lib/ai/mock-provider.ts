import { profile } from "@/lib/content";
import { pickCannedTake } from "./canned-takes";
import type { AiProvider, ChatMessage, ChatReply, TakeRequest } from "./types";

function fallbackReply(lastMessage: string): ChatReply {
  const lower = lastMessage.toLowerCase();

  if (profile.twinBoundaries.mustNotDiscuss.some((topic) => lower.includes(topic))) {
    return {
      text: `I'll keep that one private — happy to talk about my projects or background instead!`,
      emotion: "serious",
    };
  }

  if (lower.includes("looking for") || lower.includes("job") || lower.includes("intern")) {
    return { text: profile.lookingFor, emotion: "happy" };
  }

  if (lower.includes("skill")) {
    return {
      text: `I mainly work with ${profile.skills.join(", ")} right now.`,
      emotion: "happy",
    };
  }

  if (lower.includes("name") || lower.includes("who are you")) {
    return { text: `I'm ${profile.name}!`, emotion: "happy" };
  }

  if (lower.includes("stud") || lower.includes("educat") || lower.includes("degree") || lower.includes("school") || lower.includes("college") || lower.includes("university")) {
    const edu = profile.education[0];
    return {
      text: edu
        ? `I'm doing my ${edu.degree} at ${edu.school}.`
        : `I don't have my education details filled in yet — ask me something else!`,
      emotion: "happy",
    };
  }

  if (lower.includes("role") || lower.includes("what do you do") || lower.includes("position")) {
    return { text: `I'm a ${profile.role}.`, emotion: "happy" };
  }

  if (lower.includes("where") || lower.includes("location") || lower.includes("from") || lower.includes("live")) {
    return { text: `I'm based in ${profile.location}.`, emotion: "happy" };
  }

  if (lower.includes("about") || lower.includes("tell me") || lower.includes("bio")) {
    return { text: profile.longBio, emotion: "happy" };
  }

  return {
    text: `I don't know that one — I'm running in mock mode right now, so I can only answer a handful of things like my skills, education, or what I'm looking for. For anything else, email me at ${profile.links.email}.`,
    emotion: "thinking",
  };
}

export class MockAiProvider implements AiProvider {
  readonly name = "mock";

  async chat(messages: ChatMessage[]): Promise<ChatReply> {
    const last = [...messages].reverse().find((m) => m.role === "user");
    return fallbackReply(last?.content ?? "");
  }

  async generateTake(request: TakeRequest): Promise<string> {
    return pickCannedTake(request.title);
  }
}
