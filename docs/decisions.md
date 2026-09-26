# Decisions log

## 2026-09-26 — Phase 1 setup
- Stack: Next.js (App Router) + TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, npm.
- Theme: class-based dark mode (toggle + system preference), no extra theming dependency.
- Folder structure and content files scaffolded per project spec.

## Avatar approach — comparison (2026-09-26, Phase 6)

Still **not decided** — this is a comparison to inform the choice, not a recommendation. Pricing,
rate limits, and model quality for all of these change often; re-check the vendor's current pricing
page and terms before committing to one, especially before writing a credit card number down anywhere.

The free fallback (photo + CSS/GSAP idle animation, emotion-colored ring, TTS-driven speaking glow)
is built and live behind the `AvatarProvider` interface in `lib/avatar/` — see `components/twin/PhotoAvatar.tsx`.
Everything below is an option to swap in *instead of* that fallback, not a requirement to use one.

| Option | Realism | Latency to first speech | Cost shape | Emotion control | Deployment effort |
|---|---|---|---|---|---|
| **D-ID** (Live Streaming / Clips API) | High — photo-realistic talking head, real lip-sync | Streaming API, sub-2s achievable but needs a persistent connection (WebRTC) set up correctly | Per-minute/credit-based; has a limited free tier, paid plans scale with usage | Some expression/style control via their newer "Agents" product; base API is mostly lip-sync, not full emotion range | Needs a server-side session token flow + client WebRTC handling; moderate integration work |
| **HeyGen** (Streaming Avatar API) | High — polished, widely used for marketing/training avatars | Similar streaming-session model to D-ID, sub-2s achievable | Credit/minute-based; historically pricier tiers for real-time streaming vs. async video generation | Limited live emotion range; better suited to a fairly neutral presenter style | Comparable integration effort to D-ID (session + WebRTC); good docs, still a real build |
| **Simli** | Medium-high, optimized specifically for low-latency real-time avatars | Built for sub-second/low-latency use cases — likely the fastest of the three hosted options | Usage-based, positions itself as cheaper/faster than D-ID/HeyGen for real-time use | Basic — primarily lip-sync-focused like the others | Simplest of the three hosted APIs to integrate for a real-time use case, per their own positioning |
| **Open-source (SadTalker / LivePortrait / MuseTalk / Wav2Lip)** | Varies widely by model and how much tuning goes in; can look uncanny without work | No network latency, but needs real GPU inference time per frame/clip — not naturally "real-time chat" fast without a beefy GPU | Free to run, but needs a GPU server (rented GPU instance is an ongoing cost, not a signup/vendor lock-in) | Depends entirely on the model/pipeline; some support driving expression from an audio or emotion signal, some don't | Highest effort: self-hosted inference server, model weights, GPU provisioning, no managed SDK |
| **Browser-side free fallback (built)** | Low — it's the real photo with CSS animation, not a generated talking head | Instant — no network round trip beyond the LLM/TTS calls already happening | $0, no signup | Ring color + speaking glow only, no real facial expression | Done — already live behind `AvatarProvider` |

### What to weigh
- The three hosted APIs (D-ID, HeyGen, Simli) all require **an account, an API key, and a paid plan** for
  any real usage beyond a trial tier — none of this gets set up without your go-ahead per the project rules.
- Open-source options avoid vendor lock-in and per-minute billing but trade that for GPU hosting cost and
  real engineering time to get lip-sync quality that doesn't look worse than the hosted options.
- The free fallback is genuinely usable today with zero cost and zero setup, just not a "talking face" —
  it's an animated photo, which may be enough depending on how important photorealism is to the goal.
