"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { Certificate } from "@/lib/content";

function isPlaceholder(cert: Certificate) {
  return (
    cert.issuer === "TODO" ||
    cert.year === "TODO" ||
    cert.description === "TODO" ||
    cert.linkedinUrl === "TODO"
  );
}

function PlaceholderBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 9v4M12 17h.01M10.29 3.86l-8.18 14.14A2 2 0 0 0 3.82 21h16.36a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
      Needs real data
    </span>
  );
}

function CertificateBody({ cert }: { cert: Certificate }) {
  const placeholder = isPlaceholder(cert);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
        <p className="font-medium">{cert.title}</p>
        {placeholder && <PlaceholderBadge />}
      </div>
      <p className="text-sm text-muted">
        {cert.issuer === "TODO" ? "Issuer: TODO" : cert.issuer} ·{" "}
        {cert.year === "TODO" ? "Year: TODO" : cert.year}
      </p>
      <p className="mt-1 text-sm text-muted">
        {cert.description === "TODO" ? "Description: TODO" : cert.description}
      </p>
      {cert.linkedinUrl === "TODO" && (
        <p className="mt-2 text-xs text-muted">
          No credential link yet — this row isn&apos;t clickable.
        </p>
      )}
    </div>
  );
}

export default function CertificatesList({ certificates }: { certificates: Certificate[] }) {
  const listRef = useRef<HTMLUListElement>(null);

  // One-time scroll reveal for the certificate rows: fade/slide up with a
  // stagger the first time the list enters the viewport, never re-triggering.
  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".certificates-list > *", { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>(".certificates-list > *", list);
        if (rows.length === 0) return;

        gsap.set(rows, { opacity: 0, y: 32 });

        const trigger = ScrollTrigger.create({
          trigger: list,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(rows, {
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

  if (certificates.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
        Certificates coming soon.
      </p>
    );
  }

  return (
    <ul
      ref={listRef}
      className="certificates-list flex flex-col divide-y divide-border rounded-xl border border-border"
    >
      {certificates.map((cert) => {
        const placeholder = isPlaceholder(cert);
        const linkable = cert.linkedinUrl !== "TODO";
        const rowClassName = placeholder
          ? "border-l-4 border-l-amber-500/60 bg-amber-500/5 p-6"
          : "p-6 transition-colors hover:bg-surface";

        return (
          <li key={cert.title}>
            {linkable ? (
              <a
                href={cert.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block ${rowClassName}`}
              >
                <CertificateBody cert={cert} />
              </a>
            ) : (
              <div className={rowClassName} aria-disabled="true">
                <CertificateBody cert={cert} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
