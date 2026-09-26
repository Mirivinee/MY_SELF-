"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import PlaceholderBadge from "@/components/ui/PlaceholderBadge";
import type { EducationItem } from "@/lib/content";

export default function EducationTimeline({ items }: { items: EducationItem[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  // One-time scroll reveal for the education entries: fade/slide up with a
  // stagger the first time the timeline enters the viewport, never re-triggering.
  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".education-timeline > *", { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const entries = gsap.utils.toArray<HTMLElement>(".education-timeline > *", list);
        if (entries.length === 0) return;

        gsap.set(entries, { opacity: 0, y: 32 });

        const trigger = ScrollTrigger.create({
          trigger: list,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(entries, {
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
    { scope: listRef }
  );

  if (items.length === 0) {
    return <p className="mt-3 text-sm text-muted">TODO</p>;
  }

  return (
    <ol
      ref={listRef}
      className="education-timeline mt-3 flex flex-col gap-6 border-l border-border pl-6"
    >
      {items.map((item, i) => {
        const placeholder = item.start === "TODO" || item.end === "TODO";
        return (
          <li key={i} className="relative">
            <span
              className={`absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full ${
                placeholder ? "bg-amber-500" : "bg-accent"
              }`}
            />
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">
                {item.degree} · {item.school}
              </p>
              {placeholder && <PlaceholderBadge />}
            </div>
            <p className="mt-1 text-sm text-muted">
              {item.start === "TODO" ? "Start: TODO" : item.start} –{" "}
              {item.end === "TODO" ? "End: TODO" : item.end}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
