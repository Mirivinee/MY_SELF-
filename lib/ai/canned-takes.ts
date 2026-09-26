/**
 * Fallback "AI take" one-liners, used whenever a real provider call fails
 * or isn't available. Picked deterministically from the title so the same
 * item always gets the same canned line within a session.
 */
export const CANNED_TAKES = [
  "Honestly? I'd poke at this one for hours if I had the time.",
  "This is the kind of thing that taught me more than any tutorial did.",
  "Small project, but I learned a surprising amount building it.",
];

export function pickCannedTake(title: string): string {
  return CANNED_TAKES[title.length % CANNED_TAKES.length];
}
