# CLAUDE.md: Portfolio + AI Digital Twin

This file gives Claude the context for this project. Read it fully before making changes.

## Project vision

A professional, multi-page personal portfolio website with an **AI digital twin** of me.
The twin has my face, answers visitors' questions about me, and talks like a real person:
lip movement synced to speech, facial emotions, and natural reactions.

Two parts, built in order:
1. **Portfolio website**: official, organized, clean. Not everything on a single page.
2. **AI digital twin**: an interactive talking avatar made from my photo (I will provide the image).

> Status: planning. Do not build features beyond the current phase unless I ask.

## About me (fill in; the twin's knowledge comes from here)

- Name: TODO
- Role / studies: TODO
- Short bio: TODO
- Skills: TODO
- Projects (title, description, tech, GitHub link, 2–4 screenshots): TODO
- Certificates (title, issuer, year, short description, LinkedIn link): TODO
- Experience / education: TODO
- Personality and speaking style: TODO
- Currently looking for: TODO
- Topics the twin must NOT discuss: TODO (e.g. salary, family, address, phone)
- Links: GitHub TODO, LinkedIn TODO, email TODO, resume TODO

Store all of this as structured data in `content/` (see structure below), never hardcoded in components.

## Part 1: Portfolio website

### Pages (separate routes, shared layout and navigation)
| Route | Content |
|---|---|
| `/` | Home: hero with name, role, one-line intro, highlights, entry points to other pages and the twin |
| `/projects` | Project grid. Each card: 2–4 images, short description, tech tags. Clicking opens the GitHub repo (new tab). |
| `/projects/[slug]` | Optional detail page per project |
| `/certificates` | List with **no images**: title, issuer, year, short description. Clicking opens the LinkedIn credential. |
| `/about` | Bio, skills, experience and education timeline |
| `/contact` | Email, GitHub, LinkedIn, resume download |
| `/twin` | The AI digital twin (Part 2) |

### Design direction
- Official, professional and organized. Clear hierarchy, consistent spacing, restrained color palette.
- Motion with **GSAP** (+ ScrollTrigger), inspired by GSAP showcase sites. Use motion with purpose:
  one strong page-load moment, scroll-driven project reveals, interactive project cards
  (3D tilt on hover, screenshot cycling, smooth transitions). Avoid animating everything.
- Project UI must feel very interactive.
- Fun AI comments: a small "AI take" button on projects/certificates that generates a short, playful,
  never-mean comment via the LLM (server route). Include canned fallback lines if the API fails.
- Responsive down to mobile, keyboard accessible, visible focus, respects `prefers-reduced-motion`,
  light and dark themes.

## Part 2: AI digital twin

### Behaviour
- Speaks in first person as me, based only on the `content/` knowledge base.
- If it doesn't know something, it says so and points the visitor to my email. It never invents facts.
- Refuses topics listed in the "must NOT discuss" section.
- Always discloses that it is an AI version of me (label on the UI + in its intro line).
- Replies are short and conversational (2–4 sentences), like spoken speech.

### Pipeline
```
Visitor question (text or mic)
  → [speech-to-text if voice]
  → LLM (system prompt + knowledge base) returns JSON: { "text": "...", "emotion": "happy|thinking|surprised|neutral|laughing|serious" }
  → text-to-speech (ideally my cloned voice)
  → talking avatar from my photo: lip-sync to the audio + facial expression from `emotion`
  → idle animations when not talking (blinking, small head movement, breathing)
```

### Avatar approach (evaluate before choosing; check current pricing, limits and licensing)
- **Hosted real-time avatar APIs** (fastest to ship, realistic, cost per minute): e.g. D-ID, HeyGen streaming avatars, Simli, Tavus.
- **Open-source photo-to-talking-head** (free but needs a GPU server): e.g. SadTalker, LivePortrait, MuseTalk, Wav2Lip.
- **Browser-side 3D avatar** made to resemble me, with viseme lip-sync (cheapest to run, less photorealistic).

Decision criteria: realism, latency (target < 2 s to first speech), cost per conversation, emotion control, ease of deployment.
Record the decision and reasons in `docs/decisions.md`.

### Voice
- Text-to-speech: a voice-cloning TTS service (e.g. ElevenLabs) or a standard TTS as fallback.
- Speech-to-text: browser Web Speech API or a Whisper-based service.
- Always provide a text chat fallback and captions for accessibility.

## Tech stack (default; ask before changing)
- Next.js (App Router) + TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- LLM: Claude API via server-side route handlers (`app/api/...`)
- Deploy: Vercel
- Package manager: npm

## Folder structure
```
app/
  (site)/            # layout + pages: home, projects, certificates, about, contact
  twin/              # digital twin page
  api/chat/          # twin chat endpoint (LLM)
  api/ai-take/       # fun comment endpoint
  api/tts/           # text-to-speech proxy
components/
  ui/                # buttons, cards, nav, footer
  projects/
  certificates/
  twin/              # Avatar, ChatPanel, MicButton, Captions
lib/
  gsap/              # animation helpers
  ai/                # prompts, LLM client, response schema
content/
  profile.json       # bio, skills, links, speaking style, boundaries
  projects.json
  certificates.json
public/images/       # project screenshots, my avatar photo
docs/decisions.md
```

## Commands
```
npm install
npm run dev       # local dev server
npm run build
npm run lint
```

## Rules for Claude
- Work phase by phase (below). Finish and confirm a phase before starting the next.
- Ask before adding new dependencies or paid services.
- **Never** put API keys in client code or commit them. Use `.env.local` and keep `.env.example` updated.
- All AI calls go through server routes, with rate limiting and input length limits.
- Content lives in `content/`; components read from it.
- TypeScript strict mode; small, reusable components.
- Keep GSAP animations cleaned up (use `gsap.context()` / `useGSAP` and revert on unmount).
- My photo and voice are personal data: only use them for this twin, and don't upload them anywhere new without asking.

## Environment variables (`.env.example`)
```
ANTHROPIC_API_KEY=
TTS_API_KEY=
AVATAR_API_KEY=
```

## Phases
1. **Setup**: Next.js project, Tailwind, GSAP, layout, navigation, theme, content files with placeholders.
2. **Portfolio pages**: Home, Projects (interactive cards, GitHub links), Certificates (LinkedIn links), About, Contact.
3. **Polish**: GSAP motion, responsiveness, accessibility, SEO/metadata, deploy.
4. **AI text twin**: `/twin` chat grounded in `content/`, JSON emotion output, "AI take" comments.
5. **Voice**: TTS (+ optional voice clone) and speech input.
6. **Talking face**: avatar from my photo with lip-sync, emotion expressions and idle animations.
7. **Final polish**: latency tuning, cost limits, mobile testing, analytics.

## Current phase
Phase 1: setup — Next.js project, Tailwind, GSAP, layout, navigation, theme, and content files
with placeholders are in place. Next step: Phase 2 (real portfolio page content) once I confirm.
