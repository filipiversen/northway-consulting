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

`/`, `/services`, `/projects`, `/notes`, `/about`, `/pricing`, `/start`, and
`/contact` are seeded for prerender; `crawlLinks` discovers every
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
    start/index.tsx          retainer checkout (Stripe Payment Element)
    start/complete.tsx       post-payment verification + billing portal
    api/checkout.ts          price lookup + incomplete-subscription create
    api/billing-portal.ts    portal session for paying customers
    api/stripe/webhook.ts    signature-verified event notifications
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

## Retainer checkout (Stripe)

`/start` is a self-hosted payment screen for the monthly retainer — our own
two-step flow (details → payment) built on Stripe's **Payment Element**, not
the Stripe-hosted checkout page. Card details render inside Stripe's iframe
and never touch this server.

How it flows:

1. The `CheckoutFlow` island fetches `GET /api/checkout`, which resolves the
   retainer price live from your Stripe account and returns it with the
   publishable key.
2. On "Continue to payment", `POST /api/checkout` finds-or-creates the Stripe
   customer by email and opens a subscription with
   `payment_behavior: "default_incomplete"` — nothing is owed until the first
   invoice is paid, and abandoned checkouts expire on their own.
3. The Payment Element confirms the invoice's PaymentIntent and redirects to
   `/start/complete`, which verifies the real payment status with Stripe.
4. `POST /api/billing-portal` (the "Manage billing" button) exchanges the
   payment's client secret for a billing-portal session, using
   `STRIPE_PORTAL_CONFIG_ID` so your pause/cancel rules apply.
5. `POST /api/stripe/webhook` verifies signatures and emails you (via the
   same Resend setup as the contact form) on the first paid invoice, failed
   payments, and cancellations.

Environment variables (`.env`/`.env.local` locally — see `.env.example` —
and Vercel env vars in production):

| Variable | Required | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | yes | Secret API key (test/sandbox or live). |
| `STRIPE_PUBLISHABLE_KEY` | yes | Publishable key for the Payment Element. |
| `STRIPE_WEBHOOK_SECRET` | for webhooks | Signing secret of the webhook endpoint. |
| `STRIPE_PORTAL_CONFIG_ID` | no | Billing-portal configuration (`bpc_…`). |
| `STRIPE_PRICE_ID` / `STRIPE_PRODUCT_ID` | no | Pin the exact price/product to sell. Unset: uses the account's single active recurring price. |

Local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# copy the printed whsec_... into STRIPE_WEBHOOK_SECRET
```

Until the Stripe keys are set, `/start` renders a friendly "checkout isn't
configured" state with a contact fallback.

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
