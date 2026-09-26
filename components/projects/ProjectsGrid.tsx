"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/content";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  // One-time scroll reveal for the cards: fade/slide up with a stagger the
  // first time the grid enters the viewport, never re-triggering on scroll back up.
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".project-card", { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card", grid);
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

  if (projects.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
        Projects coming soon.
      </p>
    );
  }

  return (
    <div ref={gridRef} className="projects-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
