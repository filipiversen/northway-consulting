# Northway Consulting — content reference

This document records the full crawl of **clarks.consulting** (the reference site
this project's content is modeled on) and the plan for adapting it into
**Northway Consulting**, a firm-voiced AI consulting site.

Source crawled: 2026-06-24 · 27 pages · all `200 OK`.

---

## 1. Reference site at a glance (clarks.consulting)

- **Name:** Clark's Consulting (legal: Clark's Software Consulting LLC)
- **Positioning:** "AI & Software Consulting with Purpose." AI automation for
  small / mid-market teams. "Thirty years of shipping production software, now
  turned toward AI."
- **Founder:** Michael W. Clark, Des Moines, Iowa (Iowa State CSE).
- **Distinctive angle:** faith-based mission — proceeds fund a future homestead
  outside Des Moines. Heavy Midwest/Des Moines geography + 12-city × service SEO
  matrix. Roman-numeral year (MMXXVI), verse in footer.
- **Aesthetic:** "Mid-century × 1970s corporate × Saul Bass geometry. Sun rising
  behind a horizon — Apollo-era." Warm earth palette (rust/harvest/cream/forest),
  Space Grotesk + IBM Plex Serif + JetBrains Mono + Inter.

> Note: Michael Clark and the site owner (Filip Iversen) share employers
> (Lenders Cooperative, Denim Social) — i.e. colleagues. Northway reuses the
> *structure, IA, and professional substance* of Clark's, NOT its personal
> identity, faith mission, founder bio, or Des Moines geography.

### Information architecture

```
/                      home (numbered editorial sections 01–05)
/services              services hub (11 offerings + "how we work" + coverage)
/services/<slug>       per-service page (city-SEO landing)
/projects              case studies index ("Receipts")
/projects/<slug>       case study (LedgerLine, Denim Social, MongoDB SDK, …)
/blog (Notes)          "Field Notes" — 24 posts
/blog/<slug>           article
/about                 founder story + mission + values
/contact               discovery call + write + form
/ai-audit              free 1-hour "ghost employee" audit (lead magnet)
/locations             Des Moines HQ + 12 Midwest cities
/brand                 brand & press kit
/agentic-automation-costs   operating-cost transparency page
/privacy /terms        legal
```

Nav: **Services · Locations · Projects · Notes · About** + `Free Audit →` CTA.
Footer: tagline, LinkedIn/Brand/Costs, Services columns, Contact, legal line.

---

## 2. Page-by-page content notes

### Home — five numbered acts
- **Hero:** eyebrow `AI · Software · Consulting` → headline "Intelligent systems,
  **built with care.**" → sub about 30 yrs shipping, now AI. CTAs: Explore
  services / The mission.
- **01 · The Work** — "We ship practical AI, not pilots." 3 cards: Workflow
  Automation, AI Agent Development, Systems Integration.
- **02 · The Bigger Picture** — "Consulting with a calling." Mission + founder
  pull-quote.
- **03 · Featured Work** — "Real results from real engagements." 3 case cards.
- **04 · Field Notes** — "Latest from the practice." 3 recent posts.
- **05 · Start the conversation** — "Ready to automate with purpose?" CTA.

### Services hub
- Eyebrow "ten ways we work" → "A practice built **on judgment.**"
- Each service: a `We focus on …` one-liner + 4 numbered sub-capabilities.
- **How we work — "Four acts":** Discovery → Design → Build & Test → Deploy & Support.
- Local coverage grid (12 cities). [Northway drops the city matrix.]

**The 11 services (one-liner each):**
1. Operations Audit — find the work actually worth automating.
2. AI Agent Development — agents that do boring, repetitive work.
3. Workflow Automation — automate what's already on the team's plate.
4. Systems Integration — connect systems people move data between by hand.
5. AI Strategy Consulting — which AI investments actually pay off.
6. Fractional CTO — a senior engineering voice without taking equity.
7. Custom Software Development — software you need and can't buy off the shelf.
8. Website Design — fast real sites without the monthly SaaS tax. [→ Northway: Product & Interface Design]
9. Proactive Assistants — an agent on a queue/dataset that calls you when something needs attention.
10. Managed AI Operations — we run the AI systems we build for you.
11. RAG System Buildout — retrieval over your docs that answers honestly and cites sources.

### AI Audit (lead magnet) — strong, reusable
"Find the ghost employee you're already paying." Free 1-hour audit →
deliverables: manual-work inventory, real-dollar cost per workflow, ranked
roadmap, 2–3pg written PDF. Process: prep form → 45–60min call → report in 3–5
days. "Who it's for" + FAQ. Adapt nearly verbatim (firm voice).

### Projects / case studies
"Receipts. The systems we've actually shipped." Card = number, title,
description, tag chips, "Read the case →". Detail pages are long, structured
(platform → why-not-alternatives table → engineering highlights → stack →
why it matters). Heavy on AI-native dev workflow (Cursor/MCP/quality gates).

### Field Notes (blog)
"Ideas, receipts, and the occasional rant." Card = number, date, title,
description, tag chips. Topics: practical AI, agent harnesses, cost
optimization, memory benchmarks, "ghost employee", "AI as the great equalizer".

### About
Founder story (personal) → track record → what-you-get → community → **mission**
(faith homestead) → values (Faith/Excellence/Restoration/Purpose).
[Northway: firm voice; replace personal/faith content with firm philosophy.]

### Contact
"Let's talk. No pitch. No pressure." Discovery call + email + form (with
honeypot). 24h response promise.

### Brand
Palette, 4-family type system, logo usage, press guidelines.

---

## 3. Northway adaptation plan

**Identity**
- Name **Northway Consulting**; firm voice ("we"), no named founder on-page.
- Motif: **true north / wayfinding / north star.** Tagline direction:
  "Practical AI, pointed forward." / "Intelligent systems, built to ship."
- Positioning kept from reference: *ship practical AI, not pilots*; senior
  engineering judgment; results over hype.
- **Drop:** faith mission, Michael Clark bio, Des Moines/Midwest geography,
  12-city SEO matrix, Roman numerals, footer verse. Northway is **remote-first**.

**Visual identity** (re-skin existing oklch token system; keep SolidStart/Islands)
- Palette: **midnight indigo + warm "north-star" gold** on cool paper / deep
  navy. Distinct from Clark's warm-earth.
- Keep Geist Sans/Mono (already installed); optional Space Grotesk display.

**IA built for Northway**
```
/                home (numbered editorial sections)
/services        hub (data-driven from content/services.ts)
/services/<slug> detail template
/projects        case studies index
/projects/<slug> case study (MDX)
/notes           field notes index   (renamed from /writing)
/notes/<slug>    note (MDX)
/about           firm story / approach / values (firm voice)
/contact         discovery call + form
/ai-audit        ghost-employee audit lead magnet
```
Nav: **Services · Work · Notes · About** + `Free AI Audit →`.

**Services adopted (10):** operations-audit, ai-agents, workflow-automation,
systems-integration, ai-strategy, fractional-cto, custom-software, rag-systems,
managed-ai-ops, product-design.

**Content seeding (start-fresh, editable starting points):**
- Case studies: 2–3 firm-voiced cases drawn from real work (insurance platform
  rebuild, lending design system, AI-first feedback product).
- Field notes: ~3 firm-voiced posts adapted from the reference's strongest
  topics (ship-not-pilot, ghost employee, harness > model).

**Placeholders for the owner to fill:** contact email, LinkedIn/social URLs,
the philosophy/"why we exist" copy, real client logos/quotes, coverage regions.
