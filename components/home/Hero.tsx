"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { Profile } from "@/lib/content";

export default function Hero({ profile }: { profile: Profile }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // One strong page-load moment: the hero items fade/slide in with a short
  // stagger on mount. Not scroll-triggered since this is the top of the page.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-item]", { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-hero-item]", rootRef.current);
        if (items.length === 0) return;

        gsap.set(items, { opacity: 0, y: 20 });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.09,
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="flex flex-col gap-6">
      <p data-hero-item className="text-sm font-medium text-accent">
        Hi, I&apos;m
      </p>
      <h1 data-hero-item className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {profile.name}
      </h1>
      <p data-hero-item className="text-sm text-muted">{profile.location}</p>
      <p data-hero-item className="max-w-xl text-lg text-muted">
        {profile.role} — {profile.shortBio}
      </p>
      <div data-hero-item className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/projects"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          View projects
        </Link>
        <Link
          href="/twin"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          Talk to my AI twin
        </Link>
      </div>
    </div>
  );
}
