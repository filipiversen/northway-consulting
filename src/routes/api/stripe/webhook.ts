import type { APIEvent } from "@solidjs/start/server";
import { profile } from "~/content/profile";
import {
  formatStripeAmount,
  verifyStripeSignature,
  type StripeInvoice,
} from "~/lib/stripe";

/**
 * Stripe webhook receiver. Point a dashboard endpoint (or `stripe listen
 * --forward-to localhost:3000/api/stripe/webhook`) here and set
 * STRIPE_WEBHOOK_SECRET to its signing secret.
 *
 * We verify the signature by hand (HMAC-SHA256, see lib/stripe.ts) and treat
 * the events as notifications: the first paid invoice and any payment
 * failure / cancellation get forwarded to the inbox via Resend, using the
 * same env vars as the contact form. Everything else is acknowledged and
 * ignored — Stripe remains the source of truth for subscription state.
 */

interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

async function notify(subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[stripe-webhook] (no RESEND_API_KEY) ${subject}\n${text}`);
    return;
  }
  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Northway Consulting <onboarding@resend.dev>";
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
    if (!res.ok) {
      console.error(
        `[stripe-webhook] Resend responded ${res.status}: ${await res.text().catch(() => "")}`,
      );
    }
  } catch (err) {
    console.error("[stripe-webhook] notification failed:", err);
  }
}

function describeInvoice(invoice: StripeInvoice): string {
  return `${invoice.customer_email ?? "unknown email"} — ${formatStripeAmount(
    invoice.amount_due,
    invoice.currency,
  )}${invoice.hosted_invoice_url ? `\nInvoice: ${invoice.hosted_invoice_url}` : ""}`;
}

export async function POST(event: APIEvent) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set");
    return new Response("Webhook not configured", { status: 503 });
  }

  const payload = await event.request.text();
  const signature = event.request.headers.get("stripe-signature");
  if (!verifyStripeSignature(payload, signature, secret)) {
    return new Response("Invalid signature", { status: 400 });
  }

  let stripeEvent: StripeEvent;
  try {
    stripeEvent = JSON.parse(payload) as StripeEvent;
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  const object = stripeEvent.data.object;

  if (stripeEvent.type === "invoice.paid") {
    const invoice = object as unknown as StripeInvoice;
    if (invoice.billing_reason === "subscription_create") {
      await notify(
        "New retainer subscriber",
        `First retainer payment received.\n\n${describeInvoice(invoice)}`,
      );
    }
  } else if (stripeEvent.type === "invoice.payment_failed") {
    const invoice = object as unknown as StripeInvoice;
    await notify(
      "Retainer payment failed",
      `A retainer payment failed and may need a follow-up.\n\n${describeInvoice(invoice)}`,
    );
  } else if (stripeEvent.type === "customer.subscription.deleted") {
    const sub = object as { id?: string; customer?: string };
    await notify(
      "Retainer subscription canceled",
      `Subscription ${sub.id ?? "?"} (customer ${sub.customer ?? "?"}) was canceled.`,
    );
  } else {
    // Acknowledged but not acted on — keeps the endpoint quiet in the
    // dashboard without pretending to handle everything.
    console.log(`[stripe-webhook] ignoring ${stripeEvent.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
