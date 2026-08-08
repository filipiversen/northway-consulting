import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import PageShell from "~/components/PageShell";
import SectionHeading from "~/components/SectionHeading";
import { profile } from "~/content/profile";
import {
  coreServices,
  moreServices,
  engagement,
  services,
  type Service,
} from "~/content/services";

function ServiceCard(props: { service: Service; index: number }) {
  const s = props.service;
  return (
    <li style={`--i: ${props.index}`}>
      <a
        href={`/services/${s.slug}`}
        class="group block rounded-lg border border-line p-5 transition-[border-color,box-shadow,transform] duration-200 hover-hover:hover:border-fg/30 hover-hover:hover:[box-shadow:var(--shadow-border-hover)] active:scale-[0.997] md:p-6"
      >
        <div class="mb-3 flex items-baseline justify-between gap-4">
          <span class="font-mono text-xs tabular-nums text-accent">
            {String(props.index + 1).padStart(2, "0")}
          </span>
          <span class="font-mono text-xs text-fg-faint transition-colors group-hover:text-fg">
            read →
          </span>
        </div>
        <h3 class="font-display text-lg font-semibold tracking-tight">
          {s.title}
        </h3>
        <p class="mt-2 max-w-prose text-pretty text-sm leading-relaxed text-fg-muted">
          {s.focus}
        </p>
        <ul class="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          <For each={s.capabilities}>
            {(cap, ci) => (
              <li class="flex items-baseline gap-2 text-sm text-fg-muted">
                <span class="font-mono text-[0.7rem] tabular-nums text-fg-faint">
                  {String(ci() + 1).padStart(2, "0")}
                </span>
                <span>{cap.title}</span>
              </li>
            )}
          </For>
        </ul>
      </a>
    </li>
  );
}

export default function ServicesIndex() {
  return (
    <PageShell wide>
      <Title>Services · {profile.name}</Title>
      <Meta
        name="description"
        content="Ten ways Northway works: operations audits, AI agents, workflow automation, systems integration, strategy, fractional CTO, custom software, RAG, managed AI ops, and product design."
      />

      <header class="mb-14 max-w-2xl">
        <p
          data-hero-step="1"
          class="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          Services · {services.length} ways we work
        </p>
        <h1
          data-hero-step="2"
          class="mb-4 font-display text-3xl font-semibold tracking-tight text-balance md:text-[2.5rem]"
        >
          A practice built on judgment.
        </h1>
        <p
          data-hero-step="3"
          class="text-pretty text-base leading-relaxed text-fg-muted md:text-[1.0625rem]"
        >
          From operations audits to full automation buildouts, custom agents to
          fractional engineering leadership: {services.length} focused
          offerings, each with its own page. Not sure where to start? The{" "}
          <a
            href="/contact#audit"
            class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:decoration-fg"
          >
            free audit
          </a>{" "}
          is the front door.
        </p>
      </header>

      <section data-hero-step="4" class="mb-16">
        <SectionHeading aside={`${coreServices.length} core`}>
          The core offerings
        </SectionHeading>
        <ul class="grid grid-cols-1 gap-4 md:grid-cols-2" data-stagger>
          <For each={coreServices}>
            {(s, i) => <ServiceCard service={s} index={i()} />}
          </For>
        </ul>
      </section>

      <section data-hero-step="5" class="mb-16">
        <SectionHeading aside={`${moreServices.length} more`}>
          And five more
        </SectionHeading>
        <ul class="grid grid-cols-1 gap-4 md:grid-cols-2" data-stagger>
          <For each={moreServices}>
            {(s, i) => (
              <ServiceCard service={s} index={coreServices.length + i()} />
            )}
          </For>
        </ul>
      </section>

      <section data-hero-step="6" class="mb-16">
        <SectionHeading>How we work · four acts</SectionHeading>
        <ol class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <For each={engagement}>
            {(step, i) => (
              <li class="bg-bg p-5">
                <span class="font-mono text-xs tabular-nums text-accent">
                  {String(i() + 1).padStart(2, "0")}
                </span>
                <h3 class="mt-2 font-display text-base font-semibold tracking-tight">
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

      <section data-hero-step="7" class="mb-16">
        <SectionHeading
          aside={
            <a href="/pricing" class="transition-colors hover-hover:hover:text-accent">
              see pricing →
            </a>
          }
        >
          Or take it as a retainer
        </SectionHeading>
        <div class="rounded-lg border border-line bg-bg-soft p-6 md:p-8">
          <h2 class="font-display text-xl font-semibold tracking-tight text-balance md:text-2xl">
            Ongoing AI and automation at one flat monthly rate.
          </h2>
          <p class="mt-3 max-w-[52ch] text-pretty text-sm leading-relaxed text-fg-muted">
            Prefer a continuous queue over one-off projects? The{" "}
            <a
              href="/pricing"
              class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:decoration-fg"
            >
              monthly retainer
            </a>{" "}
            covers agents, workflows, and integrations at a fixed price.
            Unlimited requests. Pause anytime.
          </p>
          <a
            href="/pricing"
            class="mt-5 inline-block border border-fg px-5 py-2.5 text-sm font-semibold transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
          >
            View retainer pricing →
          </a>
        </div>
      </section>

      <section
        data-hero-step="8"
        class="rounded-lg border border-line bg-bg-soft p-8 text-center md:p-12"
      >
        <h2 class="font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Let's build something that works.
        </h2>
        <p class="mx-auto mt-3 max-w-md text-pretty text-fg-muted">
          Tell us about your workflows and we'll show you what's possible.
        </p>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/contact#audit"
            class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
          >
            Book a free audit →
          </a>
          <a
            href="/contact"
            class="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
          >
            Send a note
          </a>
        </div>
      </section>
    </PageShell>
  );
}
