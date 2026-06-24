import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import PageShell from "~/components/PageShell";
import SectionHeading from "~/components/SectionHeading";
import ProjectList from "~/components/ProjectList";
import WritingList from "~/components/WritingList";
import { NorthStar } from "~/components/PageShell";
import { profile } from "~/content/profile";
import { projects } from "~/content/projects";
import { posts } from "~/content/notes";
import { services } from "~/content/services";

const MagneticLinks = clientOnly(
  () => import("~/components/islands/MagneticLink"),
);

const FEATURED = ["ai-agents", "workflow-automation", "systems-integration"];

const PRINCIPLES = [
  {
    title: "Ship, not pilot",
    body: "Most AI projects die in a proof-of-concept. We build for production from the first commit.",
  },
  {
    title: "Foundations compound",
    body: "A design system, a headless API, real CI. Invest once and a small team ships like a big one.",
  },
  {
    title: "Honest ROI",
    body: "We price the work in real dollars and tell you when automation isn't worth it.",
  },
  {
    title: "We run what we build",
    body: "Models drift and costs creep. We stay on to keep the system as good as launch day.",
  },
];

export default function Home() {
  const recent = posts.slice(0, 4);
  const featured = FEATURED.map((slug) =>
    services.find((s) => s.slug === slug),
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <PageShell wide>
      <Title>
        {profile.name} — {profile.role}
      </Title>
      <Meta name="description" content={profile.blurb} />

      {/* ---------- Hero ---------- */}
      <section class="mb-20 md:mb-28">
        <p
          data-hero-step="1"
          class="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          <NorthStar class="h-3 w-3" />
          AI · Automation · Engineering
        </p>
        <h1
          data-hero-step="2"
          class="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl"
        >
          Intelligent systems,
          <br />
          <span class="text-fg-muted">built to ship.</span>
        </h1>
        <p
          data-hero-step="3"
          class="mt-6 max-w-[38rem] text-pretty text-base leading-relaxed text-fg-muted md:text-lg"
        >
          Northway is an AI consulting practice. We design, build, and run
          intelligent systems — custom agents, workflow automation, and the
          engineering judgment to ship them — for teams that want results, not
          pilots.
        </p>
        <div data-hero-step="4" class="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/ai-audit"
            data-magnetic
            class="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform hover-hover:hover:-translate-y-0.5 active:translate-y-0"
          >
            Get a free AI audit →
          </a>
          <a
            href="/services"
            class="rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-fg"
          >
            Explore services
          </a>
        </div>
        <MagneticLinks />
      </section>

      {/* ---------- 01 · The Work ---------- */}
      <section data-hero-step="5" class="mb-20 md:mb-28">
        <SectionHeading
          aside={
            <a
              href="/services"
              class="transition-colors hover-hover:hover:text-fg"
            >
              all services →
            </a>
          }
        >
          01 · The Work
        </SectionHeading>
        <h2 class="mb-8 max-w-2xl font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          We ship practical AI, not pilots.
        </h2>
        <ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <For each={featured}>
            {(s, i) => (
              <li>
                <a
                  href={`/services/${s.slug}`}
                  class="group flex h-full flex-col rounded-lg border border-line p-5 transition-[border-color,box-shadow,transform] duration-200 hover-hover:hover:border-fg/30 hover-hover:hover:[box-shadow:var(--shadow-border-hover)] active:scale-[0.997]"
                >
                  <span class="font-mono text-xs tabular-nums text-accent">
                    {String(i() + 1).padStart(2, "0")}
                  </span>
                  <h3 class="mt-3 font-display text-lg font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p class="mt-2 flex-1 text-pretty text-sm leading-relaxed text-fg-muted">
                    {s.focus}
                  </p>
                  <span class="mt-4 font-mono text-xs text-fg-faint transition-colors group-hover:text-fg">
                    learn more →
                  </span>
                </a>
              </li>
            )}
          </For>
        </ul>
      </section>

      {/* ---------- 02 · The approach ---------- */}
      <section data-hero-step="6" class="mb-20 md:mb-28">
        <SectionHeading>02 · The Approach</SectionHeading>
        <h2 class="mb-8 max-w-2xl font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Judgment over hype.
        </h2>
        <div class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          <For each={PRINCIPLES}>
            {(p, i) => (
              <div class="bg-bg p-5 md:p-6">
                <span class="font-mono text-xs tabular-nums text-accent">
                  {String(i() + 1).padStart(2, "0")}
                </span>
                <h3 class="mt-2 font-display text-base font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p class="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {p.body}
                </p>
              </div>
            )}
          </For>
        </div>
        <figure class="mt-8 rounded-lg border border-line bg-bg-soft p-6 md:p-8">
          <blockquote class="font-display text-xl font-medium leading-snug tracking-tight text-balance md:text-2xl">
            “The hard parts of an enterprise build — design system, headless
            API, AI-assisted delivery — are now infrastructure. Once you've
            invested in them, categories that looked untouchable become
            addressable by small, focused teams.”
          </blockquote>
          <figcaption class="mt-4 font-mono text-xs uppercase tracking-[0.08em] text-fg-faint">
            The Northway thesis
          </figcaption>
        </figure>
      </section>

      {/* ---------- 03 · Featured work ---------- */}
      <section id="work" data-hero-step="7" class="mb-20 scroll-mt-12 md:mb-28">
        <SectionHeading
          aside={
            <a
              href="/projects"
              class="transition-colors hover-hover:hover:text-fg"
            >
              all work →
            </a>
          }
        >
          03 · Featured Work
        </SectionHeading>
        <h2 class="mb-8 max-w-2xl font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Real results from real engagements.
        </h2>
        <ProjectList projects={projects} />
      </section>

      {/* ---------- 04 · Field notes ---------- */}
      <section data-hero-step="8" class="mb-20 md:mb-28">
        <SectionHeading
          aside={
            <a href="/notes" class="transition-colors hover-hover:hover:text-fg">
              all →
            </a>
          }
        >
          04 · Field Notes
        </SectionHeading>
        <h2 class="mb-8 max-w-2xl font-display text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Latest from the practice.
        </h2>
        <WritingList posts={recent} stagger />
      </section>

      {/* ---------- 05 · CTA ---------- */}
      <section
        data-hero-step="9"
        class="rounded-xl border border-line bg-bg-soft p-8 text-center md:p-14"
      >
        <NorthStar class="mx-auto mb-4 h-6 w-6 text-accent" />
        <h2 class="mx-auto max-w-xl font-display text-2xl font-semibold tracking-tight text-balance md:text-4xl">
          Ready to automate with intent?
        </h2>
        <p class="mx-auto mt-4 max-w-md text-pretty text-fg-muted">
          Tell us what's slowing your team down. We'll map it, cost it, and show
          you the highest-leverage place to start — free.
        </p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/ai-audit"
            class="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform hover-hover:hover:-translate-y-0.5 active:translate-y-0"
          >
            Get your free audit →
          </a>
          <a
            href={`mailto:${profile.email}`}
            class="rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover-hover:hover:border-fg"
          >
            {profile.email}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
