export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
}

export interface TtsProvider {
  readonly name: string;
  readonly supported: boolean;
  speak(text: string, options?: SpeakOptions): void;
  cancel(): void;
}
