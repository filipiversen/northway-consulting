import type { APIEvent } from "@solidjs/start/server";
import {
  StripeApiError,
  stripeFetch,
  stripeSecretKey,
  type StripePaymentIntent,
} from "~/lib/stripe";

/**
 * Opens a Stripe billing-portal session for a customer who just paid.
 *
 * There are no accounts on this site, so possession of the PaymentIntent
 * client secret (which Stripe hands back to the payer via the return_url)
 * acts as the proof of identity: we look the intent up, check the secret
 * matches, and only then mint a portal session for its customer.
 *
 * Uses STRIPE_PORTAL_CONFIG_ID when set so the portal carries the pause /
 * cancel configuration set up in the dashboard.
 */

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(event: APIEvent) {
  if (!stripeSecretKey()) {
    return json({ ok: false, error: "Billing portal isn't configured." }, 503);
  }

  let body: { clientSecret?: string; returnUrl?: string };
  try {
    body = (await event.request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: "Could not read the request." }, 400);
  }

  // Send the customer back where they came from, as long as it's ours.
  const origin = new URL(event.request.url).origin;
  let returnUrl = new URL("/", origin).toString();
  if (body.returnUrl) {
    const candidate = new URL(body.returnUrl, origin);
    if (candidate.origin === origin) returnUrl = candidate.toString();
  }

  const clientSecret = (body.clientSecret ?? "").trim();
  // pi_..._secret_... — the part before "_secret" is the intent id.
  const intentId = clientSecret.split("_secret")[0];
  if (!intentId.startsWith("pi_") || !clientSecret.includes("_secret")) {
    return json({ ok: false, error: "Invalid payment reference." }, 422);
  }

  try {
    const intent = await stripeFetch<StripePaymentIntent>(
      `/v1/payment_intents/${intentId}`,
    );
    if (intent.client_secret !== clientSecret || !intent.customer) {
      return json({ ok: false, error: "Invalid payment reference." }, 403);
    }

    const session = await stripeFetch<{ url: string }>(
      "/v1/billing_portal/sessions",
      {
        method: "POST",
        params: {
          customer: intent.customer,
          configuration: process.env.STRIPE_PORTAL_CONFIG_ID || undefined,
          return_url: returnUrl,
        },
      },
    );

    return json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[billing-portal] session create failed:", err);
    const message =
      err instanceof StripeApiError && err.status < 500
        ? err.message
        : "Could not open the billing portal. Please email us instead.";
    return json({ ok: false, error: message }, 502);
  }
}
