"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/lib/content";
import type { AvatarProps } from "@/lib/avatar/types";

const EMOTION_RING: Record<string, string> = {
  happy: "border-accent",
  thinking: "border-violet-400",
  surprised: "border-amber-500",
  neutral: "border-border",
  laughing: "border-emerald-500",
  serious: "border-muted",
};

const PHOTO_SRC = "/images/avatar-source.webp";
const SPEAK_GLOW = "0 0 0 8px rgba(37, 99, 235, 0.35)";
const NO_GLOW = "0 0 0 0 rgba(37, 99, 235, 0)";

export default function PhotoAvatar({ emotion, speaking }: AvatarProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  // Idle breathing, always running regardless of emotion/speaking state.
  useGSAP(
    () => {
      const photo = photoRef.current;
      if (!photo) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(photo, {
          scale: 1.015,
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  // Speaking cue: a pulsing glow ring. Browser TTS doesn't expose a real
  // audio waveform, so this is a rhythmic stand-in rather than true
  // amplitude-driven mouth movement — the audioLevel prop is here for a
  // future provider that can supply real analysis.
  useGSAP(
    () => {
      const photo = photoRef.current;
      if (!photo) return;

      if (!speaking) {
        gsap.set(photo, { boxShadow: NO_GLOW });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(photo, {
          boxShadow: SPEAK_GLOW,
          duration: 0.35,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        return () => tween.kill();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(photo, { boxShadow: SPEAK_GLOW });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [speaking] }
  );

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-3">
      <div
        ref={photoRef}
        className={`h-40 w-40 overflow-hidden rounded-full border-4 bg-surface transition-colors ${
          EMOTION_RING[emotion] ?? "border-border"
        }`}
      >
        {!photoFailed ? (
          // eslint-disable-next-line @next/next/no-img-element -- optional local asset, must tolerate a 404 gracefully
          <img
            src={PHOTO_SRC}
            alt={`${profile.name}'s AI twin avatar`}
            onError={() => setPhotoFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-4xl font-semibold text-muted"
          >
            ?
          </div>
        )}
      </div>
      {photoFailed && (
        <p className="max-w-[12rem] text-center text-xs text-muted">
          No avatar photo published yet.
        </p>
      )}
    </div>
  );
}
