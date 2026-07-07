# IT Legend — Course Details

A production-shaped **Course Details** experience built on the Next.js App Router: a server-rendered course page with a fully custom video player, timed exams, PDF previews, an optimistic review flow, and a leaderboard — assembled from small, focused components.

> The data layer is intentionally a **mock behind a service seam**. Every component, hook, and route is written as if a real backend were in place; swapping the mock for HTTP calls touches a single file (`services/courseService.ts`).

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38bdf8" />
  <img alt="Tests" src="https://img.shields.io/badge/tests-Vitest%20%2B%20Playwright-6e9f18" />
</p>

---

## Table of contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Folder structure](#folder-structure)
- [Technology stack](#technology-stack)
- [Getting started](#getting-started)
- [Development commands](#development-commands)
- [Environment variables](#environment-variables)
- [Testing](#testing)
- [Project decisions](#project-decisions)
- [Future improvements](#future-improvements)
- [License](#license)

---

## Overview

The app renders a single course route, `/courses/[courseId]`, and the home route redirects to a demo course. Despite being one screen, it exercises the patterns a real learning platform needs:

- **Server-rendered content + per-course SEO** — the page is fetched on the server, streamed with a route-level skeleton, and emits dynamic `<title>`, description, canonical, OpenGraph and Twitter tags.
- **A custom, dependency-free video player** — play/pause, seek with buffered range, volume, playback speed, keyboard shortcuts, native + CSS fullscreen, a desktop "theatre/wide" mode, and a mobile sticky mini-player. The `<video>` element is never remounted across any of these states.
- **Interactive learning UI** — collapsible curriculum weeks, a timed multiple-choice exam, a modal PDF preview, an "Ask a Question" panel and a curriculum checklist (both persisted to `localStorage`), and a leaderboard.
- **Optimistic reviews** — submitting a review prepends it to the cached course instantly via TanStack Query, with validation handled by React Hook Form.

## Architecture

The guiding principle is a **thin server data boundary with client islands below it**. Only data fetching moves to the server; every interactive piece stays a Client Component.

```
                    ┌────────────────────────────────────────────┐
   Request  ─────▶  │  app/courses/[courseId]/page.tsx  (Server)   │
                    │   • generateMetadata()  ── getCourse() ─┐    │
                    │   • prefetchQuery(course)  ── getCourse()┘    │   React.cache
                    │   • dehydrate(queryClient)                    │   dedupes → 1 fetch
                    └───────────────────┬──────────────────────────┘
                                        │ <HydrationBoundary state={…}>
                                        ▼
                    ┌────────────────────────────────────────────┐
                    │  CourseDetails  ("use client")               │
                    │   useCourse() reads the hydrated cache       │
                    │   — no refetch (staleTime keeps it fresh)    │
                    ├──────────────┬───────────────┬──────────────┤
                    │ VideoPlayer  │ Dialogs/Exam  │ ReviewForm    │  ← client islands
                    │ (browser API)│ (native <dialog>) │ (mutation)│
                    └──────────────┴───────────────┴──────────────┘

  Data flow:  types  →  constants (mock)  →  services  →  hooks (React Query)  →  components
```

**Layers**

| Layer | Responsibility | Key files |
|------|----------------|-----------|
| **Types** | Domain models, transport-agnostic | `types/course.ts` |
| **Data source** | Mock course data (the seam's backing store) | `constants/course.ts`, `constants/examQuestions.ts` |
| **Service** | The single boundary between UI and backend | `services/courseService.ts` |
| **HTTP client** | Configured axios instance + interceptors (ready for a real API) | `lib/api.ts` |
| **Server query** | Per-request/browser `QueryClient` factory for SSR hydration | `lib/getQueryClient.ts` |
| **Hooks** | React Query reads/mutations, browser-API hooks | `hooks/*` |
| **UI** | Presentational + interactive components | `components/course/*`, `components/ui/*` |

**Rendering & data**

- The route is a **Server Component** that prefetches the course into a per-request `QueryClient`, dehydrates it, and wraps the client tree in `HydrationBoundary`. The client's `useCourse` reads the hydrated entry and — because `staleTime` marks it fresh — does **not** issue a duplicate request.
- `generateMetadata()` and the page prefetch both call `getCourse` (a `React.cache`-wrapped loader), so the course is fetched **once per request**.
- Loading and error UI are route-level (`loading.tsx`, `error.tsx`) rather than client-side screens.
- Cache keys live in one factory (`constants/queryKeys.ts`) so server prefetch, hydration and the optimistic mutation always reference the same key.

**Styling** is Tailwind CSS v4 with a design-token system defined in `app/globals.css` (`:root` raw values → `@theme inline` aliases), making a future dark theme a single-file change.

## Folder structure

```
.
├── app/                              # App Router
│   ├── layout.tsx                    # Root layout, fonts, metadataBase + title template
│   ├── providers.tsx                 # Client QueryClientProvider (browser singleton)
│   ├── page.tsx                      # "/" → redirects to the demo course
│   ├── globals.css                   # Tailwind v4 + design tokens + course grid
│   └── courses/[courseId]/
│       ├── page.tsx                  # Server Component: generateMetadata + prefetch + hydration
│       ├── loading.tsx               # Route-level skeleton (Suspense fallback)
│       └── error.tsx                 # Route-level error boundary (Client)
│
├── components/
│   ├── course/                       # Feature components (player, dialogs, sections)
│   │   ├── CourseDetails.tsx         # Client composition root + responsive layout
│   │   ├── VideoPlayer.tsx           # Custom player (client island)
│   │   ├── ExamDialog.tsx            # Timed exam state machine
│   │   ├── CurriculumDialog.tsx      # Curriculum checklist (localStorage)
│   │   ├── AskQuestionDialog.tsx     # Q&A draft/history (localStorage)
│   │   ├── LeaderboardDialog.tsx     # Leaderboard + coaching message
│   │   ├── ReviewForm.tsx            # React Hook Form review submission
│   │   └── …                         # Materials, comments, progress, week/lesson, etc.
│   └── ui/                           # Reusable primitives (Modal, Button, Card, Badge…)
│
├── hooks/                            # useCourse, useSubmitReview, useVideoPlayer,
│                                     # useFullscreen, useStickyPlayer, useMediaQuery, useWideMode
├── lib/                              # api (axios), getQueryClient, persist, utils (cn)
├── services/                         # courseService — the UI↔backend seam
├── constants/                        # course mock, exam questions, query keys, leaderboard msgs
├── types/                            # course domain models
├── utils/                            # getInitials
│
├── e2e/                              # Playwright specs (critical user flows)
├── public/                           # Static assets (sample video, PDF, icons)
│
├── vitest.config.ts / vitest.setup.ts
├── playwright.config.ts
├── next.config.ts / tsconfig.json / eslint.config.mjs / postcss.config.mjs
└── AGENTS.md                         # Contributor note on this Next.js version's conventions
```

Tests are **co-located** with the code they cover (`*.test.ts[x]` next to the source); end-to-end specs live under `e2e/`.

## Technology stack

| Area | Choice | Notes |
|------|--------|-------|
| Framework | **Next.js 16** (App Router, Turbopack) | Server Components, streaming, route conventions |
| UI runtime | **React 19** | |
| Language | **TypeScript 5** (`strict`) | |
| Data / server state | **TanStack Query v5** | SSR prefetch + dehydrate/hydrate, optimistic updates |
| HTTP | **axios** | Configured client + interceptors in `lib/api.ts` (ready for a real API) |
| Forms | **React Hook Form** | |
| Styling | **Tailwind CSS v4** + design tokens | `tw-animate-css`, `clsx` + `tailwind-merge` via `cn()` |
| Primitives / icons | **Radix UI** (avatar, progress, separator, slot), **lucide-react**, **class-variance-authority** | |
| Unit / component tests | **Vitest** + **Testing Library** + **jsdom** | |
| E2E tests | **Playwright** | |
| Package manager | **pnpm** | |

## Getting started

**Prerequisites:** Node.js ≥ 20.19 (or ≥ 22.12) and [pnpm](https://pnpm.io/).

```bash
# 1. Install dependencies
pnpm install

# 2. (optional) configure environment — see "Environment variables"
cp .env.example .env.local   # if present; otherwise create .env.local

# 3. Start the dev server
pnpm dev
```

Open <http://localhost:3000> — it redirects to the demo course at `/courses/starting-seo`.

## Development commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the dev server (Turbopack) at `localhost:3000` |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint (`eslint-config-next`) |
| `pnpm test` | Run the Vitest unit/component suite once |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:e2e` | Run Playwright end-to-end specs (see [Testing](#testing)) |

## Environment variables

All variables are optional; sensible defaults keep the app runnable out of the box. Client-exposed values use the `NEXT_PUBLIC_` prefix.

| Variable | Used by | Default | Description |
|----------|---------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `app/layout.tsx` (`metadataBase`) | `http://localhost:3000` | Absolute origin used to resolve canonical / OpenGraph URLs. Set per environment (e.g. `https://itlegend.com`). |
| `NEXT_PUBLIC_API_URL` | `lib/api.ts` (axios `baseURL`) | `/api` | Base URL for the HTTP client once the service layer is pointed at a real backend. |

Example `.env.local`:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
```

## Testing

The strategy targets logic that can actually regress and skips presentation-only components.

- **Unit** — pure functions: `getInitials`, `cn`, `persist`, `queryKeys`, leaderboard tiering, `formatTime`.
- **Hook** — `useSubmitReview` optimistic cache write (prepend on the correct key, no-cache guard).
- **Component** — `ReviewForm` validation/reset, `ExamDialog` scoring + countdown auto-submit.
- **E2E (Playwright)** — SSR + SEO output, video play/pause, optimistic review, `localStorage` persistence across reload, full exam attempt, mobile sticky player.

```bash
pnpm test                 # unit + component (jsdom)
npx playwright install    # one-time: download browsers
pnpm test:e2e             # end-to-end (boots a production build)
```

Test infrastructure: `vitest.config.ts` maps the `@/*` alias and runs in jsdom; `vitest.setup.ts` wires Testing Library matchers and polyfills `<dialog>.showModal()`/`matchMedia`/observers that jsdom lacks.

## Project decisions

- **Mock behind a service seam, not scattered fixtures.** `services/courseService.ts` is the only module that reads the mock. Going live means replacing two function bodies with `api` calls; no component or hook changes. Keeps the take-home honest about where the backend boundary is.
- **Move only the data-fetching boundary to the server.** The page is a Server Component; the interactive UI stays on the client. This buys SSR, streaming and SEO without turning the player/dialogs into (impossible) Server Components.
- **No duplicate fetching.** `generateMetadata` and the route prefetch share a `React.cache`-wrapped loader; `staleTime` stops the client from re-requesting hydrated data.
- **Route-level loading/error over client screens.** `loading.tsx`/`error.tsx` are the idiomatic App Router conventions and keep `CourseDetails` focused on interaction.
- **The player uses `course.imageUrl` as its poster.** An earlier approach decoded a frame from the video via an offscreen `<video>` + canvas, which downloaded the media twice and blocked the main thread. Using the existing image is free, cacheable, and shareable (same URL as the OG image).
- **Native `<dialog>` for modals.** Free backdrop, focus trap and Escape handling, with a small `showModal` polyfill only in tests.
- **Design tokens in CSS.** Raw values in `:root`, aliased into Tailwind's `@theme`, so restyling / theming is one file.
- **Type safety without escape hatches.** No `any`/`@ts-ignore`; browser capabilities absent from the DOM lib (e.g. `ScreenOrientation.lock`) are handled with runtime feature detection and user-defined type guards.

## Future improvements

- **Wire the service layer to a real API** through the existing axios client, and add `error.tsx`-triggering failure paths (the boundary is already in place).
- **Adopt `next/image`** for the hero/poster and avatars (optimization, lazy loading, LCP).
- **Prune dead scaffolding** — `CourseHero`, unused `socials`/`instructor` fields, and unreferenced `ui` primitives (`Button`, `Card`, `Separator`); drop `axios` until the API is wired, or wire it.
- **Split `CourseMaterials` columns** so the two-column layout slices the list instead of rendering it twice.
- **Consolidate the two modal patterns** (`Modal` vs. the `open`-prop dialogs) into one API.
- **Throttle `timeupdate`** in the player (drive the seek bar off a ref/CSS var) to avoid re-rendering the control tree ~4×/sec during playback.
- **Externalize copy / i18n** — the Arabic coaching messages are inline; move to a locale layer.
- **CI** — GitHub Actions running `lint`, `test`, `build`, and Playwright on PRs; add coverage thresholds.

## License

No license file is currently included. Add one (e.g. `MIT`) before publishing as open source.
