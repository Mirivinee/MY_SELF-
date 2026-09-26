import type { SpeakOptions, TtsProvider } from "./types";

export class BrowserTtsProvider implements TtsProvider {
  readonly name = "browser";

  get supported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  speak(text: string, options?: SpeakOptions): void {
    if (!this.supported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) {
      utterance.onend = options.onEnd;
      utterance.onerror = options.onEnd;
    }
    window.speechSynthesis.speak(utterance);
  }

  cancel(): void {
    if (this.supported) window.speechSynthesis.cancel();
  }
}
