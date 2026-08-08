import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import PageShell from "~/components/PageShell";
import { profile } from "~/content/profile";
import { formatPrice, pricing } from "~/content/pricing";

const CheckoutFlow = clientOnly(
  () => import("~/components/islands/CheckoutFlow"),
);

/**
 * Getting started — the self-hosted Stripe payment screen for the retainer.
 * The static shell (summary, reassurance) prerenders; the CheckoutFlow island
 * fetches the live price from /api/checkout and runs the Payment Element.
 */

const REASSURANCE = [
  {
    title: "Kickoff within a day",
    body: "Shared request board and a first-week plan land in your inbox within one business day.",
  },
  {
    title: "Pause or cancel anytime",
    body: "Manage everything from the Stripe billing portal. Unused days roll over when you pause.",
  },
  {
    title: "Payments handled by Stripe",
    body: "Card details go straight to Stripe — they never touch our servers.",
  },
];

export default function Start() {
  return (
    <PageShell wide>
      <Title>Get started · {profile.name}</Title>
      <Meta
        name="description"
        content={`Start the Northway retainer: ${formatPrice()}/month, unlimited AI and automation requests, pause or cancel anytime. Secure checkout by Stripe.`}
      />

      <header class="mb-12 max-w-2xl md:mb-16">
        <p
          data-hero-step="1"
          class="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          Get started
        </p>
        <h1
          data-hero-step="2"
          class="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl"
        >
          Start the retainer.
        </h1>
        <p
          data-hero-step="3"
          class="mt-6 text-pretty text-base leading-relaxed text-fg-muted md:text-lg"
        >
          Two steps: your details, then payment. Your request board goes live
          within one business day of the first payment.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: what you're buying */}
        <div data-hero-step="4" class="space-y-8">
          <div>
            <p class="mb-2 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
              <span aria-hidden="true" class="h-3 w-px bg-accent" />
              {pricing.planName}
            </p>
            <p class="flex items-baseline gap-1">
              <span class="font-display text-4xl font-semibold tracking-tight tabular-nums">
                {formatPrice()}
              </span>
              <span class="text-fg-muted">{pricing.cadenceLabel}</span>
            </p>
            <p class="mt-2 text-sm text-fg-muted">{pricing.tagline}</p>
            <ul class="mt-5 space-y-2">
              <For each={pricing.included}>
                {(item) => (
                  <li class="flex items-start gap-2.5 text-sm text-fg-muted">
                    <span aria-hidden="true" class="mt-0.5 text-accent">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                )}
              </For>
            </ul>
            <p class="mt-5 text-xs text-fg-faint">
              Full details on{" "}
              <a
                href="/pricing"
                class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:decoration-fg"
              >
                the pricing page
              </a>
              .
            </p>
          </div>

          <div class="border-t border-line pt-8">
            <ul class="space-y-5">
              <For each={REASSURANCE}>
                {(item) => (
                  <li>
                    <h2 class="text-sm font-semibold">{item.title}</h2>
                    <p class="mt-1 text-pretty text-sm leading-relaxed text-fg-muted">
                      {item.body}
                    </p>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>

        {/* Right: the payment screen */}
        <div data-hero-step="5">
          <CheckoutFlow />
          <noscript>
            <div class="rounded-lg border border-line bg-bg-soft p-6 text-sm leading-relaxed text-fg-muted">
              Checkout needs JavaScript. If you'd rather not enable it, email{" "}
              <a
                href={`mailto:${profile.email}?subject=Retainer%20inquiry`}
                class="underline decoration-line underline-offset-[0.2em]"
              >
                {profile.email}
              </a>{" "}
              and we'll send a Stripe invoice instead.
            </div>
          </noscript>
          <p class="mt-4 text-center text-xs text-fg-faint">
            Rather talk first?{" "}
            <a
              href="/contact#audit"
              class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:decoration-fg"
            >
              Book a free audit
            </a>{" "}
            — no card required.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
