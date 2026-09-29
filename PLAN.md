# Portfolio v2 — Build Plan

> Owner: Edo Wijaya · Created: 2026-09-28 · Status: **Approved, ready to build**
>
> Design source: `DESIGN.md` (GSAP-style "animated chalkboard": near-black canvas, cream type, color-coded disciplines, outlined pills, soft gradient blobs).

---

## 1. Goal

A portfolio that does two jobs:

1. **Win freelance/client work** — a visitor understands *what Edo builds* (web, mobile, backend) within 10 seconds and can start a conversation in one click.
2. **Build a personal brand** — the site itself is proof of craft: typographic, animated, fast.

No blog. The site is about **work**, like a typical software-engineer portfolio.

### Success criteria

- Hero, services and 3 featured projects visible without hunting.
- One-click contact (`mailto:`) from hero, nav and footer.
- Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO (mobile).
- Adding a new project = drop one `.mdx` file in a folder, `git push`. Nothing else.

---

## 2. Decisions log (from the grilling session)

| # | Topic | Decision | Why |
|---|---|---|---|
| Q1 | Purpose | Client work + personal brand | Freelance focus, site doubles as craft proof |
| Q2 | Color taxonomy | Green = You, Blue = Web, Pink = Mobile, Orange = Backend, Violet = Side Projects | Design's signature is color-as-category; mapped to what Edo sells |
| Q3 | Stack | Astro + Tailwind v4 + GSAP + MDX in repo | Content-first, zero-JS by default, great SEO; Tailwind `@theme` block already in DESIGN.md |
| Q4 | Font | **DM Sans** (variable, self-hosted) instead of PP Mori | Mori needs a paid commercial license; DM Sans is listed as an approved substitute |
| Q5 | Illustrations | Inline SVG blobs + radial gradients, animated with GSAP MorphSVG | ~5KB each, animated, doubles as a GSAP skill showcase |
| Q6 | Pages | `/`, `/work`, `/work/[slug]` — **no blog** | Show work, not writing |
| Q6b | Violet | Side Projects (personal + open source) | Replaces "Writing" once blog was cut |
| Q7 | Content | 5 placeholder projects, 3 featured | Real content swapped in later, ~5 min per project |
| Q8 | Contact | `mailto:` link, no form, no `/contact` page | Zero backend; form can come later (Formspree) |
| Q9 | Identity | Headline **"Build Anything."**, wordmark **Edo Wijaya**, email `edowijaya1@gmail.com`, GitHub/LinkedIn = placeholders | Echoes GSAP's "Animate Anything" |
| Q10 | Location | `~/Personal/portfolio-v2` (new folder) | Old portfolio untouched |
| — | Defaults | Responsive `clamp()` type, `prefers-reduced-motion` honored, dark only, Vercel free tier | Accepted without objection |

### Simplification that fell out of these decisions

- **No React integration.** React islands were planned for the contact form + work filter. The form is gone (mailto), and the work filter is ~15 lines of vanilla `<script>` in Astro. Adding `@astrojs/react` for one filter is dead weight. → Add React later only if a real interactive feature needs it.

---

## 3. Design adaptations vs DESIGN.md

The design file describes GSAP's own site. Here's what changes for a personal portfolio:

| DESIGN.md | Portfolio v2 | Reason |
|---|---|---|
| Font: Mori | DM Sans Variable (400–600) | License (Q4). Swap = change one CSS variable |
| Disciplines: Scroll / SVG / Text / UI | Web / Mobile / Backend / Side Projects | Q2 + Q6b |
| Green = GSAP brand | Green = Edo (wordmark + primary CTA) | Same role, new owner |
| "Tools" section (4 feature blocks) | "Services" section (3 feature blocks: Web, Mobile, Backend) | Side Projects isn't a sellable service; it lives in the work grid only |
| "Showcase" cards | Project cards | Same component, different content |
| Announcement banner | **Dropped** | Nothing to announce. Re-add for "Available from Nov 2026" type notices |
| `--color-lipstick-pink`, `--color-core-green` | Kept in tokens, unused | Cheap to keep, might be used in blob gradients |
| 3D rendered blobs | Flat-3D SVG blobs (inner radial gradient) | Q5 |

Everything else follows DESIGN.md exactly: cream `#fffce1` on `#0e100f`, outlined-only pills (100px radius), gradient-stroked primary CTA, `{ curly-bracket }` eyebrows, `#42433d` hairlines, no box-shadows, no pure white/black.

---

## 4. Tech stack

| Package | Purpose |
|---|---|
| `astro` (latest) | Framework, static output |
| `@astrojs/mdx` | MDX for project case studies |
| `tailwindcss` v4 + `@tailwindcss/vite` | Styling via `@theme` tokens |
| `gsap` (includes ScrollTrigger, SplitText, MorphSVGPlugin — all free since 2025) | Animation |
| `@fontsource-variable/dm-sans` | Self-hosted font, no Google Fonts request |

**Not included (YAGNI):** React, CMS, form service, analytics, sitemap. See §12 for when to add each.

Output: fully static (`astro build` → `dist/`). No server, no adapter.

---

## 5. Project structure

```
portfolio-v2/
├── PLAN.md                     ← this file
├── DESIGN.md                   ← copy of the design reference
├── astro.config.mjs
├── package.json
├── public/
│   ├── favicon.svg             ← green "EW" monogram
│   └── og.png                  ← 1200×630 social preview (placeholder)
└── src/
    ├── content.config.ts       ← `projects` collection schema (zod)
    ├── content/
    │   └── projects/
    │       ├── ledgerly.mdx
    │       ├── kopi-run.mdx
    │       ├── trackr-api.mdx
    │       ├── gsap-blobs.mdx
    │       └── habit-garden.mdx
    ├── lib/
    │   ├── disciplines.ts      ← single source of truth: key → label, color, blob gradient
    │   ├── site.ts             ← name, email, socials, mailto URL
    │   └── motion.ts           ← all GSAP setup (one file)
    ├── styles/
    │   └── global.css          ← Tailwind import + @theme tokens + base styles
    ├── layouts/
    │   └── Base.astro          ← <head>, Nav, Footer, motion script
    ├── components/
    │   ├── Nav.astro
    │   ├── Footer.astro
    │   ├── Bracket.astro       ← { eyebrow }
    │   ├── Pill.astro          ← variant: "ghost" | "gradient"
    │   ├── DisciplineLabel.astro
    │   ├── Blob.astro          ← SVG blob, color by discipline
    │   ├── Hero.astro
    │   ├── ServiceRow.astro
    │   ├── ProjectCard.astro
    │   └── About.astro
    └── pages/
        ├── index.astro
        └── work/
            ├── index.astro
            └── [slug].astro
```

~20 files. No barrels, no utils folder, no hooks.

---

## 6. Design tokens (`src/styles/global.css`)

Pasted from DESIGN.md's Tailwind v4 block with these edits:

```css
@import "tailwindcss";
@import "@fontsource-variable/dm-sans";

@theme {
  /* Colors — unchanged from DESIGN.md */
  --color-just-black: #0e100f;
  --color-cream: #fffce1;
  --color-muted: #7c7c6f;        /* surface-50 */
  --color-hairline: #42433d;     /* surface-25 */
  --color-off-black: #191919;
  --color-green: #0ae448;
  --color-light-green: #abff84;
  --color-orange: #ff8709;       /* Backend */
  --color-pink: #fec5fb;         /* Mobile */
  --color-lilac: #9d95ff;        /* Side Projects */
  --color-blue: #00bae2;         /* Web */
  --color-core-green: #dfffd1;
  --color-lipstick-pink: #f100cb;

  /* Font — ONE variable to swap to PP Mori later */
  --font-sans: "DM Sans Variable", ui-sans-serif, sans-serif;

  /* Type scale — fluid versions of the DESIGN.md scale */
  --text-caption: 14px;
  --text-body-sm: 16px;
  --text-body: 19px;
  --text-body-lg: 23px;
  --text-subheading: clamp(26px, 3vw, 34px);
  --text-heading-sm: clamp(32px, 4vw, 44px);
  --text-heading: clamp(40px, 5.2vw, 66px);
  --text-heading-lg: clamp(48px, 8vw, 101px);
  --text-display: clamp(72px, 17.5vw, 224px);

  --radius-card: 8px;
  --radius-pill: 100px;
}
```

Plus base styles: `body { background: var(--color-just-black); color: var(--color-cream); }`, `::selection` in green, focus rings in cream (2px offset).

Renamed a few tokens (`surface-50` → `muted`, `surface-25` → `hairline`) so class names read naturally: `text-muted`, `border-hairline`.

---

## 7. Discipline map (`src/lib/disciplines.ts`)

The site's taxonomy lives in **one** object. Every label, filter, blob and tag reads from it.

```ts
export const disciplines = {
  web:     { label: "Web",           color: "#00bae2", blob: ["#00bae2", "#fec5fb"], stack: "React · TypeScript · Tailwind" },
  mobile:  { label: "Mobile",        color: "#fec5fb", blob: ["#fec5fb", "#9d95ff"], stack: "Flutter · Dart" },
  backend: { label: "Backend",       color: "#ff8709", blob: ["#ff8709", "#ffd27a"], stack: "Node · Express · MongoDB" },
  side:    { label: "Side Projects", color: "#9d95ff", blob: ["#9d95ff", "#00bae2"], stack: "Experiments & open source" },
} as const;
export type Discipline = keyof typeof disciplines;
```

Green (`#0ae448 → #abff84`) is reserved for **Edo**: wordmark, primary CTA border, text selection. Never used as a discipline.

---

## 8. Pages

### 8.1 `/` — Home

Section order, top to bottom. Every section opens with a `{ Bracket }` eyebrow and is separated by an 80px gap.

**1. Nav** (sticky, transparent → `#0e100f` at 90% opacity once scrolled)
- Left: wordmark "Edo Wijaya" in green gradient text, 20px, weight 600
- Right: `Work` · `About` (ghost links, 16px) · **Start a project** (gradient pill → mailto)
- Mobile (<768px): wordmark + gradient pill only; `Work` / `About` move to the footer. No hamburger menu (two links don't justify one).

**2. Hero**
- Line 1: **Build** / Line 2: **Anything.** — display size, weight 600, line-height 0.9, tracking -0.02em, cream
- Left-aligned, **no max-width container**, bleeds toward the right viewport edge
- 3 blobs (blue, pink, orange) clustered overlapping the right side of line 2, partially behind/in front of the type (z-index layering)
- Lower third: `{ Full-stack & Flutter developer — available for freelance }` (body, cream)
- Two pills: **Start a project** (gradient) + **See work** (ghost → `/work`)
- Height: `min-h-[100svh]`

**3. `{ Services }`** — three `ServiceRow`s, hairline divider between each
- Each row: two columns (stack vertically on mobile)
  - Left: large `Blob` in the discipline's gradient (~420px desktop, ~240px mobile)
  - Right: `DisciplineLabel` (e.g. "Web" in blue, 23px) → subheading (cream, heading-sm) → body-lg paragraph → stack line in muted → ghost pill **See web work** → `/work?d=web`
- Placeholder copy:
  - **Web** — "Fast, accessible web apps that feel native." / "From marketing sites to full dashboards: React, TypeScript and Tailwind, shipped with tests and good Lighthouse scores."
  - **Mobile** — "One codebase, two app stores." / "Flutter apps for iOS and Android with smooth 60fps UI, offline support and clean state management."
  - **Backend** — "APIs that don't wake you up at 3am." / "Node, Express and MongoDB services with auth, validation and sensible data models."

**4. `{ Selected Work }`**
- Heading: "Things I've shipped." (heading size)
- 3-column grid (1 col mobile, 2 col tablet), 24px gap, the 3 `featured: true` projects sorted by `order`
- Ghost pill **See all work** → `/work`

**5. `{ About }`**
- Short bio at heading-sm, cream, max ~22ch per line — placeholder:
  "I'm Edo, a software developer who builds web, mobile and backend products end to end."
- Below: body-lg paragraph (2–3 sentences, placeholder), then the four discipline labels in a row as a "what I do" legend
- Links: GitHub · LinkedIn · Email (ghost links)

**6. Closing CTA**
- `{ Got a project? }` eyebrow
- "Let's build it." at heading-lg
- Gradient pill **Start a project** → mailto

**7. Footer** — see §9.

### 8.2 `/work` — All projects

- `{ Work }` eyebrow + heading "Everything I've built."
- Filter row: `All` + 4 discipline pills (outlined, text in discipline color; active = border in discipline color)
- Grid of all projects, same `ProjectCard` as home, sorted by `year` desc then `order`
- Filtering: vanilla script toggles `hidden` on cards whose `data-disciplines` doesn't include the selected key. Reads/writes `?d=web` so service-row links pre-filter and URLs are shareable.
- Without JS: all projects show, filter pills are plain links (graceful).

### 8.3 `/work/[slug]` — Case study

Layout top to bottom:
1. Back link `← All work` (ghost, muted)
2. Discipline labels (colored) + `Client` / `Personal` tag in muted
3. Title at heading-lg
4. Summary at body-lg, muted
5. Meta row (hairline top/bottom): **Role** · **Year** · **Stack** · **Links** (Live ↗, Repo ↗, App Store ↗ — only those present)
6. Cover: image if `cover` set, else a large `Blob` in the primary discipline's gradient on an `off-black` panel (8px radius)
7. MDX body, max-width ~68ch, with styled `h2` (subheading size) and paragraphs at body-lg. Recommended sections: **The problem · What I built · How · Result**
8. Next project card at bottom → keeps visitors moving

---

## 9. Components

| Component | Spec |
|---|---|
| **Pill** | `variant="ghost"`: transparent, 1px cream border, 100px radius, 15px/24px padding, 18px weight 600, lh 1.05. Hover: border opacity 0.8, text unchanged. `variant="gradient"`: same, but 1.5px border via `background: linear-gradient(#0e100f,#0e100f) padding-box, var(--gradient-green) border-box; border: 1.5px solid transparent`. Renders `<a>` when `href` is given. |
| **Bracket** | `{ slot }` — 16–19px weight 400 cream. Literal braces, no decoration. |
| **DisciplineLabel** | Single word, 19–23px weight 400, `color` from discipline map. Optional `size="lg"` (34px weight 600) for case-study headers. |
| **Blob** | Inline `<svg viewBox="0 0 200 200">` with a `<radialGradient>` (offset highlight at 30%/30% → lit-from-within) and a `<path>`. Props: `discipline`, `size`, `class`. Carries 2 alternate path shapes in `data-morph` for GSAP. `aria-hidden="true"`. |
| **ServiceRow** | See §8.1. `grid md:grid-cols-2 gap-16 items-center`, `border-t border-hairline`, py 76px. |
| **ProjectCard** | Canvas-colored card (per DESIGN.md), 8px radius, no border. Top: 16:10 preview area (cover image or discipline blob on `#191919`), preview art bleeds slightly (`scale-105` + `overflow-visible` on blob). Below: discipline dots/labels, title (24px weight 600), one-line summary (muted, 16px). Whole card is a link. Hover: preview scales 1.03 over 400ms, title underline. |
| **Nav / Footer** | Footer: `#191919` background, 1px hairline top, py 80px. Columns: wordmark + `{ Built with Astro & GSAP }` / Pages (Home, Work) / Contact (email, GitHub, LinkedIn). Bottom row: `© 2026 Edo Wijaya` in muted, caption size. |

**Rules (from DESIGN.md "Don'ts"):** no filled buttons, no box-shadow anywhere, no `#fff` / `#000`, body text 14–23px only, no new colors.

---

## 10. Content model (`src/content.config.ts`)

```ts
const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(120),                       // one line, shown on cards
    disciplines: z.array(z.enum(["web", "mobile", "backend", "side"])).min(1),
    type: z.enum(["client", "personal"]),
    year: z.number(),
    role: z.string(),                                   // e.g. "Solo developer", "Frontend lead"
    stack: z.array(z.string()),
    featured: z.boolean().default(false),
    order: z.number().default(99),                      // lower = earlier
    cover: z.string().optional(),                       // /public path; falls back to blob
    links: z.object({
      live: z.string().url().optional(),
      repo: z.string().url().optional(),
      store: z.string().url().optional(),
    }).default({}),
    nda: z.boolean().default(false),                    // shows "Details anonymised" note
  }),
});
```

The build fails loudly if a project file has a typo in its frontmatter. That's intended.

### Placeholder projects

| File | Title | Type | Disciplines | Featured |
|---|---|---|---|---|
| `ledgerly.mdx` | Ledgerly — fintech dashboard | client (nda) | web, backend | ✅ order 1 |
| `kopi-run.mdx` | Kopi Run — coffee ordering app | client | mobile | ✅ order 2 |
| `gsap-blobs.mdx` | gsap-blobs — blob generator | personal | side, web | ✅ order 3 |
| `trackr-api.mdx` | Trackr — logistics API | client | backend | — |
| `habit-garden.mdx` | Habit Garden — habit tracker | personal | mobile, side | — |

Each gets ~150 words of lorem-free, plausible placeholder copy under the 4 recommended headings, so the layout is tested with realistic text length.

### How to add a real project later (≈5 min)

1. Copy any file in `src/content/projects/` → rename to `my-project.mdx`
2. Edit the frontmatter + body
3. (Optional) Put a cover at `public/work/my-project.webp` and set `cover: /work/my-project.webp`
4. `git push` → Vercel redeploys in ~1 min

---

## 11. Motion plan (`src/lib/motion.ts`)

All motion in one file, loaded once from `Base.astro`. Everything wrapped in `gsap.matchMedia()`:

```ts
mm.add("(prefers-reduced-motion: no-preference)", () => { /* all animations */ });
// reduced motion → nothing runs, content is visible by default (no FOUC-hidden states)
```

| Where | Animation | Plugin |
|---|---|---|
| Hero headline | Chars rise from `yPercent: 110` with `stagger: 0.02`, masked by line; 0.9s, `expo.out` | SplitText |
| Hero blobs | Scale-in from 0.6 + fade, then infinite slow morph between 2 shapes (6–9s, `sine.inOut`, yoyo) + gentle float (y ±12px) | MorphSVGPlugin |
| Hero blobs on scroll | Parallax: drift up at different speeds as hero scrolls out | ScrollTrigger (`scrub: true`) |
| Bracket eyebrows | Fade + 12px rise on enter | ScrollTrigger |
| Service rows | Blob scales 0.85 → 1 and rotates 8°; text column staggers in (label → heading → body → pill) | ScrollTrigger |
| Section headings (heading/heading-lg) | Line-by-line rise, same as hero but faster | SplitText + ScrollTrigger |
| Project cards | Stagger fade-up 24px on enter, `stagger: 0.08` | ScrollTrigger |
| Work filter | Cards `Flip` between layouts on filter change | — skipped, instant show/hide. Add `Flip` later if it feels abrupt |

**Anti-FOUC rule:** never hide content in CSS. Initial states are set by GSAP with `gsap.set()` inside the matchMedia block, so no-JS and reduced-motion users always see content.

**Performance rule:** only animate `transform` and `opacity` (plus MorphSVG path `d`). Kill ScrollTriggers on Astro page transitions if view transitions are ever added.

---

## 12. Accessibility, SEO, performance

**Accessibility**
- Contrast: cream on `#0e100f` ≈ 18.5:1 ✅. Muted `#7c7c6f` on `#0e100f` ≈ 4.5:1, which passes WCAG AA at every size, but only just → never put muted text on `#191919` (the footer); use cream at 70% opacity there instead.
- Pink `#fec5fb` / lilac / blue / orange labels all pass 4.5:1 on the canvas ✅
- Visible focus ring on every pill/link (2px cream outline, 3px offset)
- Blobs `aria-hidden`; SplitText keeps `aria-label` on the original heading
- Semantic landmarks: `<header>`, `<main>`, `<footer>`, one `<h1>` per page
- Skip-to-content link

**SEO**
- Per-page `<title>` and `<meta name="description">` (case studies use their `summary`)
- Open Graph + Twitter card tags, `public/og.png` placeholder
- `lang="en"`, canonical URLs once the domain exists

**Performance budget**
- JS shipped: GSAP core + 3 plugins ≈ 50–60KB gzipped, nothing else
- One font file (DM Sans variable, latin subset), `font-display: swap`
- No images on home except optional covers (WebP, `loading="lazy"`, width/height set)
- Target: Lighthouse mobile ≥ 95 in all four categories

---

## 13. Build phases

Time = Claude's build time. Your time is listed separately.

| Phase | Work | Est. | Done when |
|---|---|---|---|
| **0. Scaffold** | `npm create astro` (minimal, TS strict), add MDX, Tailwind v4, GSAP, DM Sans; copy DESIGN.md in; `git init` | 5 min | `npm run dev` serves a blank page |
| **1. Tokens + layout** | `global.css` tokens, `Base.astro`, `Nav`, `Footer`, `site.ts`, `disciplines.ts` | 10 min | Dark canvas, cream DM Sans text, nav + footer render |
| **2. Primitives** | `Pill`, `Bracket`, `DisciplineLabel`, `Blob` | 10 min | All four render on a scratch page matching §9 |
| **3. Content** | `content.config.ts` + 5 placeholder MDX files | 10 min | `astro check` passes; build fails if a field is broken |
| **4. Home** | `Hero`, `ServiceRow` ×3, featured grid, `About`, closing CTA | 15 min | Home matches §8.1 at 1440px and 375px |
| **5. Work pages** | `/work` grid + filter script, `/work/[slug]` case study | 15 min | Filter works with `?d=`, all 5 case studies render |
| **6. Motion** | `motion.ts` per §11 | 15 min | Animations run; with reduced motion on, page is static and fully visible |
| **7. QA pass** | Mobile widths (375 / 768 / 1280 / 1440), keyboard nav, contrast check, Lighthouse | 10 min | Checklist §14 all green |

**Total: ~1.5 hours of build time.**

**Your tasks afterwards (~20 min):**
1. `gh repo create portfolio-v2 --private --source . --push` (or via GitHub UI)
2. vercel.com → Import repo → Deploy (defaults work, no config)
3. Replace placeholders: GitHub/LinkedIn URLs in `src/lib/site.ts`, bio in `About.astro`
4. Swap placeholder projects for real ones (§10, ~5 min each)

---

## 14. Acceptance checklist

- [ ] Hero "Build / Anything." at display size, bleeds right, blobs overlap type
- [ ] Only colors from §6 appear anywhere; no `#fff`, no `#000`, no box-shadow
- [ ] Every button is a 100px-radius outlined pill; only "Start a project" has the green gradient border
- [ ] Every section opens with a `{ bracket }` eyebrow
- [ ] Discipline colors are consistent everywhere (labels, filters, blobs, cards)
- [ ] "Start a project" opens a mail client addressed to `edowijaya1@gmail.com` with subject "Project inquiry"
- [ ] `/work?d=mobile` shows only mobile projects on load
- [ ] All 5 case studies render with meta row and next-project link
- [ ] No horizontal scroll at 375px; hero headline fits at ≥ 72px
- [ ] Reduced motion → no animation, nothing hidden
- [ ] JS disabled → all content visible, filter links still navigate
- [ ] Keyboard: every interactive element reachable, focus ring visible
- [ ] Lighthouse mobile ≥ 95 ×4
- [ ] `astro check` and `astro build` pass with zero errors

---

## 15. Deferred (add when…)

| Feature | Add when |
|---|---|
| Contact form (Formspree) | mailto starts losing leads or you want budget/project-type fields |
| PP Mori font | You buy the license — change `--font-sans` only |
| Blog / writing (Violet → Writing again) | You commit to writing ~1 post/month |
| React integration | A genuinely interactive feature appears (calculator, live demo) |
| Sitemap + canonical URLs | Custom domain is connected |
| Analytics (Vercel Analytics / Plausible) | You want to know which projects get clicks |
| `Flip` animation on work filter | Instant filter feels abrupt in practice |
| Announcement banner | "Available from <date>" or similar notice needed |
| Light mode | Never, per DESIGN.md — dark canvas is the identity |

---

## 16. Placeholders to replace

| What | Where | Current value |
|---|---|---|
| GitHub URL | `src/lib/site.ts` | `https://github.com/your-username` |
| LinkedIn URL | `src/lib/site.ts` | `https://linkedin.com/in/your-handle` |
| Bio | `src/components/About.astro` | Generic 2-sentence placeholder |
| 5 projects | `src/content/projects/*.mdx` | Fictional (Ledgerly, Kopi Run, …) |
| OG image | `public/og.png` | Solid canvas + "Edo Wijaya — Build Anything." |
| Domain | Vercel dashboard | `*.vercel.app` |
