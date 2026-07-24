<!-- xonettn -->
<div align="center">

# ☀️ Suncycle

Day 3 of 30 Apps in 30 Days Netlify Challenge June 2026


![Astro](https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=white) ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)

![Deploy](https://img.shields.io/badge/Deployed-Netlify-00C7B7?logo=netlify&logoColor=white)

</div>

---

## 📋 Overview
Day 3 of 30 Apps in 30 Days Netlify Challenge June 2026

## 📦 Tech Stack
- Astro
- Netlify (deployed)

## 🗂️ Project Structure
```
SunCycle/
  - public
  - scripts
  - src
  (35 files total)
```

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js (v18+)
- npm or yarn

### 📦 Installation
```bash
git clone https://github.com/1nc0gn30/SunCycle.git
cd SunCycle
npm install
```

### 💻 Development
```bash
npm run dev
```

### 🔨 Build
```bash
npm run build
```

### ⚙️ Available Scripts
  npm run dev - astro dev
  npm run start - astro dev
  npm run build - astro build
  npm run preview - astro preview
  npm run astro - astro

## 📂 Original README
<details>
<summary>Click to expand original README</summary>

# ☀️ SunCycle

> **Your day, lit like your biology wants it.**

<div align="center">

[![Astro](https://img.shields.io/badge/Astro-5.0-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?logo=netlify&logoColor=white)](https://netlify.com)
[![Zero APIs](https://img.shields.io/badge/APIs-Called%3A%200-success)](https://suncycle-day3.netlify.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Day 3 of the 30 Days 30 Apps Netlify Challenge**  
*Built by Neal Frazier · June 2026*

</div>

---

## 🌅 What is SunCycle?

SunCycle is a **free, static, privacy-first circadian light planner** that computes your personal light schedule from **real solar geometry** and **peer-reviewed photobiology**. No accounts. No tracking. No paid APIs. No backend server.

It answers a simple question: *When should I get bright light, dim light, and avoid blue light — based on where I am and how my biology actually works?*

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR LOCATION ──► SOLAR GEOMETRY ──► PHOTOBIOLOGY MODEL   │
│        │                  │                    │             │
│        ▼                  ▼                    ▼             │
│   [lat,lon,tz]    sunrise/sunset      4-window plan        │
│                        noon            personalized        │
│                    golden hour        to your biology      │
│                     blue hour                                │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌍 **Real Solar Geometry** | Computes sunrise, sunset, solar noon, civil twilight, golden & blue hours using NOAA-grade algorithms |
| 🔬 **Photobiology-Backed** | Light prescriptions follow CIE S 026:2018, Brainard, Figueiro, Zeitzer, and Provencio |
| 🦉 **Chronotype-Aware** | Lark / Dove / Owl quiz personalizes every window to match your biology |
| 📍 **3 Ways to Locate** | City picker, browser geolocation (with consent), or manual coordinates |
| 🔗 **Deep-Linkable Plans** | Every plan generates a shareable URL with lat/lon/tz/date/chronotype |
| 🔒 **Zero Data Collection** | No cookies, no analytics, no server storage. Everything runs in your browser |
| 📱 **Fully Responsive** | Works on mobile, tablet, and desktop. Touch-friendly. Accessible |
| 🎨 **2026 Design** | Dark observatory aesthetic with fluid typography, glass panels, and subtle animations |

---

## 🧠 The Science

Your circadian clock is a **24-hour molecular oscillator** in nearly every cell. Light — specifically melanopic light peaking at **480 nm** — is its primary synchronizer ("zeitgeber").

### The Four Windows

| Window | When | Lux Target | Why It Matters |
|--------|------|-----------|----------------|
| 🌅 **Morning Bright Light** | ~30 min within 1h of waking | 1,000–3,000 lux | Strongest lever for advancing circadian phase |
| ☀️ **Daylight Maintenance** | 2h centered on solar noon | 2,000–10,000 lux | Sustains the central oscillator |
| 🌇 **Evening Dim-Down** | ~2h before target sleep | 10–50 lux | Lets melatonin rise naturally |
| 🔴 **Blue-Light Cutoff** | 90 min before sleep | < 30 lux | Stops melanopsin suppression |

### Sources

- **Brainard et al.** (2001, 2015) — ipRGC spectral sensitivity & melanopic lux
- **CIE S 026:2018** — melanopic Equivalent Daylight Illuminance (mel-EDI)
- **Figueiro et al.** (2017) — morning light for circadian phase advancement
- **Zeitzer et al.** (2000) — evening light avoidance and phase response
- **Provencio et al.** (2002) — melanopsin discovery in ipRGCs
- **Pauley et al.** (2004) — daylight exposure and sleep quality
- **Roenneberg et al.** (2003, 2007) — Munich Chronotype Questionnaire (MCTQ)

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/yourusername/suncycle.git
cd suncycle

# Install dependencies
npm install

# Run dev server
npm run dev
# → http://localhost:4321

# Build for production
npm run build
# → Output in dist/
```

**Requirements:** Node.js 20+ (Astro 4) or Node.js 22+ (Astro 5)

---

## 📁 Project Structure

```
suncycle/
├── public/                          # Static assets
│   ├── favicon.svg                  # Glowing sun favicon
│   ├── og-default.svg               # OG/Twitter card
│   ├── manifest.webmanifest          # PWA manifest
│   ├── robots.txt                   # Crawler directives
│   ├── sitemap.xml                  # SEO sitemap
│   ├── rss.xml                      # RSS feed
│   ├── ai.txt                       # AI crawler summary
│   └── llm.txt                      # LLM context file
│
├── src/
│   ├── components/                  # Astro components
│   │   ├── Header.astro             # Sticky nav + mobile hamburger
│   │   ├── Footer.astro             # Site footer
│   │   └── PollinationsImg.astro    # AI image generator component
│   │
│   ├── layouts/
│   │   └── Base.astro               # HTML shell with SEO, OG, JSON-LD
│   │
│   ├── lib/                         # Core logic (no framework deps)
│   │   ├── sun.ts                   # Solar geometry (NOAA/Spencer)
│   │   ├── light.ts                 # Photobiology + chronotype model
│   │   ├── geo.ts                   # City directory + timezone helpers
│   │   └── url-state.ts             # Deep-linkable URL encoding
│   │
│   ├── pages/                       # Routes
│   │   ├── index.astro              # Interactive planner (main)
│   │   ├── science.astro            # Photobiology explainer
│   │   ├── chronotype.astro         # 5-question chronotype quiz
│   │   ├── about.astro              # About, privacy, limitations
│   │   ├── sitemap.xml.ts           # Dynamic sitemap
│   │   └── rss.xml.ts               # Dynamic RSS feed
│   │
│   └── styles/
│       └── global.css               # 2026 design system with CSS layers
│
├── astro.config.mjs                 # Astro config (static, prefetch)
├── netlify.toml                     # Netlify build + headers + redirects
├── tsconfig.json                    # Strict TypeScript
├── package.json
└── README.md                        # This file
```

---

## 🎨 Design System

```
Palette:  Warm Observatory
┌────────────────────────────────────────────────────────┐
│  Background:  #06040f → #0c0918 → #121025              │
│  Ink:        #ffffff → #f0edf5 → #b8b0cc → #7a7390   │
│  Accent:     #f4b860 (gold) → #6f8cff (sky)            │
│  Good/Warn:  #6ce2a0 / #f4b860 / #ff7a6a               │
└────────────────────────────────────────────────────────┘

Typography:
  Display: Instrument Serif (Google Fonts)
  Body:    System sans-serif stack
  Mono:    JetBrains Mono / Fira Code

Features:
  • @layer architecture (reset → tokens → base → components → utilities)
  • clamp() fluid typography (mobile → desktop)
  • CSS custom properties for theming
  • Glassmorphism panels with backdrop-filter
  • Subtle entrance animations (fadeInUp)
  • prefers-reduced-motion respected
```

---

## 🔧 How It Works

### Solar Geometry
```typescript
import { computeSolarDay } from './src/lib/sun';

const solar = computeSolarDay(
  new Date(),      // date
  40.7128,         // latitude (NYC)
  -74.0060,        // longitude
  'America/New_York'
);

// Returns:
// {
//   sunrise: Date,      // zoned local time
//   sunset: Date,
//   solarNoon: Date,
//   civilDawn: Date,
//   civilDusk: Date,
//   goldenHourMorning: [Date, Date],
//   goldenHourEvening: [Date, Date],
//   blueHourMorning: [Date, Date],
//   blueHourEvening: [Date, Date],
//   daylightMinutes: number
// }
```

### Light Prescription
```typescript
import { derivePrescription } from './src/lib/light';

const prescription = derivePrescription(solar, 'dove');
// Returns 4 windows with labels, times, lux targets, and source citations
```

### URL State
```typescript
import { writeStateToUrl, readStateFromUrl } from './src/lib/url-state';

const url = writeStateToUrl({ lat: 40.71, lon: -74.01, tz: 'America/New_York' }, 'https://suncycle-day3.netlify.app/');
// → https://suncycle-day3.netlify.app/?lat=40.7100&lon=-74.0100&tz=America/New_York

const state = readStateFromUrl(location.search);
// → { lat: 40.71, lon: -74.01, tz: 'America/New_York' }
```

---

## 📱 Pages

| Page | Route | What It Does |
|------|-------|--------------|
| **Planner** | `/` | Main interactive tool — location, date, chronotype, timeline, windows, share |
| **Science** | `/science` | Melanopsin, ipRGCs, illuminance bands, phase response curve, research timeline |
| **Chronotype** | `/chronotype` | 5-question self-assessment (lark/dove/owl) with personalized results |
| **About** | `/about` | Philosophy, privacy, methodology, source citations, limitations |
| **Sitemap** | `/sitemap.xml` | Auto-generated XML sitemap |
| **RSS** | `/rss.xml` | Auto-generated RSS feed |

---

## 🔒 Privacy

- **No data leaves your browser.** SunCycle is a fully static site.
- **No cookies, no analytics, no third-party scripts.**
- **Geolocation** is opt-in (you must click "Use my location").
- **No server-side storage.** Plans are shared via URL query parameters only.
- **No AI calls.** The Pollinations.ai images are static URLs, not API calls.

---

## 🚧 Limitations

| Limitation | Details |
|-------------|---------|
| Solar accuracy | ~±1 minute for non-polar latitudes. Polar regions near solstice may deviate more |
| Medical advice | Population-level guidance only. Not a substitute for a sleep specialist |
| Weather | Not modeled. Overcast outdoor light is still 2,000–10,000 lux — sufficient for entrainment |
| Shift work | Not supported in v1.0. Anchors to local sunrise/sunset |
| Chronotype quiz | Simplified 5-question screen, not a full MCTQ assessment |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| Framework | [Astro 5](https://astro.build) (static output) |
| Language | TypeScript (strict mode) |
| Styling | Vanilla CSS with `@layer` architecture |
| Fonts | Instrument Serif + system stack |
| Icons | Inline SVG |
| Images | Pollinations.ai (on-the-fly) or self-hosted |
| Deploy | [Netlify](https://netlify.com) |

</div>

---

## 📝 SEO & Web Standards

- ✅ Per-page title, description, canonical URL
- ✅ Open Graph + Twitter Cards
- ✅ JSON-LD `WebSite` schema with SearchAction
- ✅ `sitemap.xml` + `robots.txt` + `manifest.webmanifest`
- ✅ RSS feed
- ✅ `llm.txt` + `ai.txt` for AI crawlers
- ✅ Semantic HTML + ARIA labels
- ✅ Skip link + keyboard navigation
- ✅ prefers-reduced-motion support

---

## 🤝 Contributing

This is part of a personal 30-day challenge, but feedback and PRs are welcome:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-thing`
3. Make your changes
4. Run `npm run build` to verify
5. Submit a pull request

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **NOAA** for the solar position algorithm
- **CIE** for the S 026:2018 melanopic standard
- **Isaac Schlueter** for `common-ancestor-path` (patched for Node 20 compat)
- **Netlify** for the generous free tier
- **Pollinations.ai** for the beautiful generative imagery

---

<div align="center">

**[☀️ Try SunCycle Live](https://suncycle-day3.netlify.app)** · Built with light, geometry, and zero APIs

*Part of the 30 Days 30 Apps Netlify Challenge · Day 3*

</div>

</details>

## 📝 TODO / Roadmap
- [ ] Add unit tests
- [ ] Add LICENSE file
- [ ] Add Dockerfile for containerized deployment
- [ ] Add CI/CD pipeline
- [ ] Add contribution guidelines (CONTRIBUTING.md)
- [ ] Improve error handling and edge cases
- [ ] Add environment variable documentation
- [ ] Update dependencies to latest versions
- [ ] Add code comments and inline documentation

## 🚀 Deployment
This project is deployed on Netlify. See netlify.toml for configuration.

## 👤 Author
**Neal Frazier** - [@AshAmplifies](https://github.com/1nc0gn30)

## 🔗 Links
- GitHub: https://github.com/1nc0gn30/SunCycle

---
*This README was enhanced as part of the neals-projects-2026 batch update.*

---

<div align="center">

**[xonettn]** · Built by [Neal Frazier](https://github.com/1nc0gn30) · [@AshAmplifies](https://twitter.com/AshAmplifies)

</div>
