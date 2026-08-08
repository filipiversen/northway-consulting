import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import {
  loadStripe,
  type Stripe,
  type StripeElements,
  type Appearance,
} from "@stripe/stripe-js";

/**
 * The /start payment screen. A two-step flow rendered entirely on our page —
 * no redirect to Stripe-hosted checkout:
 *
 *   01 details  — name / email / company, posted to /api/checkout, which
 *                 opens an incomplete subscription on the retainer price and
 *                 returns a PaymentIntent client secret.
 *   02 payment  — Stripe's Payment Element (cards, wallets, bank debits —
 *                 whatever the account has enabled), themed to the console
 *                 design, confirmed client-side with stripe.confirmPayment.
 *
 * Stripe then redirects to /start/complete, which verifies the result.
 * Card details never touch our server; only the Element sees them.
 */

interface CheckoutConfig {
  publishableKey: string;
  price: {
    productName: string;
    productDescription: string | null;
    amountLabel: string;
    interval: string;
    intervalCount: number;
  };
}

/** Payment Element theming — mirrors the tokens in styles/app.css. */
const APPEARANCE: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#30d158",
    colorBackground: "#0b0b0b",
    colorText: "#ececec",
    colorTextSecondary: "#8f8f8f",
    colorTextPlaceholder: "#565656",
    colorDanger: "#ff453a",
    colorIcon: "#8f8f8f",
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
    fontSizeBase: "14px",
    borderRadius: "8px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      backgroundColor: "#0b0b0b",
      border: "1px solid rgba(236, 236, 236, 0.18)",
      boxShadow: "none",
      padding: "10px 12px",
    },
    ".Input:focus": {
      border: "1px solid #ececec",
      boxShadow: "none",
      outline: "none",
    },
    ".Label": {
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontSize: "11px",
      color: "#565656",
      marginBottom: "6px",
    },
    ".Tab": {
      backgroundColor: "#141414",
      border: "1px solid rgba(236, 236, 236, 0.18)",
    },
    ".Tab--selected": {
      border: "1px solid #30d158",
      boxShadow: "none",
    },
  },
};

const ELEMENT_FONTS = [
  {
    cssSrc:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap",
  },
];

const inputClass =
  "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors focus:border-fg";
const labelClass =
  "mb-1.5 block font-mono text-xs uppercase tracking-[0.08em] text-fg-faint";

export default function CheckoutFlow() {
  const [phase, setPhase] = createSignal<
    "loading" | "unavailable" | "details" | "starting" | "payment" | "confirming"
  >("loading");
  const [unavailableReason, setUnavailableReason] = createSignal("");
  const [config, setConfig] = createSignal<CheckoutConfig | null>(null);
  const [error, setError] = createSignal("");

  const [email, setEmail] = createSignal("");
  const [name, setName] = createSignal("");
  const [company, setCompany] = createSignal("");

  let stripePromise: Promise<Stripe | null> | null = null;
  let elements: StripeElements | null = null;
  let paymentMount!: HTMLDivElement;

  onMount(async () => {
    try {
      const res = await fetch("/api/checkout");
      const data = (await res.json()) as
        | ({ ok: true } & CheckoutConfig)
        | { ok: false; error: string };
      if (!data.ok) {
        setUnavailableReason(data.error);
        setPhase("unavailable");
        return;
      }
      setConfig(data);
      // Warm up stripe.js while the visitor types their details.
      stripePromise = loadStripe(data.publishableKey);
      setPhase("details");
    } catch {
      setUnavailableReason("Could not reach the checkout service.");
      setPhase("unavailable");
    }
  });

  const intervalLabel = () => {
    const price = config()?.price;
    if (!price) return "";
    return price.intervalCount === 1
      ? `/${price.interval}`
      : `/ ${price.intervalCount} ${price.interval}s`;
  };

  async function startPayment(e: SubmitEvent) {
    e.preventDefault();
    if (phase() !== "details") return;
    setError("");
    setPhase("starting");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email(),
          name: name(),
          company: company(),
        }),
      });
      const data = (await res.json()) as
        | { ok: true; clientSecret: string }
        | { ok: false; error: string };
      if (!data.ok) {
        setError(data.error);
        setPhase("details");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        setError("Stripe failed to load. Check your connection and retry.");
        setPhase("details");
        return;
      }

      elements = stripe.elements({
        clientSecret: data.clientSecret,
        appearance: APPEARANCE,
        fonts: ELEMENT_FONTS,
      });
      setPhase("payment");
      elements
        .create("payment", {
          layout: "tabs",
          defaultValues: { billingDetails: { name: name(), email: email() } },
        })
        .mount(paymentMount);
    } catch {
      setError("Something went wrong. Please try again.");
      setPhase("details");
    }
  }

  async function confirm() {
    const stripe = await stripePromise;
    if (!stripe || !elements || phase() !== "payment") return;
    setError("");
    setPhase("confirming");

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/start/complete`,
        receipt_email: email(),
      },
    });

    // Only reached when confirmation fails — success navigates away.
    setError(
      confirmError.message ??
        "Payment didn't go through. Please check the details and retry.",
    );
    setPhase("payment");
  }

  return (
    <div class="rounded-lg border border-line bg-bg-soft p-6 md:p-8">
      {/* Step rail */}
      <ol class="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.12em]">
        <li
          class={
            phase() === "payment" || phase() === "confirming"
              ? "text-fg-faint"
              : "text-accent"
          }
        >
          01 details
        </li>
        <li aria-hidden="true" class="h-px w-6 bg-line" />
        <li
          class={
            phase() === "payment" || phase() === "confirming"
              ? "text-accent"
              : "text-fg-faint"
          }
        >
          02 payment
        </li>
      </ol>

      <Switch>
        <Match when={phase() === "loading"}>
          <p class="py-10 text-center font-mono text-sm text-fg-muted" role="status">
            Connecting to Stripe
            <span class="cursor-block ml-2 h-[0.9em] w-[0.5em]" aria-hidden="true" />
          </p>
        </Match>

        <Match when={phase() === "unavailable"}>
          <div role="alert" class="py-6 text-center">
            <p class="text-sm text-fg-muted">{unavailableReason()}</p>
            <a
              href="/contact"
              class="mt-5 inline-block border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
            >
              Contact us instead →
            </a>
          </div>
        </Match>

        <Match when={phase() === "details" || phase() === "starting"}>
          {/* Live line item, straight from the Stripe product. */}
          <Show when={config()}>
            {(c) => (
              <div class="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-5">
                <div>
                  <p class="text-sm font-semibold">{c().price.productName}</p>
                  <Show when={c().price.productDescription}>
                    <p class="mt-1 max-w-[36ch] text-xs leading-relaxed text-fg-muted">
                      {c().price.productDescription}
                    </p>
                  </Show>
                </div>
                <p class="whitespace-nowrap font-mono text-sm tabular-nums">
                  <span class="font-semibold">{c().price.amountLabel}</span>
                  <span class="text-fg-muted">{intervalLabel()}</span>
                </p>
              </div>
            )}
          </Show>

          <form onSubmit={startPayment} class="space-y-5">
            <div>
              <label for="checkout-name" class={labelClass}>
                Name
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                autocomplete="name"
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                class={inputClass}
              />
            </div>
            <div>
              <label for="checkout-email" class={labelClass}>
                Work email
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                autocomplete="email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                class={inputClass}
              />
              <p class="mt-1.5 text-xs text-fg-faint">
                Receipts and your request board invite go here.
              </p>
            </div>
            <div>
              <label for="checkout-company" class={labelClass}>
                Company <span class="normal-case">(optional)</span>
              </label>
              <input
                id="checkout-company"
                type="text"
                autocomplete="organization"
                value={company()}
                onInput={(e) => setCompany(e.currentTarget.value)}
                class={inputClass}
              />
            </div>

            <Show when={error()}>
              <p role="alert" class="text-sm text-accent">
                {error()}
              </p>
            </Show>

            <button
              type="submit"
              disabled={phase() === "starting"}
              class="w-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px disabled:cursor-wait disabled:opacity-60"
            >
              {phase() === "starting" ? "Preparing payment…" : "Continue to payment →"}
            </button>
          </form>
        </Match>

        <Match when={phase() === "payment" || phase() === "confirming"}>
          <Show when={config()}>
            {(c) => (
              <div class="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-5">
                <div>
                  <p class="text-sm font-semibold">{c().price.productName}</p>
                  <p class="mt-1 text-xs text-fg-muted">
                    {name()} · {email()}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        elements = null;
                        setError("");
                        setPhase("details");
                      }}
                      class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:text-accent"
                    >
                      edit
                    </button>
                  </p>
                </div>
                <p class="whitespace-nowrap font-mono text-sm tabular-nums">
                  <span class="font-semibold">{c().price.amountLabel}</span>
                  <span class="text-fg-muted">{intervalLabel()}</span>
                </p>
              </div>
            )}
          </Show>

          <div ref={paymentMount} class="min-h-[220px]" />

          <Show when={error()}>
            <p role="alert" class="mt-4 text-sm text-accent">
              {error()}
            </p>
          </Show>

          <button
            type="button"
            onClick={confirm}
            disabled={phase() === "confirming"}
            class="mt-6 w-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px disabled:cursor-wait disabled:opacity-60"
          >
            {phase() === "confirming"
              ? "Processing…"
              : `Subscribe · ${config()?.price.amountLabel ?? ""}${intervalLabel()}`}
          </button>
          <p class="mt-3 text-center text-xs text-fg-faint">
            Billed {config()?.price.interval ?? "month"}ly by Stripe. Pause or
            cancel anytime from the billing portal.
          </p>
        </Match>
      </Switch>
    </div>
  );
}
