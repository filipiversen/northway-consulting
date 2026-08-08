import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import PageShell from "~/components/PageShell";
import SectionHeading from "~/components/SectionHeading";
import { profile } from "~/content/profile";
import { formatPrice, pricing } from "~/content/pricing";

export default function Pricing() {
  return (
    <PageShell wide>
      <Title>Pricing · {profile.name}</Title>
      <Meta
        name="description"
        content={`AI automation retainer at ${formatPrice()}/month. Unlimited requests, one flat rate, pause anytime. Agents, workflows, and integrations built to ship.`}
      />

      {/* Hero */}
      <section class="mb-16 max-w-3xl md:mb-20">
        <p
          data-hero-step="1"
          class="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          {pricing.hero.eyebrow}
        </p>
        <h1
          data-hero-step="2"
          class="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl"
        >
          Your AI & automation team,{" "}
          <span class="text-fg-muted">on retainer.</span>
        </h1>
        <p
          data-hero-step="3"
          class="mt-6 max-w-[40rem] text-pretty text-base leading-relaxed text-fg-muted md:text-lg"
        >
          {pricing.hero.lead}
        </p>
        <div data-hero-step="4" class="mt-8 flex flex-wrap gap-3">
          <a
            href="#retainer"
            class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
          >
            See pricing →
          </a>
          <a
            href="/contact#audit"
            class="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
          >
            Start with a free audit
          </a>
        </div>
      </section>

      {/* How it works */}
      <section data-hero-step="5" class="mb-16 md:mb-20">
        <SectionHeading>how does it work?</SectionHeading>
        <p class="mb-6 max-w-[52ch] text-pretty text-sm leading-relaxed text-fg-muted">
          No hiring scramble, no long proposals, no surprise invoices. Start
          requesting automation the same week.
        </p>
        <ol class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          <For each={pricing.howItWorks}>
            {(step, i) => (
              <li class="bg-bg p-5 md:p-6">
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

      {/* Benefits */}
      <section data-hero-step="6" class="mb-16 md:mb-20">
        <SectionHeading>why a retainer?</SectionHeading>
        <h2 class="mb-8 max-w-2xl font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Senior help without a full-time hire.
        </h2>
        <ul class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          <For each={pricing.benefits}>
            {(b, i) => (
              <li class="bg-bg p-5 md:p-6">
                <span class="font-mono text-xs tabular-nums text-fg-faint">
                  {String(i() + 1).padStart(2, "0")}
                </span>
                <h3 class="mt-2 font-display text-base font-semibold tracking-tight">
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

      {/* What's in scope */}
      <section class="mb-16 md:mb-20">
        <SectionHeading
          aside={
            <a href="/services" class="transition-colors hover-hover:hover:text-accent">
              all services →
            </a>
          }
        >
          what can we request?
        </SectionHeading>
        <p class="mb-6 max-w-[52ch] text-pretty text-sm leading-relaxed text-fg-muted">
          Same work as the service catalog, queued and shipped continuously
          instead of scoped as one-off projects.
        </p>
        <ul class="border border-line">
          <For each={pricing.scope}>
            {(item, i) => (
              <li
                class={
                  i() < pricing.scope.length - 1 ? "border-b border-line" : ""
                }
              >
                <a
                  href={item.href}
                  class="group block p-5 transition-colors hover-hover:hover:bg-bg-hover"
                >
                  <div class="flex items-baseline justify-between gap-4">
                    <h3 class="text-[1rem] font-semibold">
                      <span aria-hidden="true" class="text-fg-faint">
                        ${" "}
                      </span>
                      {item.title}
                    </h3>
                    <span class="font-mono text-xs text-fg-faint transition-colors group-hover:text-accent">
                      read →
                    </span>
                  </div>
                  <p class="mt-1.5 max-w-[62ch] text-[0.85rem] leading-relaxed text-fg-muted">
                    {item.body}
                  </p>
                </a>
              </li>
            )}
          </For>
        </ul>
      </section>

      {/* Price card */}
      <section id="retainer" class="mb-16 scroll-mt-8 md:mb-20">
        <SectionHeading>are you ready to begin?</SectionHeading>
        <div class="mb-8 max-w-2xl">
          <h2 class="font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            {pricing.comparison.headline}
          </h2>
          <p class="mt-4 text-pretty text-sm leading-relaxed text-fg-muted md:text-base">
            {pricing.comparison.body}
          </p>
        </div>

        <div class="overflow-hidden rounded-lg border border-line bg-bg-soft">
          <div class="border-b border-line px-6 py-5 md:px-8 md:py-6">
            <p class="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              {pricing.planName}
            </p>
            <p class="mt-3 flex items-baseline gap-1">
              <span class="font-display text-4xl font-semibold tracking-tight tabular-nums md:text-5xl">
                {formatPrice()}
              </span>
              <span class="text-fg-muted">{pricing.cadenceLabel}</span>
            </p>
            <p class="mt-2 text-sm text-fg-muted">{pricing.tagline}</p>
          </div>

          <ul class="grid grid-cols-1 gap-0 border-b border-line sm:grid-cols-2">
            <For each={pricing.included}>
              {(item) => (
                <li class="flex items-start gap-3 border-b border-line px-6 py-3.5 text-sm text-fg-muted last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 md:px-8">
                  <span aria-hidden="true" class="mt-0.5 text-accent">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              )}
            </For>
          </ul>

          <div class="flex flex-wrap items-center gap-3 px-6 py-5 md:px-8 md:py-6">
            <a
              href={`mailto:${profile.email}?subject=Retainer%20inquiry`}
              class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
            >
              Start the retainer →
            </a>
            <a
              href="/contact"
              class="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
            >
              Ask a question
            </a>
            <p class="w-full text-xs text-fg-faint sm:ml-auto sm:w-auto">
              Not sure yet?{" "}
              <a
                href="/contact#audit"
                class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:decoration-fg"
              >
                Book a free audit
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section class="mb-16 md:mb-20">
        <SectionHeading>faq</SectionHeading>
        <h2 class="mb-2 max-w-xl font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Common questions.
        </h2>
        <p class="mb-8 max-w-[48ch] text-pretty text-sm leading-relaxed text-fg-muted">
          Still stuck?{" "}
          <a
            href="/contact"
            class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:decoration-fg"
          >
            Send a note
          </a>{" "}
          or book a quick call.
        </p>
        <ul class="rounded-lg border border-line px-5 md:px-6">
          <For each={pricing.faqs}>
            {(faq, i) => (
              <li class="border-b border-line last:border-b-0">
                <details class="group py-4">
                  <summary class="flex cursor-pointer list-none items-baseline justify-between gap-4 text-left transition-colors hover-hover:hover:text-accent [&::-webkit-details-marker]:hidden">
                    <span class="flex items-baseline gap-3">
                      <span class="font-mono text-xs tabular-nums text-fg-faint">
                        {String(i() + 1).padStart(2, "0")}
                      </span>
                      <span class="text-[0.95rem] font-semibold leading-snug">
                        {faq.q}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      class="shrink-0 font-mono text-sm text-fg-faint group-open:hidden"
                    >
                      +
                    </span>
                    <span
                      aria-hidden="true"
                      class="hidden shrink-0 font-mono text-sm text-fg-faint group-open:inline"
                    >
                      −
                    </span>
                  </summary>
                  <p class="mt-3 max-w-[62ch] pl-8 text-pretty text-sm leading-relaxed text-fg-muted">
                    {faq.a}
                  </p>
                </details>
              </li>
            )}
          </For>
        </ul>
      </section>

      {/* CTA */}
      <section class="rounded-lg border border-dashed border-fg-muted p-8 md:p-10">
        <h2 class="text-[clamp(1.2rem,3vw,1.8rem)] font-semibold">
          Not sure yet? Start with the audit.
        </h2>
        <p class="mt-4 mb-7 max-w-[56ch] text-[0.9rem] leading-[1.7] text-fg-muted">
          One hour. We inventory the copy-paste work, price it at your loaded
          rate, and hand you a ranked roadmap. Free. Then decide if the
          retainer makes sense.
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            href="/contact#audit"
            class="bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
          >
            Get a free audit
          </a>
          <a
            href={`mailto:${profile.email}?subject=Retainer%20inquiry`}
            class="border border-line px-6 py-3 text-sm font-semibold text-fg-muted transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent active:translate-y-px"
          >
            {profile.email}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
