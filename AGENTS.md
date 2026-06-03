# AGENTS.md

> **AI Agent Orientation for SunCycle**  
> This file orients any AI agent (Codex, Claude Code, Cursor, etc.) working in this `day3/` directory. Read this before making any changes.

---

## 🎯 Project Overview

**SunCycle** is a free, static, fully prerendered Astro website that converts a user's real-world latitude, longitude, and IANA timezone into a **personal circadian light schedule**. It is built on real solar geometry (NOAA/Spencer algorithm) and peer-reviewed photobiology (CIE S 026:2018, Brainard, Figueiro, Zeitzer, Provencio, Pauley, Roenneberg).

**Key constraint:** No paid APIs. No AI calls at runtime. No backend. No accounts. Everything computes in the browser or at build time.

| Property | Value |
|----------|-------|
| Framework | Astro 5 (static output) |
| Language | TypeScript (strict) |
| Styling | Vanilla CSS with `@layer` architecture |
| Node | 20+ (Astro 4) or 22+ (Astro 5) |
| Deploy | Netlify |
| Domain | `suncycle.app` |

---

## 🧭 File Map

### Core Logic (no Astro dependencies)
These files are pure TypeScript. They can be imported by Astro pages and by client-side scripts.

| File | Responsibility | Key Exports |
|------|---------------|-------------|
| `src/lib/sun.ts` | Solar geometry | `computeSolarDay()`, `formatTime()`, `formatDate()`, `sunElevation()`, `SolarDay`, `SolarPosition` |
| `src/lib/light.ts` | Photobiology + chronotype | `derivePrescription()`, `scoreChronotype()`, `LIGHT_BANDS`, `CHRONOTYPE_QUESTIONS`, `Chronotype` |
| `src/lib/geo.ts` | Geolocation + timezone | `CITY_DIRECTORY`, `nearestCity()`, `guessTimezoneFromLongitude()`, `GeoGuess` |
| `src/lib/url-state.ts` | Deep-linkable URLs | `readStateFromUrl()`, `writeStateToUrl()`, `SharedState` |

### Pages (Astro routes)

| File | Route | Purpose |
|------|-------|---------|
| `src/pages/index.astro` | `/` | Main planner with interactive timeline, light windows, location form |
| `src/pages/science.astro` | `/science` | Photobiology explainer with research timeline |
| `src/pages/chronotype.astro` | `/chronotype` | 5-question chronotype quiz with character cards |
| `src/pages/about.astro` | `/about` | About, philosophy, privacy, limitations, sources |
| `src/pages/sitemap.xml.ts` | `/sitemap.xml` | Dynamic XML sitemap (prerendered) |
| `src/pages/rss.xml.ts` | `/rss.xml` | Dynamic RSS feed (prerendered) |

### Layouts & Components

| File | Purpose |
|------|---------|
| `src/layouts/Base.astro` | HTML shell with SEO, OG, JSON-LD, canonical, theme-color |
| `src/components/Header.astro` | Sticky header with brand mark + mobile hamburger menu |
| `src/components/Footer.astro` | Site footer with links |
| `src/components/PollinationsImg.astro` | Generates Pollinations.ai image URLs from prompts |

### Styles

| File | Purpose |
|------|---------|
| `src/styles/global.css` | Complete design system: `@layer reset, tokens, base, components, utilities` |

### Public Assets

| File | Purpose |
|------|---------|
| `public/favicon.svg` | Glowing sun favicon |
| `public/og-default.svg` | OG/Twitter card image |
| `public/manifest.webmanifest` | PWA manifest |
| `public/robots.txt` | Crawler directives |
| `public/rss.xml` | Static RSS fallback (dynamic endpoint preferred) |
| `public/sitemap.xml` | Static sitemap fallback (dynamic endpoint preferred) |
| `public/ai.txt` | AI crawler summary |
| `public/llm.txt` | LLM context file |

### Config

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro config: static output, prefetch, inline stylesheets, compress HTML |
| `netlify.toml` | Build command, publish dir, headers (security), redirects (www→apex), processing |
| `tsconfig.json` | Strict TypeScript, extends `astro/tsconfigs/strict` |
| `package.json` | `astro` as only runtime dependency |

---

## 🏗️ Architecture Rules

### 1. Static First
- This is a **static site**. No serverless functions. No SSR.
- All dynamic behavior happens in the browser via client-side scripts.
- XML endpoints (`sitemap.xml.ts`, `rss.xml.ts`) use `export const prerender = true`.

### 2. No Paid APIs at Runtime
- Solar calculations use the in-browser NOAA/Spencer algorithm (`src/lib/sun.ts`).
- Geolocation uses the browser's `navigator.geolocation` API (opt-in).
- Timezone uses `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- Images use Pollinations.ai **URL-based generation** (no API key, no request at build time unless explicitly downloaded).

### 3. Client-Side Script Conventions
- Client scripts in `.astro` files use `<script>` (not `<script is:inline type="module">`).
- Imports must use **relative paths** from the page: `import { computeSolarDay } from "../lib/sun.ts"`.
- Astro + Vite bundles these automatically. Absolute `/src/...` paths will fail.
- For inline scripts that don't import modules, use `<script is:inline>`.

### 4. Design System
- All styling is in `src/styles/global.css` using CSS layers.
- Use CSS custom properties (`var(--*)`) everywhere. No hardcoded colors.
- Components should NOT add page-specific CSS in `<style>` unless absolutely necessary.
- The design system is mobile-first. Breakpoints: `480px`, `640px`, `900px`.
- Dark mode only. `color-scheme: dark`. No light mode toggle exists.

### 5. Typography
- Headings use `var(--font-display)` (Instrument Serif).
- Body uses `var(--font-body)` (system sans-serif).
- Mono uses `var(--font-mono)` (JetBrains Mono / Fira Code).
- Fluid typography via `clamp()`. Never use fixed pixel sizes for headings.

### 6. Accessibility
- All interactive elements need visible focus states.
- ARIA labels on navigation, timelines, and form controls.
- `prefers-reduced-motion: reduce` disables ALL animations.
- Skip link must remain present in `Base.astro`.
- Minimum touch target: 44×44px.

### 7. SEO
- Every page MUST have: `title`, `description`, `canonical`, `ogImage`.
- `ogImage` should be a full URL (`https://suncycle.app/...`), not a relative path.
- `Base.astro` handles OG tags, Twitter cards, and JSON-LD `WebSite` schema.
- Update `sitemap.xml.ts` and `rss.xml.ts` when adding pages.

### 8. Privacy
- Do NOT add analytics, tracking pixels, or third-party scripts.
- Do NOT add cookies.
- Geolocation must remain **opt-in** (explicit button click).
- Any new data collection must be documented in `about.astro` and `public/ai.txt`.

---

## 🧪 Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Location   │────▶│   Sun Math   │────▶│   Prescription  │
│  (lat,lon,tz)│     │  (sun.ts)    │     │   (light.ts)    │
└──────────────┘     └──────────────┘     └─────────────────┘
       │                                           │
       │                                           ▼
       │                                    ┌──────────────┐
       │                                    │  4 Windows   │
       │                                    │  + Timeline  │
       │                                    └──────────────┘
       │                                           │
       ▼                                           ▼
┌──────────────┐                         ┌──────────────┐
│  URL State   │◄────────────────────────│   Render     │
│(url-state.ts)│                         │  (index.astro) │
└──────────────┘                         └──────────────┘
```

### How the planner works
1. User selects city, date, chronotype — or grants geolocation.
2. `state` object holds `{ lat, lon, tz, date, chronotype }`.
3. On change: `computeSolarDay(state.date, lat, lon, tz)` → solar events.
4. `derivePrescription(solar, chronotype)` → 4-window array.
5. Timeline bars positioned by `%` from `minutesFromMidnight()`.
6. URL updated via `writeStateToUrl()` for shareability.

---

## 🎨 Design Tokens Reference

```css
/* Colors */
--bg-0: #06040f;     /* Deepest background */
--bg-1: #0c0918;     /* Page background */
--bg-2: #121025;     /* Panel background */
--bg-3: #1a1630;     /* Elevated surface */
--bg-4: #241e40;     /* Borders, inputs */
--bg-glass: rgba(18,16,37,0.72);  /* Glassmorphism */

--ink-0: #ffffff;     /* Primary text */
--ink-1: #f0edf5;     /* Body text */
--ink-2: #b8b0cc;     /* Secondary text */
--ink-3: #7a7390;     /* Muted text */
--ink-4: #4a4560;     /* Placeholder text */

--accent-gold: #f4b860;        /* Primary accent */
--accent-gold-bright: #f8d494;
--accent-gold-dim: #c48a30;
--accent-amber: #ff9a4a;
--accent-coral: #ff7a6a;
--accent-cyan: #6ce2d8;
--accent-sky: #6f8cff;
--accent-lavender: #a890f0;

--good: #6ce2a0;
--warn: #f4b860;
--bad: #ff7a6a;
--cool: #6f8cff;

--line: rgba(255,255,255,0.07);
--line-strong: rgba(255,255,255,0.12);
```

---

## ⚡ Common Tasks

### Adding a new page
1. Create `src/pages/my-page.astro`.
2. Import `Base` from `../layouts/Base.astro`.
3. Set `title`, `description`, `canonical`, `ogImage` props.
4. Add the page to `sitemap.xml.ts`.
5. Add a nav link in `Header.astro` if it belongs in primary navigation.
6. Update `public/ai.txt` and `public/llm.txt`.

### Adding a new city
1. Edit `src/lib/geo.ts`.
2. Add to `CITY_DIRECTORY` array with `lat`, `lon`, `city`, `region`, `country`, `timezone`.
3. Cities must use valid IANA timezone strings.

### Adding a new chronotype
1. Edit `src/lib/light.ts`.
2. Add to `Chronotype` union type.
3. Add entries to `CHRONOTYPE_WAKE_SHIFT_MIN`, `CHRONOTYPE_DAWN_SHIFT_MIN`, and `CHRONOTYPE_LABELS`.
4. Update the quiz in `src/pages/chronotype.astro`.

### Adding new light bands
1. Edit `src/lib/light.ts`.
2. Add to `LIGHT_BANDS` array with `name`, `color`, `luxRange`, `description`.

### Changing the design
1. Edit `src/styles/global.css`.
2. Use `@layer tokens` for new custom properties.
3. Use `@layer components` for new component classes.
4. Use `@layer utilities` for helper classes.
5. Always test at `320px`, `640px`, `900px`, and `1440px` viewports.

---

## 🐛 Known Issues & Workarounds

| Issue | Workaround |
|-------|-----------|
| Astro 5 requires Node 22+ | Use Astro 4.16.x on Node 20 (change `package.json` before `npm install`) |
| `common-ancestor-path` ESM default export | Patch `node_modules/common-ancestor-path/dist/esm/index.js` to add `export default commonAncestorPath;` |
| Sandbox blocks socket binding | Dev server (`astro dev`) cannot run in restricted environments. Use `npm run build` instead. |
| Network restricted (`EAI_AGAIN`) | `npm install` may fail. Use `--prefer-offline` or copy `node_modules` from a sibling project. |

---

## 📋 Checklist for Changes

Before committing any change, verify:

- [ ] Does it respect the **no paid APIs** constraint?
- [ ] Does it respect the **privacy-first** constraint (no tracking, no cookies)?
- [ ] Does it work on **mobile** (320px–640px)?
- [ ] Does it respect `prefers-reduced-motion`?
- [ ] Are **all interactive elements keyboard accessible**?
- [ ] Does the page have `title`, `description`, `canonical`, and `ogImage`?
- [ ] Does `npm run build` succeed (or would it, if node_modules were present)?
- [ ] Are `public/ai.txt` and `public/llm.txt` updated if the product changed?
- [ ] Is `sitemap.xml.ts` updated if a new page was added?

---

## 🔗 External Resources

- [Astro Docs](https://docs.astro.build)
- [NOAA Solar Position Algorithm](https://gml.noaa.gov/grad/solcalc/)
- [CIE S 026:2018](https://cie.co.at/publications/cie-s-0262018)
- [MCTQ Paper (Roenneberg 2003)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2247737/)
- [Figueiro 2017 — Morning Light](https://journals.lww.com/jonmd/Fulltext/2017/03000/Impact_of_Morning_Bright_Light_on_Sleep.9.aspx)
- [Pollinations.ai](https://pollinations.ai)

---

## 💬 Human Contact

If you're stuck, ask about:
- Solar geometry edge cases (polar regions, leap seconds)
- Photobiology constants (lux thresholds, phase response)
- Design system additions (new tokens, new breakpoints)
- Deployment (Netlify build config, domain setup)

**Do NOT ask about:** adding backend services, paid APIs, analytics, or user accounts.

---

*Last updated: 2026-06-02 · SunCycle v1.0 · Day 3 of 30 Days 30 Apps*
