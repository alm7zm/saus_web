# Industry 4.0 Aerospace — SUAS 2026 Website

Static site for the Industry 4.0 Aerospace competition team at Meridian Institute of Technology. Built with EJS templates + a Node.js build script. Deployable to GitHub Pages.

## Quick Start

```bash
npm install
npm run build          # generates dist/
npm start              # build + serve dist/ at localhost:3000
```

## Project Structure

```
saus_main/
├── src/
│   ├── pages/         EJS page templates (index, team, vehicle, blog, sponsors, contact, team-member, blog-post)
│   ├── components/    EJS partials (header, footer, navigation, team-card, blog-card, sponsor-card, vehicle-card)
│   └── data/          JSON content files (see below)
├── css/
│   ├── variables.css       Design tokens (colors, fonts, shadows, spacing)
│   ├── reset.css           Browser normalize
│   ├── typography.css      Heading + body defaults
│   ├── layout.css          Container, section, page-hero, breadcrumb
│   ├── utilities.css       Badges, visually-hidden, reveal animation, focus-visible
│   ├── responsive.css      Catch-all responsive overrides
│   ├── components/         Header, nav, footer, cards, buttons, forms
│   └── pages/              Per-page styles (home, team, vehicle, blog, sponsors, contact)
├── js/
│   ├── main.js             Import + init all modules (ES module entry point)
│   ├── data-loader.js      Stub for future runtime JSON fetching
│   └── modules/            navigation, animations, utilities, vehicle, blog, team, sponsors
├── assets/                 Images + videos (copied to dist/assets/ unchanged)
├── build.js                Build orchestrator
├── package.json
└── dist/                   Generated output (gitignored) — deploy this folder
```

## Content Data Files

All content lives in `src/data/`. Edit these JSON files to update the site:

| File | Contains |
|---|---|
| `team.json` | Team name, university, email, faculty advisor, all 8 members (name, role, bio, contributions, etc.) |
| `vehicles.json` | Vehicle specs, performance metrics, subsystem descriptions, gallery items |
| `blog.json` | All blog posts (title, date, authors, category, excerpt, content HTML) + sidebar data |
| `sponsors.json` | Sponsor tiers (Platinum/Gold/Silver) with descriptions and contributions |
| `achievements.json` | Hero stats, competition info, impact cards |

## Adding Content

### New Team Member
1. Add a member object to `src/data/team.json` → `members[]`
2. Include: `name`, `initials`, `slug` (kebab-case), `role`, `badgeVariant`, `department`, `year`, `avatarColor`, `bio`, `contributions[]`, `background`, `email`
3. Run `npm run build` — a new page is generated at `dist/team/{slug}.html`

### New Blog Post
1. Add a post object to `src/data/blog.json` → `posts[]`
2. Include: `slug`, `title`, `date`, `dateFormatted`, `authors[]`, `authorsDisplay`, `category`, `categoryClass`, `readTime`, `mediaType` (image/video), `mediaSrc`, `mediaPoster`, `mediaAlt`, `excerpt`, `content` (HTML string)
3. Run `npm run build` — a new page is generated at `dist/blog/{slug}.html`

### New Sponsor
1. Add a sponsor to the appropriate tier in `src/data/sponsors.json`
2. Run `npm run build`

## CSS Design Tokens

Edit `css/variables.css` to change the visual design:
- `--blue` (#2878BE) — primary brand color
- `--orange` (#F47820) — accent color
- `--dark` (#0F1420) — dark background
- `--font-heading` — Montserrat (Google Fonts)
- `--font-body` — Inter (Google Fonts)

## Deployment

### GitHub Pages (Automatic)
Push to `main` branch — the GitHub Actions workflow in `.github/workflows/deploy.yml` automatically builds and deploys to GitHub Pages.

**First-time setup:**
1. Go to repo Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main

### Manual Deploy
```bash
npm run build
# Upload dist/ contents to any static host (Netlify, Vercel, S3, etc.)
```

## JS Architecture

- All scripts are ES modules (`type="module"`)
- `js/main.js` imports and initializes navigation, animations, and utilities on every page
- Page-specific modules (vehicle, blog, team) are dynamically imported based on `document.body.dataset.page`
- No bundler needed — serve `dist/` from any static host or local server

**Note:** ES modules require a local server (not `file://`) due to CORS. Use `npm start` or `npx serve dist`.
