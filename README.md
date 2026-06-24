# northway.consulting

Northway Consulting — **AI consulting & engineering**. SolidStart in
**Islands mode**, deployed to Vercel.

The content and information architecture are modeled on a reference consulting
site (documented in [`docs/content-reference.md`](docs/content-reference.md))
and rebuilt under Northway's own firm-voiced identity and a midnight-indigo /
north-star visual system.

## Stack

- [SolidStart](https://docs.solidjs.com/solid-start) (`experimental.islands: true`)
- TypeScript, Vite (via Vinxi)
- Tailwind CSS v4 (CSS-first config in `src/styles/app.css`)
- MDX for case studies and field notes (`@mdx-js/rollup` + `solid-mdx`)
- Self-hosted Geist Sans / Geist Mono + Space Grotesk (display) via Fontsource

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build        # emits .vercel/output/ (prerendered)
```

`/`, `/services`, `/projects`, `/notes`, `/about`, `/contact`, and `/ai-audit`
are seeded for prerender; `crawlLinks` discovers every `/services/[slug]`,
`/projects/[slug]`, and `/notes/[slug]` from the index pages (23 routes total).

## Layout

```
src/
  routes/
    index.tsx                home — numbered editorial sections
    services/index.tsx       services hub (data-driven)
    services/[slug].tsx      service detail
    projects/index.tsx       work / case-study index
    projects/[slug].tsx      case study (MDX)
    notes/index.tsx          field notes index
    notes/[slug].tsx         field note (MDX)
    about.tsx  contact.tsx  ai-audit.tsx
  content/
    profile.ts               brand + contact identity   <- edit me
    services.ts              the service catalog (10)
    projects/*.mdx           case studies
    notes/*.mdx              field notes
  components/                PageShell, SectionHeading, lists + islands/
  styles/app.css             Tailwind v4 + Northway tokens + view transitions
docs/content-reference.md    the crawl + adaptation plan
```

## Things to personalize before launch

These are intentional placeholders (also flagged in-code):

- **`src/content/profile.ts`** — `email`, the LinkedIn URL, and the coverage
  line.
- **`src/routes/contact.tsx`** — `FORM_ACTION` points at a placeholder; wire it
  to a real handler (Formspree/Basin ID, or a Vercel function at `/api/contact`).
  The email + mailto links already work.
- **`src/routes/about.tsx`** — add real team/founder bios, named clients, and
  logos when you're ready (kept firm-voiced and unnamed for now).
- **Case studies** in `src/content/projects/` are drawn from real work; confirm
  client names / links / permissions before publishing.

## Deployment

Vercel auto-detects SolidStart. The Nitro Vercel preset emits a complete
`.vercel/output/` on `npm run build`.

1. Push to GitHub and import the repo in Vercel (**Add New... -> Project**).
2. **Settings -> Domains** -> add `northway.consulting` (and `www`). Vercel
   guides the DNS records.

### CLI deploy (alternative)

```bash
npm i -g vercel
vercel link
npm run build
vercel deploy --prebuilt --prod
```
