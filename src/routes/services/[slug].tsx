import { useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import PageShell from "~/components/PageShell";
import { profile } from "~/content/profile";
import { getService, services } from "~/content/services";

export default function ServicePage() {
  const params = useParams<{ slug: string }>();
  const service = getService(params.slug);

  return (
    <PageShell wide>
      <Show
        when={service}
        fallback={
          <>
            <HttpStatusCode code={404} />
            <Title>Not found · {profile.name}</Title>
            <h1 class="font-display text-2xl font-semibold tracking-tight">
              Not found
            </h1>
            <p class="mt-2 text-pretty text-fg-muted">
              That service doesn't exist.{" "}
              <a
                href="/services"
                class="underline decoration-line underline-offset-[0.25em] hover-hover:hover:decoration-fg"
              >
                All services →
              </a>
            </p>
          </>
        }
      >
        {(s) => (
          <article>
            <Title>
              {s().title} · {profile.name}
            </Title>
            <Meta name="description" content={s().focus} />

            <div class="reading-progress" aria-hidden="true" />

            <nav
              data-hero-step="1"
              aria-label="Breadcrumb"
              class="mb-6 flex items-center gap-1.5 font-mono text-xs text-fg-faint"
            >
              <a
                href="/"
                class="-my-2 py-2 transition-colors hover-hover:hover:text-fg"
              >
                index
              </a>
              <span aria-hidden="true" class="text-fg-faint/60">/</span>
              <a
                href="/services"
                class="-my-2 py-2 transition-colors hover-hover:hover:text-fg"
              >
                services
              </a>
            </nav>

            <header class="mb-12 max-w-2xl">
              <p
                data-hero-step="2"
                class="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent"
              >
                Service
              </p>
              <h1
                data-hero-step="2"
                data-title-reveal
                class="font-display text-3xl font-semibold tracking-tight text-balance md:text-[2.5rem]"
                style={`view-transition-name: service-title-${s().slug}`}
              >
                {s().title}
              </h1>
              <p
                data-hero-step="3"
                class="mt-4 text-pretty text-lg leading-relaxed text-fg-muted"
              >
                {s().summary}
              </p>
              <div data-hero-step="3" class="mt-5 flex flex-wrap gap-2">
                <For each={s().tags}>
                  {(tag) => (
                    <span class="border border-line px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-fg-faint">
                      {tag}
                    </span>
                  )}
                </For>
              </div>
            </header>

            <section data-hero-step="4" class="mb-14">
              <h2 class="mb-5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
                What we focus on
              </h2>
              <ul class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                <For each={s().capabilities}>
                  {(cap, i) => (
                    <li class="bg-bg p-5 md:p-6">
                      <span class="font-mono text-xs tabular-nums text-accent">
                        {String(i() + 1).padStart(2, "0")}
                      </span>
                      <h3 class="mt-2 font-display text-base font-semibold tracking-tight">
                        {cap.title}
                      </h3>
                      <p class="mt-1.5 text-sm leading-relaxed text-fg-muted">
                        {cap.body}
                      </p>
                    </li>
                  )}
                </For>
              </ul>
            </section>

            <section data-hero-step="5" class="mb-14 max-w-2xl">
              <h2 class="mb-5 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
                What you walk away with
              </h2>
              <ul class="space-y-3">
                <For each={s().outcomes}>
                  {(o) => (
                    <li class="flex items-baseline gap-3">
                      <span aria-hidden="true" class="text-accent">
                        ✦
                      </span>
                      <span class="text-pretty leading-relaxed">{o}</span>
                    </li>
                  )}
                </For>
              </ul>
            </section>

            <section
              data-hero-step="6"
              class="mb-14 rounded-lg border border-line bg-bg-soft p-8 md:flex md:items-center md:justify-between md:gap-6"
            >
              <div>
                <h2 class="font-display text-xl font-semibold tracking-tight text-balance">
                  Could this fit your team?
                </h2>
                <p class="mt-2 max-w-md text-pretty text-fg-muted">
                  Start with a free audit. We'll tell you honestly whether{" "}
                  {s().title.toLowerCase()} is worth it for you.
                </p>
              </div>
              <div class="mt-5 flex shrink-0 gap-3 md:mt-0">
                <a
                  href="/ai-audit"
                  class="bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
                >
                  Book a free audit →
                </a>
                <a
                  href="/contact"
                  class="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
                >
                  Contact
                </a>
              </div>
            </section>

            <section data-hero-step="7">
              <h2 class="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
                Other services
              </h2>
              <div class="flex flex-wrap gap-2">
                <For each={services.filter((x) => x.slug !== s().slug)}>
                  {(other) => (
                    <a
                      href={`/services/${other.slug}`}
                      class="border border-line px-3 py-1.5 text-sm text-fg-muted transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
                    >
                      {other.short}
                    </a>
                  )}
                </For>
              </div>
            </section>
          </article>
        )}
      </Show>
    </PageShell>
  );
}
