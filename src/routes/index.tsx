import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import PageShell from "~/components/PageShell";
import SectionHeading from "~/components/SectionHeading";
import ProjectList from "~/components/ProjectList";
import WritingList from "~/components/WritingList";
import { profile } from "~/content/profile";
import { projects } from "~/content/projects";
import { posts } from "~/content/notes";
import { services } from "~/content/services";

const FEATURED = ["ai-agents", "workflow-automation", "systems-integration"];

/* Front-page-specific styling: the typed terminal window and the scope
   chart. Everything else rides on the global token system. */
const CSS = /* css */ `
.home-term {
  background: var(--color-bg-soft);
  border: 1px solid var(--color-line);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(236, 236, 236, 0.05);
}
.home-term-bar { display: flex; gap: 6px; padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--color-line); }
.home-term-bar i { width: 10px; height: 10px; border-radius: 999px; background: var(--color-fg-faint); }
.home-term-bar span { margin-left: auto; font-size: 0.65rem; color: var(--color-fg-faint); }
.home-term-body { padding: 1.1rem 1.2rem 1.4rem; font-size: 0.82rem; line-height: 1.75; min-height: 15.5em; }
.home-term-body .ln { white-space: pre-wrap; word-break: break-word; }
.home-term-body .ok { color: var(--color-accent); font-weight: 600; }

.home-scope { background: var(--color-bg-soft); border: 1px solid var(--color-line); border-radius: 8px; overflow: hidden; box-shadow: 0 0 60px rgba(236, 236, 236, 0.05); }
.home-scope-head { display: flex; justify-content: space-between; padding: 0.65rem 1rem; font-size: 0.66rem; color: var(--color-fg-faint); border-bottom: 1px solid var(--color-line); }
.home-scope svg { display: block; width: 100%; height: auto; }
.home-scope .grid line { stroke: rgba(236, 236, 236, 0.07); stroke-width: 1; }
.home-scope .axis { stroke: rgba(236, 236, 236, 0.26); stroke-width: 1; }
.home-scope .trace {
  fill: none; stroke: url(#home-trace-grad); stroke-width: 2; stroke-linecap: round;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.22));
}
.home-scope .label { font-size: 11px; fill: var(--color-fg-muted); font-family: inherit; }
.home-scope .label--t { fill: var(--color-accent); }
@media (prefers-reduced-motion: no-preference) {
  .home-scope .trace {
    stroke-dasharray: 1400; stroke-dashoffset: 1400;
    animation: home-scope-draw 5s cubic-bezier(0.3, 0, 0.4, 1) 500ms forwards;
  }
  @keyframes home-scope-draw { to { stroke-dashoffset: 0; } }
}
.home-scope-foot { display: flex; gap: 1.6rem; padding: 0.7rem 1rem; font-size: 0.68rem; color: var(--color-fg-faint); border-top: 1px solid var(--color-line); flex-wrap: wrap; }
.home-scope-foot b { color: var(--color-accent); font-weight: 600; }
`;

/* Typewriter: renders a believable northway agent run, line by line. */
const TYPE_JS = `
(function () {
  var host = document.getElementById("home-term-lines");
  if (!host) return;
  var LINES = [
    ["$ northway run invoice-intake --env production", ""],
    ["  watching inbox: ap@client.example", "dim"],
    ["  new document: invoice_20260703_0117.pdf", "dim"],
    ["  agent: extracted vendor, PO, line items", "dim"],
    ["  agent: matched PO-4482 in NetSuite", "dim"],
    ["  agent: flagged 2% price variance -> human review", "dim"],
    ["  posted to approvals queue (34s total)", "ok"],
    ["$ _  this runs 400x a month. nobody types it.", ""]
  ];
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function make(l) {
    var d = document.createElement("div");
    d.className = "ln " + (l[1] === "ok" ? "ok" : "");
    if (l[1] === "dim") d.style.color = "var(--color-fg-muted)";
    return d;
  }
  if (reduce) {
    LINES.forEach(function (l) { var d = make(l); d.textContent = l[0]; host.appendChild(d); });
    return;
  }
  var li = 0, ci = 0, el = null;
  function tick() {
    if (li >= LINES.length) return;
    if (!el) { el = make(LINES[li]); host.appendChild(el); }
    var text = LINES[li][0];
    ci += 1 + Math.floor(Math.random() * 2);
    el.textContent = text.slice(0, ci);
    if (ci >= text.length) {
      li++; ci = 0; el = null;
      setTimeout(tick, text.charAt(0) === "$" ? 500 : 170);
    } else {
      setTimeout(tick, 14 + Math.random() * 26);
    }
  }
  setTimeout(tick, 600);
})();
`;

/* Trace: manual load oscillating high, then automation kicks in and the
   curve settles low and steady. */
function tracePath(): string {
  const pts: string[] = [];
  for (let x = 0; x <= 720; x += 6) {
    let y: number;
    if (x < 360) {
      y = 95 + 42 * Math.sin(x / 22) + 14 * Math.sin(x / 7);
    } else {
      const settle = Math.max(0, 1 - (x - 360) / 130);
      y = 185 - 30 * settle + 42 * settle * Math.sin(x / 22) + 5 * Math.sin(x / 9);
    }
    pts.push(`${pts.length === 0 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function Home() {
  const recent = posts.slice(0, 4);
  const featured = FEATURED.map((slug) =>
    services.find((s) => s.slug === slug),
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const gridV = Array.from({ length: 17 }, (_, i) => (i + 1) * 40);
  const gridH = Array.from({ length: 5 }, (_, i) => (i + 1) * 40);

  return (
    <PageShell wide>
      <Title>
        {profile.name} · {profile.role}
      </Title>
      <Meta name="description" content={profile.blurb} />
      <style innerHTML={CSS} />

      {/* ---------- Hero ---------- */}
      <section class="mb-16 md:mb-20">
        <h1
          data-hero-step="1"
          class="max-w-3xl text-[clamp(1.9rem,5vw,3.4rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-balance"
        >
          Your ops team is typing things
          <span class="text-fg-muted"> a machine should type.</span>
        </h1>
        <p
          data-hero-step="2"
          class="mt-6 max-w-[52ch] text-[0.95rem] leading-[1.7] text-fg-muted text-pretty"
        >
          Northway builds and runs the agents and automations that take the
          repetitive work off your team's hands. In production, not in a
          pilot.
        </p>

        <div
          data-hero-step="3"
          class="home-term mt-12"
          role="img"
          aria-label="Terminal showing an automated invoice-intake agent run"
        >
          <div class="home-term-bar" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <span>northway-agent · production</span>
          </div>
          <div class="home-term-body" aria-hidden="true">
            <div id="home-term-lines"></div>
            <div>
              <span class="cursor-block"></span>
            </div>
          </div>
        </div>

        <div data-hero-step="4" class="mt-9 flex flex-wrap gap-4">
          <a
            href="/ai-audit"
            class="bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
          >
            Get a free audit
          </a>
          <a
            href="/services"
            class="border border-fg px-6 py-3 text-sm font-semibold transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent active:translate-y-px"
          >
            Explore services
          </a>
        </div>
      </section>

      {/* ---------- Capabilities ---------- */}
      <section data-hero-step="5" class="mb-16 md:mb-20">
        <SectionHeading
          aside={
            <a href="/services" class="transition-colors hover-hover:hover:text-accent">
              all services →
            </a>
          }
        >
          capabilities
        </SectionHeading>
        <div class="border border-line">
          <For each={featured}>
            {(s, i) => (
              <a
                href={`/services/${s.slug}`}
                class={`group block p-5 transition-colors hover-hover:hover:bg-bg-hover ${
                  i() < featured.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <h3 class="text-[1rem] font-semibold">
                  <span aria-hidden="true" class="text-fg-faint">
                    ${" "}
                  </span>
                  {s.title}
                </h3>
                <p class="mt-2 max-w-[62ch] text-[0.85rem] leading-relaxed text-fg-muted">
                  {s.focus}
                </p>
                <span class="mt-2.5 inline-block text-[0.72rem] text-fg-faint transition-colors group-hover:text-accent">
                  Read more →
                </span>
              </a>
            )}
          </For>
        </div>
      </section>

      {/* ---------- The measurable effect ---------- */}
      <section data-hero-step="6" class="mb-16 md:mb-20">
        <SectionHeading>the measurable effect</SectionHeading>
        <figure
          class="home-scope"
          role="img"
          aria-label="A trace of weekly manual hours: volatile and high before automation, low and steady after"
        >
          <div class="home-scope-head" aria-hidden="true">
            <span>manual hours per week</span>
            <span>a typical engagement</span>
          </div>
          <svg viewBox="0 0 720 240" aria-hidden="true">
            {/* Grey until the trigger line, green from the moment automation is live. */}
            <defs>
              <linearGradient
                id="home-trace-grad"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="720"
                y2="0"
              >
                <stop offset="0.5" stop-color="#a8a8a8" />
                <stop offset="0.5" stop-color="#30d158" />
              </linearGradient>
            </defs>
            <g class="grid">
              <For each={gridV}>{(x) => <line x1={x} y1="0" x2={x} y2="240" />}</For>
              <For each={gridH}>{(y) => <line x1="0" y1={y} x2="720" y2={y} />}</For>
            </g>
            <line class="axis" x1="360" y1="0" x2="360" y2="240" stroke-dasharray="4 4" />
            <text class="label" x="352" y="16" text-anchor="end">
              before
            </text>
            <text class="label label--t" x="368" y="16">
              automation live
            </text>
            <path class="trace" d={tracePath()} />
          </svg>
          <div class="home-scope-foot" aria-hidden="true">
            <span>
              before: <b>10–30 h/wk</b>
            </span>
            <span>
              payback: <b>30–60 days</b>
            </span>
            <span>
              after: <b>monitored by us</b>
            </span>
          </div>
        </figure>
      </section>

      {/* ---------- Shipped ---------- */}
      <section class="mb-16 md:mb-20">
        <SectionHeading
          aside={
            <a href="/projects" class="transition-colors hover-hover:hover:text-accent">
              all work →
            </a>
          }
        >
          shipped
        </SectionHeading>
        <ProjectList projects={projects} />
      </section>

      {/* ---------- Field notes ---------- */}
      <section class="mb-16 md:mb-20">
        <SectionHeading
          aside={
            <a href="/notes" class="transition-colors hover-hover:hover:text-accent">
              all →
            </a>
          }
        >
          field notes
        </SectionHeading>
        <WritingList posts={recent} stagger />
      </section>

      {/* ---------- CTA ---------- */}
      <section class="border border-dashed border-fg-muted p-8 md:p-10">
        <h2 class="text-[clamp(1.2rem,3vw,1.8rem)] font-semibold">
          Find out what the manual work costs.
        </h2>
        <p class="mt-4 mb-7 max-w-[56ch] text-[0.9rem] leading-[1.7] text-fg-muted">
          One hour. We inventory the copy-paste work, price it at your loaded
          rate, and hand you a ranked automation roadmap. Free, no obligation.
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            href="/ai-audit"
            class="bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-shadow hover-hover:hover:shadow-[0_0_26px_rgba(48,209,88,0.45)] active:translate-y-px"
          >
            Get a free audit
          </a>
          <a
            href={`mailto:${profile.email}`}
            class="border border-line px-6 py-3 text-sm font-semibold text-fg-muted transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent active:translate-y-px"
          >
            {profile.email}
          </a>
        </div>
      </section>

      <script innerHTML={TYPE_JS} />
    </PageShell>
  );
}
