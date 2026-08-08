# northway.consulting

Northway Consulting — **AI consulting & engineering**. SolidStart in
**Islands mode**, deployed to Vercel.

The content and information architecture are modeled on a reference consulting
site (documented in [`docs/content-reference.md`](docs/content-reference.md))
and rebuilt under Northway's own firm-voiced identity: the "Grayscale +
Signal" ops-console design — monochrome ink on near-black, IBM Plex Mono
throughout, and signal green reserved for the places automation goes live.

## Stack

- [SolidStart](https://docs.solidjs.com/solid-start) (`experimental.islands: true`)
- TypeScript, Vite (via Vinxi)
- Tailwind CSS v4 (CSS-first config in `src/styles/app.css`)
- MDX for case studies and field notes (`@mdx-js/rollup` + `solid-mdx`)
- Self-hosted IBM Plex Mono via Fontsource (the site's single typeface)

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build        # emits .vercel/output/ (prerendered)
```

`/`, `/services`, `/projects`, `/notes`, `/about`, `/pricing`, and `/contact`
are seeded for prerender; `crawlLinks` discovers every
`/services/[slug]`, `/projects/[slug]`, and `/notes/[slug]` from the index
pages. The free AI audit lives on `/contact#audit` (old `/ai-audit` links
redirect there).

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
    about.tsx  pricing.tsx  contact.tsx
  content/
    profile.ts               brand + contact identity   <- edit me
    services.ts              the service catalog (10)
    pricing.ts               monthly retainer offer
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
- **Contact form / Resend** — the form posts to `src/routes/api/contact.ts`,
  which sends via Resend. Set `RESEND_API_KEY` (see [Contact form](#contact-form)
  below). Until it's set, the endpoint returns a friendly "email isn't
  configured" message and the mailto links still work.
- **`src/routes/about.tsx`** — add real team/founder bios, named clients, and
  logos when you're ready (kept firm-voiced and unnamed for now).
- **Case studies** in `src/content/projects/` are drawn from real work; confirm
  client names / links / permissions before publishing.

## Contact form

The form on `/contact` posts to `src/routes/api/contact.ts`, which validates the
input (with a honeypot for bots) and sends the message via the **Resend** REST
API. With JS it submits inline (the `ContactFormEnhancer` island shows success /
error in place); without JS it posts natively and the server redirects to
`/thanks`.

Configure these environment variables — in `.env` for local dev (copy
`.env.example`), and in **Vercel → Settings → Environment Variables** for prod:

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Your Resend API key (`resend.com/api-keys`). |
| `CONTACT_TO_EMAIL` | no | Inbox that receives submissions. Defaults to `profile.email`. |
| `CONTACT_FROM_EMAIL` | no | Verified Resend sender. Defaults to `onboarding@resend.dev` (testing only — delivers to your Resend account email). |

To send from `contact@northway.consulting`, verify the `northway.consulting`
domain in Resend (add the DNS records it gives you), then set
`CONTACT_FROM_EMAIL="Northway Consulting <contact@northway.consulting>"`.

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
