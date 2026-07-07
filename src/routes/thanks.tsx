import { Title, Meta } from "@solidjs/meta";
import PageShell from "~/components/PageShell";
import { NorthStar } from "~/components/PageShell";
import { profile } from "~/content/profile";

export default function Thanks() {
  return (
    <PageShell>
      <Title>Thanks — {profile.name}</Title>
      <Meta name="robots" content="noindex" />

      <section class="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <NorthStar class="mb-6 h-7 w-7 text-accent" />
        <h1
          data-hero-step="1"
          class="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl"
        >
          Message received.
        </h1>
        <p
          data-hero-step="2"
          class="mt-4 max-w-md text-pretty text-fg-muted"
        >
          Thanks for reaching out — we typically reply within 24 hours. If it's
          urgent, email us directly at{" "}
          <a
            href={`mailto:${profile.email}`}
            class="underline decoration-line underline-offset-[0.2em] transition-colors hover-hover:hover:decoration-fg"
          >
            {profile.email}
          </a>
          .
        </p>
        <div data-hero-step="3" class="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/"
            class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
          >
            Back home
          </a>
          <a
            href="/notes"
            class="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
          >
            Read the field notes
          </a>
        </div>
      </section>
    </PageShell>
  );
}
