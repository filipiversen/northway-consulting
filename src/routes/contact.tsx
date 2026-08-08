import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import PageShell from "~/components/PageShell";
import { profile } from "~/content/profile";
import { services } from "~/content/services";

const ContactFormEnhancer = clientOnly(
  () => import("~/components/islands/ContactFormEnhancer"),
);

/**
 * The form posts to the /api/contact route, which sends the message via Resend.
 * Without JS it posts natively and the server redirects to /thanks; the
 * enhancer island below upgrades it with inline success / error states.
 * Configure RESEND_API_KEY (+ optional CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL).
 */
const FORM_ACTION = "/api/contact";

const AUDIT_GETS = [
  "A manual-work inventory, grouped by function",
  "Real-dollar cost per workflow (hours × loaded rate)",
  "A ranked automation roadmap you can keep",
];

export default function Contact() {
  return (
    <PageShell wide>
      <Title>Contact · {profile.name}</Title>
      <Meta
        name="description"
        content="Book a free discovery call or AI audit with Northway. Map the manual work, get a ranked roadmap, or just send a note. No pitch, no pressure."
      />

      <header class="mb-16 max-w-2xl">
        <p
          data-hero-step="1"
          class="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          Contact
        </p>
        <h1
          data-hero-step="2"
          class="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl"
        >
          Let's talk. No pitch. No pressure.
        </h1>
        <p
          data-hero-step="3"
          class="mt-6 text-pretty text-base leading-relaxed text-fg-muted md:text-lg"
        >
          Whether you've got a project in mind or just want to explore what AI
          automation could do, we'd like to hear from you. We typically reply
          within 24 hours.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: direct channels */}
        <div data-hero-step="4" class="space-y-8">
          <div id="audit" class="scroll-mt-8">
            <p class="mb-2 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
              <span aria-hidden="true" class="h-3 w-px bg-accent" />
              Book a call
            </p>
            <h2 class="font-display text-xl font-semibold tracking-tight">
              A free discovery call and AI audit.
            </h2>
            <p class="mt-2 text-pretty text-sm leading-relaxed text-fg-muted">
              About an hour. We listen to what's hurting, map the copy-paste
              work your team is already doing, and tell you honestly whether
              automation is worth it. If it is, you leave with a short written
              roadmap. Yours to keep, whether you build with us or not.
            </p>
            <ul class="mt-4 space-y-2">
              <For each={AUDIT_GETS}>
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
            <a
              href={`mailto:${profile.email}?subject=Discovery%20call%20/%20AI%20audit`}
              class="mt-5 inline-block bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
            >
              Request a call →
            </a>
          </div>

          <div class="border-t border-line pt-8">
            <p class="mb-2 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
              <span aria-hidden="true" class="h-3 w-px bg-accent" />
              Write to us
            </p>
            <h2 class="font-display text-xl font-semibold tracking-tight">
              Prefer to write?
            </h2>
            <dl class="mt-4 space-y-4 text-sm">
              <div>
                <dt class="font-mono text-xs uppercase tracking-[0.08em] text-fg-faint">
                  Email
                </dt>
                <dd class="mt-1">
                  <a
                    href={`mailto:${profile.email}`}
                    class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:decoration-fg"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
              <For each={profile.links.filter((l) => l.label !== "Email")}>
                {(link) => (
                  <div>
                    <dt class="font-mono text-xs uppercase tracking-[0.08em] text-fg-faint">
                      {link.label}
                    </dt>
                    <dd class="mt-1">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:decoration-fg"
                      >
                        {profile.name} →
                      </a>
                    </dd>
                  </div>
                )}
              </For>
              <div>
                <dt class="font-mono text-xs uppercase tracking-[0.08em] text-fg-faint">
                  Coverage
                </dt>
                <dd class="mt-1 text-fg-muted">{profile.location}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right: form */}
        <div
          data-hero-step="5"
          class="rounded-lg border border-line bg-bg-soft p-6 md:p-8"
        >
          <form
            action={FORM_ACTION}
            method="post"
            data-contact-form
            class="space-y-5"
          >
            <div>
              <label
                for="name"
                class="mb-1.5 block font-mono text-xs uppercase tracking-[0.08em] text-fg-faint"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                class="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors focus:border-fg"
              />
            </div>
            <div>
              <label
                for="email"
                class="mb-1.5 block font-mono text-xs uppercase tracking-[0.08em] text-fg-faint"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                class="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors focus:border-fg"
              />
            </div>
            <div>
              <label
                for="topic"
                class="mb-1.5 block font-mono text-xs uppercase tracking-[0.08em] text-fg-faint"
              >
                What can we help with?
              </label>
              <select
                id="topic"
                name="topic"
                class="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors focus:border-fg"
              >
                <option value="general">General inquiry</option>
                <option value="audit">Discovery call / AI audit</option>
                <option value="retainer">Monthly retainer</option>
                <For each={services}>
                  {(s) => <option value={s.slug}>{s.title}</option>}
                </For>
                <option value="other">Something else</option>
              </select>
            </div>
            <div>
              <label
                for="message"
                class="mb-1.5 block font-mono text-xs uppercase tracking-[0.08em] text-fg-faint"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                class="w-full resize-y rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors focus:border-fg"
              />
            </div>
            {/* Honeypot — hidden from humans, catches bots. */}
            <input
              type="text"
              name="_gotcha"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              class="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <button
              type="submit"
              class="w-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
            >
              Send message →
            </button>
            <p class="text-center text-xs text-fg-faint">
              We typically respond within 24 hours.
            </p>
          </form>
          <ContactFormEnhancer />
        </div>
      </div>
    </PageShell>
  );
}
