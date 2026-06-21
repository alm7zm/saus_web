# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Site

No build step required. Open `index.html` directly in a browser:

```
# Windows — opens in default browser
start index.html

# Or serve locally to avoid ES module CORS issues
npx serve .         # requires Node.js
python -m http.server 8080
```

ES modules (`type="module"` scripts) require a local server when testing in Chrome; Firefox and Edge allow `file://` access.

## Project Structure

```
suas-website/
├── index.html          ← Single-page site — all content, structure, and ARIA here
├── assets/             ← Media files (DO NOT rename or restructure)
│   ├── flying_drone.mp4    hero background + vehicle visual panel
│   ├── drone_front.webp    vehicle photo + video poster fallback
│   ├── team.jpeg           team group photo
│   ├── blog1.mp4           blog entry 1 video
│   ├── blog2.mp4           blog entry 2 video
│   └── team_logo.jpeg      logo in nav, hero, footer, favicon
├── css/
│   ├── tokens.css      ← Edit this first — all CSS custom properties live here
│   ├── reset.css       ← Minimal normalize; rarely needs editing
│   ├── base.css        ← Body, typography, .btn, .card, .section__* globals
│   ├── layout.css      ← .container, .section, .grid-2/3/4
│   ├── utils.css       ← .visually-hidden, .skip-link, .badge, print
│   ├── nav.css         ← Sticky header, hamburger, mobile menu
│   ├── hero.css        ← Fullscreen video hero, mobile poster fallback
│   ├── stats.css       ← Animated counter bar
│   ├── vehicle.css     ← Tab interface, specs table, subsystem cards, timeline
│   ├── team.css        ← Team cards, group photo
│   ├── blog.css        ← Blog cards, filter buttons
│   ├── sponsors.css    ← Tiered sponsor logo grid
│   ├── contact.css     ← Contact form, footer
│   └── search.css      ← Search overlay and results
└── js/
    ├── main.js         ← Init orchestrator; imports all modules
    ├── nav.js          ← Sticky behavior, hamburger, active-link tracking
    ├── hero.js         ← Reduced-motion video guard
    ├── vehicle.js      ← ARIA tab/panel switching with arrow-key support
    ├── blog.js         ← Category filter buttons
    ├── search.js       ← Index builder, overlay, keyboard nav, focus trap
    ├── lazyVideo.js    ← IntersectionObserver deferred video loading
    └── counter.js      ← Animated stats counters
```

## Content Placeholders

All placeholder values use `[CAPS_FORMAT]`. Find them all:

```
grep -rn "\[" index.html
```

Required substitutions before competition submission:

| Placeholder | Where | What to fill |
|---|---|---|
| `[TEAM_NAME]` | title, H1, nav, footer, all alt text | e.g. "Falcon UAS" |
| `[UNIVERSITY_NAME]` | hero, footer, contact, team caption | e.g. "State University" |
| `[VEHICLE_NAME]` | vehicle heading, figcaptions, specs | e.g. "Falcon-V3" |
| `[team@university.edu]` | contact form, footer, team section | Team email |
| `[XX]` in team cards | `.team-card__initials` | First/last initials |
| Stats `data-target` values | `.stats__number` | Numeric values |
| Specs table cells | `<td>` in specs table | Technical values |
| Build timeline entries | `build-timeline__item` | Dates + descriptions |
| Blog post content | `blog-card__title` + `__excerpt` | Actual post content |
| Sponsor entries | `.sponsor-logo` elements | Name, URL, logo img |

## Architecture Notes

### Single-page with smooth scroll
All sections are on one page (`index.html`). Navigation uses anchor links (`#vehicle`, `#team`, etc.). `nav.js` uses `IntersectionObserver` to update `aria-current` on the active nav link as the user scrolls.

### CSS cascade order matters
`<link>` tags in `index.html` must load in this order: reset → tokens → base → layout → utils → component files. Each layer depends on custom properties defined in the previous one.

### ES modules (no bundler)
All JS files are loaded as `type="module"`. `main.js` imports and initializes all other modules. No transpilation or bundling needed. This does require serving from a local server (not `file://`) due to CORS policy for modules.

### Video lazy loading
Blog and vehicle panel videos use `data-src` on `<source>` elements instead of `src`. `lazyVideo.js` swaps them to real `src` when the video enters the viewport (200px margin). Only the hero video loads immediately.

### Site search
`search.js` builds an in-memory index from all on-page text at `DOMContentLoaded`. Open with the search button in nav or `Ctrl+K` / `Cmd+K`. Results link to section anchors. Keyboard: `↑↓` navigate, `Enter` selects, `Escape` closes.

## Rubric Scoring Reference (SUAS 2026)

| Category | Weight | Outstanding Requirements |
|---|---|---|
| Team Information | 20% | Team name, contact email, team member list with roles, sponsor list, current year references |
| Vehicle Design Documentation | 40% | Visual docs (photos + videos), technical docs (specs, subsystem descriptions, design decisions, procedures), historical docs (build timeline ≥4 entries) |
| Website Quality | 40% | Accessible (keyboard nav, screen reader, WCAG contrast), mobile-responsive, intuitive navigation, site search functional, visually clear hierarchy |

**Target: 95–100/100**
