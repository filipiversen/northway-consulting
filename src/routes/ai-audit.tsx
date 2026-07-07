import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import PageShell from "~/components/PageShell";
import { NorthStar } from "~/components/PageShell";
import { profile } from "~/content/profile";

const DELIVERABLES = [
  {
    title: "Manual-work inventory",
    body: "A written list of every recurring manual process we surface, grouped by function — sales, ops, finance, support.",
  },
  {
    title: "Real-dollar cost per workflow",
    body: "Hours × loaded rate. The math that turns “we should automate this someday” into “this is costing us $47k a year.”",
  },
  {
    title: "Ranked roadmap",
    body: "The 3–5 highest-ROI automations, in priority order, with estimated effort, expected payback, and which systems touch which.",
  },
  {
    title: "A written report",
    body: "A 2–3 page PDF you can hand to partners or leadership. Yours to keep. No login required.",
  },
];

const PROCESS = [
  {
    when: "Before the call",
    title: "A 5-minute prep form",
    body: "A short form about your team size, tools, and top-of-mind frustrations. Takes five minutes; saves us thirty on the call.",
  },
  {
    when: "The call · 45–60 min",
    title: "A conversation, not an interrogation",
    body: "We walk through your operations together. We ask questions; you show screens and tools. We capture manual processes as we go.",
  },
  {
    when: "3–5 days after",
    title: "Your written report lands",
    body: "A PDF with the inventory, the cost math, and the ranked roadmap. No follow-up pressure — the next email is yours to send.",
  },
];

const FIT = [
  "Your team is 20–500 people, with operations heavy enough to feel it.",
  "Someone already builds Zapier or Make workflows — they're just stretched thin.",
  "You've heard “we should automate this” about the same three processes for two years.",
  "Your CRM, project management, and finance tools don't talk to each other cleanly.",
  "You've explored AI tools but don't know which are worth the subscription.",
  "You're hiring for ops or support to handle volume you suspect shouldn't exist.",
];

const FAQ = [
  {
    q: "Is it actually free?",
    a: "Yes. One hour of our time plus the written report, at no cost. Consulting works on trust, and an audit is the cheapest way for both of us to find out if we're a fit.",
  },
  {
    q: "What if we decide not to build with you?",
    a: "That's fine. The roadmap is yours to implement internally, hire out, or ignore. We'd rather you do what's right for your team than feel obligated.",
  },
  {
    q: "Who should be on the call?",
    a: "Whoever has the clearest view of operational pain — usually a COO, Head of Ops, or founder. If a few people are relevant, invite them.",
  },
  {
    q: "What happens to our information?",
    a: "Nothing goes anywhere. Notes stay in our engagement file. We never share company names or specifics without explicit written permission.",
  },
];

export default function AiAudit() {
  return (
    <PageShell wide>
      <Title>Free AI Automation Audit — {profile.name}</Title>
      <Meta
        name="description"
        content="A free 1-hour audit to find the ghost employee your team is already paying. Written roadmap, real-dollar costs, no obligation."
      />

      {/* Hero */}
      <section class="mb-20 max-w-3xl">
        <p
          data-hero-step="1"
          class="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          <NorthStar class="h-3 w-3" />
          The Audit · Free · 1 hour
        </p>
        <h1
          data-hero-step="2"
          class="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl"
        >
          Find the ghost employee{" "}
          <span class="text-fg-muted">you're already paying.</span>
        </h1>
        <p
          data-hero-step="3"
          class="mt-6 max-w-[38rem] text-pretty text-base leading-relaxed text-fg-muted md:text-lg"
        >
          A free, no-obligation audit. We spend an hour mapping your team's
          manual work, cost it out in real dollars, and leave you with a written
          roadmap — whether you build with us or not.
        </p>
        <div data-hero-step="4" class="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}?subject=AI%20Audit%20request`}
            class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
          >
            Book your audit →
          </a>
          <a
            href="/contact"
            class="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
          >
            Ask a question first
          </a>
        </div>
      </section>

      {/* 01 The premise */}
      <section data-hero-step="5" class="mb-20 max-w-2xl">
        <p class="mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
          <span aria-hidden="true" class="h-3 w-px bg-accent" />
          The premise
        </p>
        <h2 class="mb-4 font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Most teams have a ghost employee.
        </h2>
        <div class="space-y-4 text-pretty leading-relaxed text-fg-muted">
          <p>
            It's the accumulated weight of manual work your team has quietly
            built around for years. Pipeline updates copied between tools.
            Follow-ups tracked in notebooks. Reports rebuilt from scratch every
            month.
          </p>
          <p>
            None of it feels worth fixing on its own. Together, it's typically
            10–30 hours a week you're already paying for — just not in a
            single line item.
          </p>
          <p class="text-fg">
            The audit finds it, names it, and prices it. Then we hand you a
            roadmap for which pieces are worth automating, in what order, with
            what expected payback.
          </p>
        </div>
      </section>

      {/* 02 Deliverables */}
      <section data-hero-step="6" class="mb-20">
        <p class="mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
          <span aria-hidden="true" class="h-3 w-px bg-accent" />
          What you get
        </p>
        <h2 class="mb-8 font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Concrete deliverables. No fluff.
        </h2>
        <ul class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          <For each={DELIVERABLES}>
            {(d) => (
              <li class="bg-bg p-6">
                <h3 class="font-display text-base font-semibold tracking-tight">
                  {d.title}
                </h3>
                <p class="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {d.body}
                </p>
              </li>
            )}
          </For>
        </ul>
      </section>

      {/* 03 Process */}
      <section data-hero-step="7" class="mb-20">
        <p class="mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
          <span aria-hidden="true" class="h-3 w-px bg-accent" />
          The process
        </p>
        <h2 class="mb-8 font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          One hour. Three steps. No sales pitch.
        </h2>
        <ol class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <For each={PROCESS}>
            {(step, i) => (
              <li class="rounded-lg border border-line p-6">
                <div class="flex items-baseline justify-between">
                  <span class="font-mono text-xs tabular-nums text-accent">
                    {String(i() + 1).padStart(2, "0")}
                  </span>
                  <span class="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-fg-faint">
                    {step.when}
                  </span>
                </div>
                <h3 class="mt-3 font-display text-base font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p class="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {step.body}
                </p>
              </li>
            )}
          </For>
        </ol>
      </section>

      {/* 04 Who it's for */}
      <section data-hero-step="8" class="mb-20 max-w-2xl">
        <p class="mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
          <span aria-hidden="true" class="h-3 w-px bg-accent" />
          Who this is for
        </p>
        <h2 class="mb-6 font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          If any of these sound like you, book it.
        </h2>
        <ul class="space-y-3">
          <For each={FIT}>
            {(item) => (
              <li class="flex items-baseline gap-3">
                <span aria-hidden="true" class="text-accent">
                  ✦
                </span>
                <span class="text-pretty leading-relaxed text-fg-muted">
                  {item}
                </span>
              </li>
            )}
          </For>
        </ul>
      </section>

      {/* 05 FAQ */}
      <section data-hero-step="9" class="mb-20">
        <p class="mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
          <span aria-hidden="true" class="h-3 w-px bg-accent" />
          Common questions
        </p>
        <h2 class="mb-8 font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          What people ask before booking.
        </h2>
        <div class="divide-y divide-line border-y border-line">
          <For each={FAQ}>
            {(item) => (
              <details class="group py-4">
                <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {item.q}
                  <span
                    aria-hidden="true"
                    class="font-mono text-fg-faint transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p class="mt-3 max-w-2xl text-pretty leading-relaxed text-fg-muted">
                  {item.a}
                </p>
              </details>
            )}
          </For>
        </div>
      </section>

      {/* CTA — the night sky */}
      <section
        data-hero-step="10"
        class="rounded-lg border border-night-line bg-night p-8 text-center text-night-fg md:p-14"
      >
        <NorthStar class="mx-auto mb-4 h-6 w-6 text-star" />
        <h2 class="mx-auto max-w-xl font-display text-2xl font-bold tracking-tight text-balance md:text-4xl">
          The audit takes an hour. The roadmap is yours.
        </h2>
        <p class="mx-auto mt-4 max-w-md text-pretty text-night-muted">
          No credit card. No hard sell. Just a conversation and the written
          deliverables.
        </p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${profile.email}?subject=AI%20Audit%20request`}
            class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
          >
            Book your audit →
          </a>
          <a
            href="/contact"
            class="border border-night-line px-5 py-2.5 text-sm font-medium text-night-fg transition-colors hover-hover:hover:border-star"
          >
            Send a note instead
          </a>
        </div>
      </section>
    </PageShell>
  );
}
