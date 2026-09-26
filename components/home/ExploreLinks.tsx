"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const links = [
  { href: "/projects", label: "Projects", description: "Things I've built, with links to the code." },
  { href: "/certificates", label: "Certificates", description: "Courses and programs I've completed." },
  { href: "/about", label: "About", description: "Background, skills, and education." },
  { href: "/contact", label: "Contact", description: "Email, GitHub, LinkedIn, and my resume." },
  { href: "/twin", label: "AI Twin", description: "Ask an AI version of me about myself." },
];

export default function ExploreLinks() {
  const gridRef = useRef<HTMLDivElement>(null);

  // One-time scroll reveal for the explore cards: fade/slide up with a
  // stagger the first time the grid enters the viewport, never re-triggering.
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".explore-grid > *", { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".explore-grid > *", grid);
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

  return (
    <div ref={gridRef} className="explore-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-xl border border-border p-5 transition-colors hover:border-accent hover:bg-surface"
        >
          <p className="font-medium">{link.label}</p>
          <p className="mt-1 text-sm text-muted">{link.description}</p>
        </Link>
      ))}
    </div>
  );
}
