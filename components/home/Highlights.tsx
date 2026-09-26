"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { Profile } from "@/lib/content";

export default function Highlights({ profile }: { profile: Profile }) {
  const gridRef = useRef<HTMLDivElement>(null);

  // One-time scroll reveal for the highlight cards: fade/slide up with a
  // stagger the first time the grid enters the viewport, never re-triggering.
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".highlights-grid > *", { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".highlights-grid > *", grid);
        if (cards.length === 0) return;

        gsap.set(cards, { opacity: 0, y: 32 });

        const trigger = ScrollTrigger.create({
          trigger: grid,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.12,
            }),
        });

        const handleLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", handleLoad);

        return () => {
          trigger.kill();
          window.removeEventListener("load", handleLoad);
        };
      });

      return () => mm.revert();
    },
    { scope: gridRef }
  );

  const items = [
    {
      label: "Education",
      value: profile.education[0]?.school,
      detail: profile.education[0]?.degree,
    },
    {
      label: "Top skills",
      value: profile.skills.join(", "),
    },
    {
      label: "Looking for",
      value: profile.lookingFor,
    },
  ];

  return (
    <div ref={gridRef} className="highlights-grid grid gap-6 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{item.label}</p>
          <p className="mt-2 font-medium">{item.value}</p>
          {item.detail && <p className="mt-1 text-sm text-muted">{item.detail}</p>}
        </div>
      ))}
    </div>
  );
}
