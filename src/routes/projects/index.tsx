import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import PageShell from "~/components/PageShell";
import { profile } from "~/content/profile";
import { projects } from "~/content/projects";

export default function ProjectsIndex() {
  return (
    <PageShell wide>
      <Title>Work — {profile.name}</Title>
      <Meta
        name="description"
        content="Case studies from Northway — the systems we've actually shipped, running in production."
      />

      <header class="mb-12 max-w-2xl">
        <p
          data-hero-step="1"
          class="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          Work · {projects.length} cases
        </p>
        <h1
          data-hero-step="2"
          class="mb-4 font-display text-3xl font-semibold tracking-tight text-balance md:text-[2.5rem]"
        >
          Receipts. The systems we've actually shipped.
        </h1>
        <p
          data-hero-step="3"
          class="text-pretty text-base leading-relaxed text-fg-muted md:text-[1.0625rem]"
        >
          Real software built for real businesses — modern foundations, shipped
          by small teams, running in production. A few of these are drawn from
          the founding team's work; swap in client engagements as they go live.
        </p>
      </header>

      <ul class="grid grid-cols-1 gap-4 md:grid-cols-2" data-stagger data-hero-step="4">
        <For each={projects}>
          {(p, i) => (
            <li style={`--i: ${i()}`}>
              <a
                href={p.href}
                class="group flex h-full flex-col rounded-lg border border-line p-6 transition-[border-color,box-shadow,transform] duration-200 hover-hover:hover:border-fg/30 hover-hover:hover:[box-shadow:var(--shadow-border-hover)] active:scale-[0.997]"
              >
                <div class="mb-3 flex items-baseline justify-between gap-4">
                  <span class="font-mono text-xs tabular-nums text-accent">
                    {String(i() + 1).padStart(2, "0")}
                  </span>
                  <span class="font-mono text-xs text-fg-faint tabular-nums">
                    {p.year}
                  </span>
                </div>
                <h2
                  class="font-display text-xl font-semibold tracking-tight"
                  style={`view-transition-name: project-title-${p.slug}`}
                >
                  {p.title}
                </h2>
                <p class="mt-2 flex-1 text-pretty text-sm leading-relaxed text-fg-muted">
                  {p.description}
                </p>
                <div class="mt-4 flex items-center justify-between font-mono text-xs text-fg-faint">
                  <span>{p.role}</span>
                  {p.status ? (
                    <span class="uppercase tracking-[0.1em]">{p.status}</span>
                  ) : null}
                </div>
                <span class="mt-4 font-mono text-xs text-fg-faint transition-colors group-hover:text-fg">
                  read the case →
                </span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </PageShell>
  );
}
