import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { MDXProvider } from "solid-mdx";
import { HttpStatusCode, clientOnly } from "@solidjs/start";
import PageShell from "~/components/PageShell";
import { getProject } from "~/content/projects";
import { profile } from "~/content/profile";

const TitleReveal = clientOnly(
  () => import("~/components/islands/TitleReveal"),
);

const components = {};

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const project = getProject(params.slug);

  return (
    <PageShell>
      <Show
        when={project}
        fallback={
          <>
            <HttpStatusCode code={404} />
            <Title>Not found · {profile.name}</Title>
            <h1 class="font-display text-2xl font-semibold tracking-tight">
              Not found
            </h1>
            <p class="mt-2 text-pretty text-fg-muted">
              That case study doesn't exist (yet).{" "}
              <a
                href="/projects"
                class="underline decoration-line underline-offset-[0.25em] hover-hover:hover:decoration-fg"
              >
                Back to work →
              </a>
            </p>
          </>
        }
      >
        {(p) => (
          <article>
            <Title>
              {p().meta.title} · {profile.name}
            </Title>
            <Meta name="description" content={p().meta.description} />

            <div class="reading-progress" aria-hidden="true" />

            <header class="mb-10">
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
                  href="/projects"
                  class="-my-2 py-2 transition-colors hover-hover:hover:text-fg"
                >
                  work
                </a>
              </nav>
              <h1
                data-hero-step="2"
                data-title-reveal
                class="font-display text-3xl font-semibold tracking-tight text-balance md:text-[2rem]"
                style={`view-transition-name: project-title-${p().meta.slug}`}
              >
                {p().meta.title}
              </h1>
              <div
                data-hero-step="3"
                class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-fg-faint"
              >
                <span class="tabular-nums">{p().meta.year}</span>
                {p().meta.role ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{p().meta.role}</span>
                  </>
                ) : null}
                {p().meta.status ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span class="uppercase tracking-[0.1em]">
                      {p().meta.status}
                    </span>
                  </>
                ) : null}
                {p().meta.url ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <a
                      href={p().meta.url!}
                      target="_blank"
                      rel="noreferrer"
                      class="-my-2 py-2 transition-colors hover-hover:hover:text-fg"
                    >
                      visit ↗
                    </a>
                  </>
                ) : null}
              </div>
            </header>

            <div data-hero-step="4" class="prose">
              <MDXProvider components={components}>
                {(() => {
                  const C = p().Component;
                  return <C />;
                })()}
              </MDXProvider>
            </div>

            <TitleReveal />
          </article>
        )}
      </Show>
    </PageShell>
  );
}
