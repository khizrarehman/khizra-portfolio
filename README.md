# Khizra Rehman

Personal site of Khizra Rehman — research, writing and a little cat.

A single-page Next.js (App Router) site: one continuous, scroll-driven
journey (GSAP ScrollTrigger + Lenis) through Substack, Research, the
creative archive, Experience, Education and About, over a persistent
three.js particle field (react-three-fiber). Without WebGL it falls back
to a static 2D field; with `prefers-reduced-motion` it becomes a plain
readable page.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Content

Everything visitors read lives in `src/content/` — profile, research,
experience, education, creative work and Substack posts. Components only
render it. Keep every factual claim traceable to Khizra's CV or her
Substack (see the notes at the top of each file).

**Substack posts** (`src/content/journal.ts`) are a hand-copied snapshot
of real posts, so the site never depends on Substack at runtime. To
refresh it, update the posts and `retrievedAt` from
`https://kworld.substack.com/api/v1/archive`.

**Creative archive** (`src/content/creative.ts`) is intentionally empty.
While it is, the chapter is a one-line interlude and the nav omits it;
adding entries brings both back.

## Deploy

Deploys to Vercel (or any Next.js host) with no required environment
variables. One optional setting:

| Variable               | Purpose                                                                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | The public origin, e.g. `https://example.com`. Used for canonical, Open Graph, robots and sitemap URLs. On Vercel it defaults to the project's production domain. |

Post cover images are optimised by Next's image optimiser from
`substackcdn.com` (allowed in `next.config.ts`).
