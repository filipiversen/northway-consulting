import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import PageShell from "~/components/PageShell";
import { profile } from "~/content/profile";

const TRACK = [
  {
    title: "Financial technology",
    body: "Lending origination and servicing platforms, insurance policy administration, and the compliance-heavy workflows that come with regulated industries.",
  },
  {
    title: "Design systems at scale",
    body: "Tokens and component libraries implemented in code: the connective tissue that lets product, engineering, and marketing move as one.",
  },
  {
    title: "AI-first products",
    body: "Agentic features, headless APIs that are addressable by both humans and agents, and the evaluation discipline to ship them safely.",
  },
  {
    title: "Shipping through change",
    body: "Startups through acquisitions, legacy systems through modernization, small teams shipping at a pace that usually takes three times the headcount.",
  },
];

const BRINGS = [
  {
    title: "Full-stack architecture",
    body: "TypeScript end to end, headless APIs, serverless and managed infrastructure. Production systems across every layer.",
  },
  {
    title: "AI engineering",
    body: "Agents, RAG, model selection, and the evals, guardrails, and observability that turn a demo into a dependable system.",
  },
  {
    title: "Design that ships",
    body: "Design systems and interfaces built in code, so what gets designed is what gets shipped, down to the last hairline.",
  },
  {
    title: "Senior judgment",
    body: "We've made the expensive mistakes already; you get the decision without the detour.",
  },
];

const VALUES = [
  {
    title: "Ship, not pilot",
    body: "Production from the first commit. A demo nobody can rely on isn't a win.",
  },
  {
    title: "Foundations first",
    body: "Design system, headless API, working CI. Invest once and everything after it gets cheaper.",
  },
  {
    title: "Honest counsel",
    body: "We'll tell you when automation isn't worth it. Trust is the whole business.",
  },
  {
    title: "Own the outcome",
    body: "We run what we build and stay accountable for whether it works.",
  },
];

export default function About() {
  return (
    <PageShell wide>
      <Title>About · {profile.name}</Title>
      <Meta
        name="description"
        content="Northway is an AI consulting practice built on senior engineering judgment: practical AI, shipped to production, run for the long term."
      />

      {/* Hero */}
      <section class="mb-20 max-w-3xl">
        <p
          data-hero-step="1"
          class="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          About
        </p>
        <h1
          data-hero-step="2"
          class="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl"
        >
          A practice, not a product demo.
        </h1>
        <p
          data-hero-step="3"
          class="mt-6 max-w-[40rem] text-pretty text-base leading-relaxed text-fg-muted md:text-lg"
        >
          Northway is an AI consulting practice: a network of senior engineers
          and AI specialists, founded and operated by{" "}
          <span class="text-fg">Filip Iversen</span>. We design, build, and
          run intelligent systems for teams that want results, not pilots.
        </p>
      </section>

      {/* Who you're working with */}
      <section data-hero-step="4" class="mb-20">
        <div class="rounded-lg border border-line bg-bg-soft p-6 md:p-8">
          <p class="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Who you're working with
          </p>
          <p class="max-w-2xl text-pretty text-lg leading-relaxed text-fg-muted">
            Northway runs as a{" "}
            <span class="font-medium text-fg">network rather than an agency</span>: a
            tight bench of senior engineers and AI specialists assembled around
            the shape of each engagement.{" "}
            <span class="font-medium text-fg">Filip</span> stays your single
            point of contact from first call to launch, so you get a bigger
            team's range without the handoffs, and one person who's always
            accountable for the outcome.
          </p>
        </div>
      </section>

      {/* 01 How we think */}
      <section data-hero-step="5" class="mb-20 max-w-2xl">
        <p class="mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
          <span aria-hidden="true" class="h-3 w-px bg-accent" />
          How we think
        </p>
        <h2 class="mb-4 font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          The boring decisions are the advantage.
        </h2>
        <div class="space-y-4 text-pretty leading-relaxed text-fg-muted">
          <p>
            The interesting work in an AI project is rarely the model. It's
            everything around it: the foundations that decide whether a clever
            demo becomes a system your business can lean on.
          </p>
          <p>
            We've learned the same lesson in fintech, insurance, and product
            startups: a design system, a headless API, and disciplined
            engineering let a small team ship like a much bigger one. Northway
            exists to bring that leverage to teams adopting AI, without the
            pilot purgatory most of them get stuck in.
          </p>
        </div>
      </section>

      {/* 02 Track record */}
      <section data-hero-step="6" class="mb-20">
        <p class="mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
          <span aria-hidden="true" class="h-3 w-px bg-accent" />
          Where we've built
        </p>
        <h2 class="mb-8 font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Startups, enterprises, and everything between.
        </h2>
        <ul class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          <For each={TRACK}>
            {(t) => (
              <li class="bg-bg p-6">
                <h3 class="font-display text-base font-semibold tracking-tight">
                  {t.title}
                </h3>
                <p class="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {t.body}
                </p>
              </li>
            )}
          </For>
        </ul>
        {/*
          Optional — add named clients, logos, or short network/specialist bios
          here when you're ready to make them public.
        */}
      </section>

      {/* 03 What we bring */}
      <section data-hero-step="7" class="mb-20">
        <p class="mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
          <span aria-hidden="true" class="h-3 w-px bg-accent" />
          What we bring
        </p>
        <h2 class="mb-8 font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          What you get in every engagement.
        </h2>
        <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <For each={BRINGS}>
            {(b) => (
              <li class="rounded-lg border border-line p-6">
                <h3 class="font-display text-base font-semibold tracking-tight">
                  {b.title}
                </h3>
                <p class="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {b.body}
                </p>
              </li>
            )}
          </For>
        </ul>
      </section>

      {/* 04 Values */}
      <section data-hero-step="8" class="mb-20">
        <p class="mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
          <span aria-hidden="true" class="h-3 w-px bg-accent" />
          What drives us
        </p>
        <h2 class="mb-8 font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          The values under the work.
        </h2>
        <ul class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <For each={VALUES}>
            {(v) => (
              <li class="bg-bg p-6">
                <h3 class="font-display text-base font-semibold tracking-tight">
                  {v.title}
                </h3>
                <p class="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {v.body}
                </p>
              </li>
            )}
          </For>
        </ul>
      </section>

      {/* CTA */}
      <section
        data-hero-step="9"
        class="rounded-lg border border-night-line bg-night p-8 text-center text-night-fg md:p-14"
      >
        <h2 class="mx-auto max-w-xl font-display text-2xl font-bold tracking-tight text-balance md:text-4xl">
          Want to build something that lasts?
        </h2>
        <p class="mx-auto mt-4 max-w-md text-pretty text-night-muted">
          Whether you need AI automation or just want to compare notes, we'd like
          to hear from you.
        </p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/contact"
            class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
          >
            Get in touch →
          </a>
          <a
            href="/ai-audit"
            class="border border-night-line px-5 py-2.5 text-sm font-medium text-night-fg transition-colors hover-hover:hover:border-star"
          >
            Start with a free audit
          </a>
        </div>
      </section>
    </PageShell>
  );
}
