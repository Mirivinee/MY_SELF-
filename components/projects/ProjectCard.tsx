"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { Project } from "@/lib/content";

const MAX_TILT_DEG = 9;

export default function ProjectCard({ project }: { project: Project }) {
  const [activeShot, setActiveShot] = useState(0);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const shotRefs = useRef<(HTMLImageElement | null)[]>([]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (!hovered || project.screenshots.length < 2) return;
    if (reducedMotionRef.current) return;

    const id = setInterval(() => {
      setActiveShot((i) => (i + 1) % project.screenshots.length);
    }, 1400);
    return () => clearInterval(id);
  }, [hovered, project.screenshots.length]);

  function handleEnter() {
    setHovered(true);
  }

  function handleLeave() {
    setHovered(false);
    setActiveShot(0);
  }

  // 3D tilt on hover, driven by quickTo, tracked via matchMedia so it
  // stays in sync with prefers-reduced-motion and reverts on unmount.
  useGSAP(
    () => {
      const card = cardRef.current;
      const tilt = tiltRef.current;
      if (!card || !tilt) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        reducedMotionRef.current = true;
        gsap.set(tilt, { rotateX: 0, rotateY: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        reducedMotionRef.current = false;

        const setRotateX = gsap.quickTo(tilt, "rotateX", {
          duration: 0.5,
          ease: "power3",
        });
        const setRotateY = gsap.quickTo(tilt, "rotateY", {
          duration: 0.5,
          ease: "power3",
        });

        function handleMouseMove(e: MouseEvent) {
          const rect = card!.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          setRotateY(px * MAX_TILT_DEG * 2);
          setRotateX(-py * MAX_TILT_DEG * 2);
        }

        function handleMouseLeaveTilt() {
          gsap.to(tilt!, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.4)",
            overwrite: true,
          });
        }

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeaveTilt);

        return () => {
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseleave", handleMouseLeaveTilt);
        };
      });

      return () => mm.revert();
    },
    { scope: cardRef }
  );

  // Screenshot crossfade, animated instead of snapped, gated by the same
  // reduced-motion signal captured above.
  useGSAP(
    () => {
      const targets = shotRefs.current.filter(Boolean) as HTMLImageElement[];
      if (targets.length === 0) return;

      if (reducedMotionRef.current) {
        targets.forEach((el, i) => gsap.set(el, { opacity: i === activeShot ? 1 : 0 }));
        return;
      }

      targets.forEach((el, i) => {
        gsap.to(el, {
          opacity: i === activeShot ? 1 : 0,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    },
    { scope: cardRef, dependencies: [activeShot] }
  );

  return (
    <a
      ref={cardRef}
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="project-card block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent"
      style={{ perspective: "800px" }}
    >
      <div ref={tiltRef} className="project-card-tilt" style={{ transformStyle: "preserve-3d" }}>
        <div className="relative aspect-[8/5] overflow-hidden bg-black/5">
          {project.screenshots.map((src, i) => (
            <Image
              key={src}
              ref={(el) => {
                shotRefs.current[i] = el;
              }}
              src={src}
              alt={`${project.title} screenshot ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="project-card-shot object-cover"
              style={{ opacity: i === 0 ? 1 : 0 }}
              priority={i === 0}
            />
          ))}
          {project.screenshots.length > 1 && (
            <div
              aria-hidden="true"
              className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
            >
              {project.screenshots.map((src, i) => (
                <span
                  key={src}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === activeShot ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-6">
          <h2 className="line-clamp-1 font-medium">{project.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{project.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
            {project.tech.map((t) => (
              <li key={t} className="rounded-full border border-border px-2 py-1">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </a>
  );
}
