import type { ComponentType } from "react";
import type { Emotion } from "@/lib/content";

export interface AvatarProps {
  emotion: Emotion;
  speaking: boolean;
  /** 0-1 amplitude; populated by a future provider with real audio analysis. */
  audioLevel?: number;
}

export type AvatarComponentType = ComponentType<AvatarProps>;
