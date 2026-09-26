import PhotoAvatar from "./PhotoAvatar";
import type { AvatarProps } from "@/lib/avatar/types";

/**
 * No AVATAR_API_KEY-backed remote provider is wired up yet — that needs a
 * vendor decision (see docs/decisions.md) and a signup neither of which
 * this project does on its own. PhotoAvatar (the free, key-less fallback)
 * is the only implementation for now; swapping in a real provider later
 * means picking it here based on env, without touching any caller.
 */
export default function Avatar(props: AvatarProps) {
  return <PhotoAvatar {...props} />;
}
