import type { APIEvent } from "@solidjs/start/server";
import {
  StripeApiError,
  formatStripeAmount,
  resolveRetainerPrice,
  stripeFetch,
  stripePublishableKey,
  stripeSecretKey,
  type StripeCustomer,
  type StripeList,
  type StripeSubscription,
} from "~/lib/stripe";

/**
 * The checkout API behind /start.
 *
 * GET  → publishable key + the retainer price (resolved from Stripe), so the
 *        checkout island can render a live order summary.
 * POST → { email, name, company? }: finds-or-creates the Stripe customer and
 *        opens an incomplete subscription on the retainer price. Returns the
 *        PaymentIntent client secret the Payment Element confirms against.
 *
 * The subscription is created with `payment_behavior: "default_incomplete"`,
 * so nothing is owed until the first invoice's payment succeeds — abandoned
 * checkouts just leave an `incomplete` subscription that expires on its own
 * after ~23 hours.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function configError() {
  return json(
    {
      ok: false,
      error:
        "Checkout isn't configured yet (missing Stripe keys). Please email us instead.",
    },
    503,
  );
}

export async function GET() {
  const publishableKey = stripePublishableKey();
  if (!publishableKey || !stripeSecretKey()) return configError();

  try {
    const price = await resolveRetainerPrice();
    return json({
      ok: true,
      publishableKey,
      price: {
        productName: price.productName,
        productDescription: price.productDescription,
        amountLabel: formatStripeAmount(price.unitAmount, price.currency),
        currency: price.currency,
        interval: price.interval,
        intervalCount: price.intervalCount,
      },
    });
  } catch (err) {
    console.error("[checkout] price resolution failed:", err);
    const message =
      err instanceof StripeApiError
        ? err.message
        : "Could not load pricing from Stripe.";
    return json({ ok: false, error: message }, 502);
  }
}

export async function POST(event: APIEvent) {
  if (!stripeSecretKey() || !stripePublishableKey()) return configError();

  let body: { email?: string; name?: string; company?: string };
  try {
    body = (await event.request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: "Could not read the request." }, 400);
  }

  const email = (body.email ?? "").trim();
  const name = (body.name ?? "").trim();
  const company = (body.company ?? "").trim();

  if (!name || !email) {
    return json({ ok: false, error: "Please fill in your name and email." }, 422);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: "That email address doesn't look right." }, 422);
  }

  try {
    const price = await resolveRetainerPrice();

    // Reuse the customer if the email is already known — repeat visits and
    // retries shouldn't litter the account with duplicates.
    const existing = await stripeFetch<StripeList<StripeCustomer>>(
      "/v1/customers",
      { params: { email, limit: 1 } },
    );

    const customer =
      existing.data[0] ??
      (await stripeFetch<StripeCustomer>("/v1/customers", {
        method: "POST",
        params: {
          email,
          name,
          metadata: {
            company: company || undefined,
            source: "northway.consulting /start",
          },
        },
      }));

    const subscription = await stripeFetch<StripeSubscription>(
      "/v1/subscriptions",
      {
        method: "POST",
        params: {
          customer: customer.id,
          items: [{ price: price.priceId }],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.payment_intent"],
          metadata: { company: company || undefined },
        },
      },
    );

    const invoice = subscription.latest_invoice;
    const paymentIntent =
      invoice && typeof invoice === "object" ? invoice.payment_intent : null;
    const clientSecret =
      paymentIntent && typeof paymentIntent === "object"
        ? paymentIntent.client_secret
        : null;

    if (!clientSecret) {
      console.error(
        `[checkout] subscription ${subscription.id} has no payment intent — is the price free or trialed?`,
      );
      return json(
        { ok: false, error: "Could not start the payment. Please email us instead." },
        502,
      );
    }

    return json({ ok: true, clientSecret, subscriptionId: subscription.id });
  } catch (err) {
    console.error("[checkout] subscription create failed:", err);
    const message =
      err instanceof StripeApiError && err.status < 500
        ? err.message
        : "Something went wrong starting the checkout. Please try again or email us.";
    return json({ ok: false, error: message }, 502);
  }
}
