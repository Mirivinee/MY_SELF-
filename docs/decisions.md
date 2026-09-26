# Decisions log

## 2026-09-26 — Phase 1 setup
- Stack: Next.js (App Router) + TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, npm.
- Theme: class-based dark mode (toggle + system preference), no extra theming dependency.
- Folder structure and content files scaffolded per project spec.

## Avatar approach — pending
Not yet decided. Will evaluate hosted real-time avatar APIs vs. open-source photo-to-talking-head vs.
browser-side 3D avatar once Phase 6 starts. Criteria: realism, latency (<2s to first speech), cost per
conversation, emotion control, ease of deployment.
