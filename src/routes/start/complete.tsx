import { Title, Meta } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import PageShell from "~/components/PageShell";
import { profile } from "~/content/profile";

const CheckoutComplete = clientOnly(
  () => import("~/components/islands/CheckoutComplete"),
);

/**
 * Stripe's return_url after checkout. The island reads the
 * `payment_intent_client_secret` query param, verifies the actual payment
 * status with Stripe, and renders the outcome.
 */
export default function StartComplete() {
  return (
    <PageShell>
      <Title>Order status · {profile.name}</Title>
      <Meta name="robots" content="noindex" />

      <header class="mb-10">
        <p
          data-hero-step="1"
          class="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          Checkout
        </p>
        <h1
          data-hero-step="2"
          class="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance md:text-4xl"
        >
          Order status
        </h1>
      </header>

      <div data-hero-step="3">
        <CheckoutComplete />
        <noscript>
          <div class="mt-6 rounded-lg border border-line bg-bg-soft p-6 text-sm leading-relaxed text-fg-muted">
            We can't verify the payment without JavaScript, but Stripe emails a
            receipt when it succeeds. Questions? Write to{" "}
            <a
              href={`mailto:${profile.email}`}
              class="underline decoration-line underline-offset-[0.2em]"
            >
              {profile.email}
            </a>
            .
          </div>
        </noscript>
      </div>
    </PageShell>
  );
}
