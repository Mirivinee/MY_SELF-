import { BrowserTtsProvider } from "./browser-tts-provider";
import type { TtsProvider } from "./types";

let cached: TtsProvider | null = null;

/**
 * Browser speechSynthesis is the only implementation right now — it's free
 * and needs no signup. A remote, higher-quality provider (e.g. a
 * voice-cloning TTS service, gated by TTS_API_KEY) can be added later
 * behind this same interface without touching any caller.
 */
export function getTtsProvider(): TtsProvider {
  if (cached) return cached;
  cached = new BrowserTtsProvider();
  return cached;
}

export type { TtsProvider, SpeakOptions } from "./types";
