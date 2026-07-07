import type { APIEvent } from "@solidjs/start/server";
import { profile } from "~/content/profile";

/**
 * Contact form handler. Accepts a POST from the contact form (native form post
 * or an enhanced fetch) and sends the message via the Resend REST API.
 *
 * We call the REST endpoint with `fetch` rather than the `resend` SDK on
 * purpose: the SDK bundles a CommonJS dependency that breaks under Vite's SSR
 * runner, and all we need here is to send one email — zero dependencies.
 *
 * Required env: RESEND_API_KEY.
 * Optional env:
 *   CONTACT_TO_EMAIL    — inbox that receives submissions (default: profile.email)
 *   CONTACT_FROM_EMAIL  — verified Resend sender (default: onboarding@resend.dev,
 *                         which only delivers to your own Resend account email —
 *                         set a verified domain sender for production)
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 5000;
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(event: APIEvent) {
  const wantsJson = (event.request.headers.get("accept") ?? "").includes(
    "application/json",
  );

  // The fetch-enhanced form wants JSON; a no-JS native form post wants a
  // redirect to a page it can actually render.
  const fail = (message: string, status: number) =>
    wantsJson
      ? json({ ok: false, error: message }, status)
      : Response.redirect(new URL("/contact?error=1", event.request.url), 303);

  const succeed = () =>
    wantsJson
      ? json({ ok: true })
      : Response.redirect(new URL("/thanks", event.request.url), 303);

  let form: FormData;
  try {
    form = await event.request.formData();
  } catch {
    return fail("Could not read the form data.", 400);
  }

  // Honeypot: a hidden field real users never fill. If it's set, pretend it
  // worked so bots don't learn anything, but send nothing.
  if (((form.get("_gotcha") as string) ?? "").trim() !== "") {
    return succeed();
  }

  const name = ((form.get("name") as string) ?? "").trim();
  const email = ((form.get("email") as string) ?? "").trim();
  const topic = ((form.get("topic") as string) ?? "general").trim();
  const message = ((form.get("message") as string) ?? "").trim();

  if (!name || !email || !message) {
    return fail("Please fill in your name, email, and a message.", 422);
  }
  if (!EMAIL_RE.test(email)) {
    return fail("That email address doesn't look right.", 422);
  }
  if (message.length > MAX_MESSAGE) {
    return fail("That message is a little long — please trim it down.", 422);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return fail(
      `Email isn't configured yet. Please reach us directly at ${profile.email}.`,
      503,
    );
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
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `New inquiry (${topic}) — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
        html:
          `<h2>New inquiry via northway.consulting</h2>` +
          `<p><strong>Name:</strong> ${escapeHtml(name)}<br>` +
          `<strong>Email:</strong> ${escapeHtml(email)}<br>` +
          `<strong>Topic:</strong> ${escapeHtml(topic)}</p>` +
          `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[contact] Resend responded ${res.status}: ${detail}`);
      return fail(
        "Something went wrong sending your message. Please email us directly.",
        502,
      );
    }
    return succeed();
  } catch (err) {
    console.error("[contact] send failed:", err);
    return fail(
      "Something went wrong sending your message. Please email us directly.",
      502,
    );
  }
}
