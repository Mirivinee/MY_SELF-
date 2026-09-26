"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const GROUP_ORDER = ["Languages", "Web", "Databases", "Other"] as const;

const SKILL_GROUPS: Record<string, (typeof GROUP_ORDER)[number]> = {
  Python: "Languages",
  "HTML/CSS (Basic)": "Web",
  SQLite: "Databases",
};

export default function SkillsGrouped({ skills }: { skills: string[] }) {
  const groupsRef = useRef<HTMLDivElement>(null);

  // One-time scroll reveal for the skill group blocks: fade/slide up with a
  // stagger the first time the grid enters the viewport, never re-triggering.
  useGSAP(
    () => {
      const groupsEl = groupsRef.current;
      if (!groupsEl) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".skills-groups > *", { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const groups = gsap.utils.toArray<HTMLElement>(".skills-groups > *", groupsEl);
        if (groups.length === 0) return;

        gsap.set(groups, { opacity: 0, y: 32 });

        const trigger = ScrollTrigger.create({
          trigger: groupsEl,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(groups, {
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
    { scope: groupsRef }
  );

  if (skills.length === 0) {
    return <p className="mt-3 text-sm text-muted">TODO</p>;
  }

  const grouped = new Map<string, string[]>();
  for (const skill of skills) {
    const group = SKILL_GROUPS[skill] ?? "Other";
    grouped.set(group, [...(grouped.get(group) ?? []), skill]);
  }

  const groups = GROUP_ORDER.filter((g) => grouped.has(g));

  return (
    <div ref={groupsRef} className="skills-groups mt-3 flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group}>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{group}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {grouped.get(group)!.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-border px-3 py-1 text-sm"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
