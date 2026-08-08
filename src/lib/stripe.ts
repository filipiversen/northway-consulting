import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Minimal server-side Stripe client. Talks to the REST API with `fetch`
 * instead of the `stripe` SDK — same reasoning as the Resend integration in
 * `api/contact.ts`: the SDK drags CommonJS baggage through Vite's SSR runner,
 * and the four calls we make (customers, subscriptions, payment intents,
 * portal sessions) are plain form-encoded POSTs.
 *
 * IMPORTANT: server-only. Import from API routes, never from components.
 *
 * Required env: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY.
 * Optional env:
 *   STRIPE_PRICE_ID          — pin the exact recurring price to sell.
 *   STRIPE_PRODUCT_ID        — or pin the product; we use its default price.
 *                              With neither set, we use the account's single
 *                              active recurring price (and error if ambiguous).
 *   STRIPE_WEBHOOK_SECRET    — verifies /api/stripe/webhook signatures.
 *   STRIPE_PORTAL_CONFIG_ID  — billing-portal configuration for subscribers.
 */

/**
 * Pinned so responses keep the shapes we rely on (notably the
 * `latest_invoice.payment_intent` expansion, which API versions from
 * 2025-03-31 on replace with `confirmation_secret`), independent of the
 * Stripe account's default version.
 */
const STRIPE_API_VERSION = "2024-06-20";
const STRIPE_API_BASE = "https://api.stripe.com";

/* ----- The slices of Stripe's objects we actually read ----- */

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
}

export interface StripePrice {
  id: string;
  active: boolean;
  currency: string;
  unit_amount: number | null;
  recurring: { interval: string; interval_count: number } | null;
  product: string | StripeProduct;
}

export interface StripeCustomer {
  id: string;
  email: string | null;
}

export interface StripePaymentIntent {
  id: string;
  client_secret: string | null;
  status: string;
  customer: string | null;
}

export interface StripeInvoice {
  id: string;
  payment_intent: StripePaymentIntent | string | null;
  billing_reason: string | null;
  customer_email: string | null;
  amount_due: number;
  currency: string;
  hosted_invoice_url?: string | null;
}

export interface StripeSubscription {
  id: string;
  status: string;
  customer: string;
  latest_invoice: StripeInvoice | string | null;
}

export interface StripeList<T> {
  data: T[];
  has_more: boolean;
}

export class StripeApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "StripeApiError";
  }
}

export function stripeSecretKey(): string | undefined {
  return process.env.STRIPE_SECRET_KEY;
}

export function stripePublishableKey(): string | undefined {
  return process.env.STRIPE_PUBLISHABLE_KEY;
}

/**
 * Flatten nested params into Stripe's form encoding:
 * `{ items: [{ price: "x" }] }` → `items[0][price]=x`.
 */
function formEncode(
  params: Record<string, unknown>,
  body = new URLSearchParams(),
  prefix = "",
): URLSearchParams {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const name = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          formEncode(item as Record<string, unknown>, body, `${name}[${i}]`);
        } else {
          body.append(`${name}[]`, String(item));
        }
      });
    } else if (typeof value === "object") {
      formEncode(value as Record<string, unknown>, body, name);
    } else {
      body.append(name, String(value));
    }
  }
  return body;
}

export async function stripeFetch<T>(
  path: string,
  options: { method?: "GET" | "POST"; params?: Record<string, unknown> } = {},
): Promise<T> {
  const key = stripeSecretKey();
  if (!key) {
    throw new StripeApiError("STRIPE_SECRET_KEY is not set.", 503);
  }

  const method = options.method ?? "GET";
  const encoded = options.params ? formEncode(options.params) : undefined;
  const url = new URL(path, STRIPE_API_BASE);
  if (method === "GET" && encoded) url.search = encoded.toString();

  const res = await fetch(url, {
    method,
    headers: {
      authorization: `Bearer ${key}`,
      "stripe-version": STRIPE_API_VERSION,
      ...(method === "POST"
        ? { "content-type": "application/x-www-form-urlencoded" }
        : {}),
    },
    body: method === "POST" ? encoded : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as {
    error?: { message?: string; code?: string };
  };

  if (!res.ok) {
    throw new StripeApiError(
      data.error?.message ?? `Stripe responded ${res.status}.`,
      res.status,
      data.error?.code,
    );
  }
  return data as T;
}

/* ----- Retainer price resolution ----- */

export interface RetainerPrice {
  priceId: string;
  currency: string;
  /** In the currency's minor unit (cents). */
  unitAmount: number;
  interval: string;
  intervalCount: number;
  productName: string;
  productDescription: string | null;
}

let cachedPrice: { value: RetainerPrice; at: number } | null = null;
const PRICE_CACHE_MS = 5 * 60 * 1000;

function toRetainerPrice(price: StripePrice): RetainerPrice {
  if (!price.recurring || price.unit_amount === null) {
    throw new StripeApiError(
      `Price ${price.id} must be a recurring price with a fixed amount.`,
      500,
    );
  }
  const product =
    typeof price.product === "object"
      ? price.product
      : { name: "Monthly retainer", description: null };
  return {
    priceId: price.id,
    currency: price.currency,
    unitAmount: price.unit_amount,
    interval: price.recurring.interval,
    intervalCount: price.recurring.interval_count,
    productName: product.name,
    productDescription: product.description,
  };
}

/**
 * Find the price to sell, in order of specificity:
 *   1. STRIPE_PRICE_ID
 *   2. STRIPE_PRODUCT_ID → the product's default price
 *   3. the account's only active recurring price
 */
export async function resolveRetainerPrice(): Promise<RetainerPrice> {
  if (cachedPrice && Date.now() - cachedPrice.at < PRICE_CACHE_MS) {
    return cachedPrice.value;
  }

  let resolved: RetainerPrice;
  const priceId = process.env.STRIPE_PRICE_ID;
  const productId = process.env.STRIPE_PRODUCT_ID;

  if (priceId) {
    const price = await stripeFetch<StripePrice>(`/v1/prices/${priceId}`, {
      params: { expand: ["product"] },
    });
    resolved = toRetainerPrice(price);
  } else if (productId) {
    const product = await stripeFetch<
      StripeProduct & { default_price: StripePrice | string | null }
    >(`/v1/products/${productId}`, { params: { expand: ["default_price"] } });
    if (!product.default_price || typeof product.default_price === "string") {
      throw new StripeApiError(
        `Product ${productId} has no default price. Set one in Stripe, or set STRIPE_PRICE_ID.`,
        500,
      );
    }
    resolved = toRetainerPrice({ ...product.default_price, product });
  } else {
    const prices = await stripeFetch<StripeList<StripePrice>>("/v1/prices", {
      params: { active: true, type: "recurring", limit: 10, expand: ["data.product"] },
    });
    const candidates = prices.data.filter(
      (p) => typeof p.product !== "object" || p.product.active,
    );
    if (candidates.length === 0) {
      throw new StripeApiError(
        "No active recurring price found in this Stripe account. Create one, or set STRIPE_PRICE_ID.",
        500,
      );
    }
    if (candidates.length > 1) {
      throw new StripeApiError(
        `Found ${candidates.length} active recurring prices. Set STRIPE_PRICE_ID (or STRIPE_PRODUCT_ID) to pick one.`,
        500,
      );
    }
    resolved = toRetainerPrice(candidates[0]);
  }

  cachedPrice = { value: resolved, at: Date.now() };
  return resolved;
}

/* ----- Webhook signature verification ----- */

const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

/**
 * Verify a `stripe-signature` header against the raw request body, per
 * https://docs.stripe.com/webhooks#verify-manually (HMAC-SHA256 over
 * `${timestamp}.${payload}`).
 */
export function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
): boolean {
  if (!header) return false;

  let timestamp = "";
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=", 2);
    if (k === "t") timestamp = v;
    if (k === "v1" && v) signatures.push(v);
  }
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");

  return signatures.some((sig) => {
    const sigBuf = Buffer.from(sig, "utf8");
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });
}

/* ----- Shared formatting ----- */

/** "$5,000" / "€1,234.50" — drops cents only when they're zero. */
export function formatStripeAmount(unitAmount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: unitAmount % 100 === 0 ? 0 : 2,
  }).format(unitAmount / 100);
}
