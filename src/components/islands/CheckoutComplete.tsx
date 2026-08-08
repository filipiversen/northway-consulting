import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { loadStripe } from "@stripe/stripe-js";

/**
 * The /start/complete verifier. Stripe redirects here after confirmPayment
 * with `payment_intent_client_secret` in the query string; we retrieve the
 * intent client-side and render the real outcome (succeeded / processing /
 * failed) instead of trusting the redirect blindly.
 *
 * On success it also offers the billing portal — /api/billing-portal swaps
 * the client secret for a portal session keyed to the paying customer.
 */

type Outcome = "checking" | "succeeded" | "processing" | "failed" | "missing";

export default function CheckoutComplete() {
  const [outcome, setOutcome] = createSignal<Outcome>("checking");
  const [message, setMessage] = createSignal("");
  const [portalError, setPortalError] = createSignal("");
  const [portalBusy, setPortalBusy] = createSignal(false);

  let clientSecret = "";

  onMount(async () => {
    clientSecret =
      new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret",
      ) ?? "";
    if (!clientSecret) {
      setOutcome("missing");
      return;
    }

    try {
      const res = await fetch("/api/checkout");
      const data = (await res.json()) as
        | { ok: true; publishableKey: string }
        | { ok: false; error: string };
      if (!data.ok) throw new Error(data.error);

      const stripe = await loadStripe(data.publishableKey);
      if (!stripe) throw new Error("Stripe failed to load.");

      const { paymentIntent, error } =
        await stripe.retrievePaymentIntent(clientSecret);
      if (error || !paymentIntent) {
        throw new Error(error?.message ?? "Could not look up the payment.");
      }

      if (paymentIntent.status === "succeeded") {
        setOutcome("succeeded");
      } else if (paymentIntent.status === "processing") {
        setOutcome("processing");
      } else {
        setOutcome("failed");
        setMessage(
          paymentIntent.last_payment_error?.message ??
            "The payment didn't complete.",
        );
      }
    } catch (err) {
      setOutcome("failed");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  });

  async function openPortal() {
    setPortalError("");
    setPortalBusy(true);
    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientSecret,
          returnUrl: window.location.href,
        }),
      });
      const data = (await res.json()) as
        | { ok: true; url: string }
        | { ok: false; error: string };
      if (!data.ok) {
        setPortalError(data.error);
        setPortalBusy(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setPortalError("Could not open the billing portal. Please email us.");
      setPortalBusy(false);
    }
  }

  return (
    <div class="rounded-lg border border-line bg-bg-soft p-6 md:p-8">
      <Switch>
        <Match when={outcome() === "checking"}>
          <p class="py-10 text-center font-mono text-sm text-fg-muted" role="status">
            Verifying payment
            <span class="cursor-block ml-2 h-[0.9em] w-[0.5em]" aria-hidden="true" />
          </p>
        </Match>

        <Match when={outcome() === "succeeded"}>
          <div role="status">
            <p class="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              payment received
            </p>
            <h2 class="mt-3 font-display text-2xl font-semibold tracking-tight">
              You're in. Welcome aboard.
            </h2>
            <p class="mt-3 max-w-[52ch] text-sm leading-relaxed text-fg-muted">
              The retainer is live. Within one business day you'll get an email
              with your shared request board and a first-week plan — start
              thinking about the workflow that hurts most.
            </p>
            <ul class="mt-6 space-y-2 border-t border-line pt-5 text-sm text-fg-muted">
              <li class="flex items-start gap-2.5">
                <span aria-hidden="true" class="mt-0.5 text-accent">✓</span>
                <span>Receipt sent to your email by Stripe</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span aria-hidden="true" class="mt-0.5 text-accent">✓</span>
                <span>Board invite + first-week plan within a business day</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span aria-hidden="true" class="mt-0.5 text-accent">✓</span>
                <span>Pause, cancel, or update billing anytime below</span>
              </li>
            </ul>
            <div class="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openPortal}
                disabled={portalBusy()}
                class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px disabled:cursor-wait disabled:opacity-60"
              >
                {portalBusy() ? "Opening…" : "Manage billing →"}
              </button>
              <a
                href="/"
                class="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
              >
                Back to the site
              </a>
            </div>
            <Show when={portalError()}>
              <p role="alert" class="mt-3 text-sm text-accent">
                {portalError()}
              </p>
            </Show>
          </div>
        </Match>

        <Match when={outcome() === "processing"}>
          <div role="status">
            <p class="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
              payment processing
            </p>
            <h2 class="mt-3 font-display text-2xl font-semibold tracking-tight">
              Almost there.
            </h2>
            <p class="mt-3 max-w-[52ch] text-sm leading-relaxed text-fg-muted">
              Your bank is still confirming the payment — this can take a
              moment (or, for some bank debits, a few days). Stripe will email
              you either way, and we'll reach out as soon as it lands. No need
              to pay again.
            </p>
          </div>
        </Match>

        <Match when={outcome() === "failed"}>
          <div role="alert">
            <p class="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
              payment incomplete
            </p>
            <h2 class="mt-3 font-display text-2xl font-semibold tracking-tight">
              That didn't go through.
            </h2>
            <p class="mt-3 max-w-[52ch] text-sm leading-relaxed text-fg-muted">
              {message()} You haven't been charged.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a
                href="/start"
                class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
              >
                Try again →
              </a>
              <a
                href="/contact"
                class="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
              >
                Contact us
              </a>
            </div>
          </div>
        </Match>

        <Match when={outcome() === "missing"}>
          <div>
            <p class="text-sm leading-relaxed text-fg-muted">
              No checkout to verify here. If you meant to start the retainer:
            </p>
            <a
              href="/start"
              class="mt-5 inline-block bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
            >
              Get started →
            </a>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
