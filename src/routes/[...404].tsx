import { Title, Meta } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import PageShell from "~/components/PageShell";
import { profile } from "~/content/profile";

/**
 * Catch-all 404, in the console's voice: the shell reports a bad command
 * and suggests the paths that actually exist.
 */
export default function NotFound() {
  return (
    <PageShell>
      <Title>404 · {profile.name}</Title>
      <Meta name="robots" content="noindex" />
      <HttpStatusCode code={404} />

      <section class="py-16">
        <p data-hero-step="1" class="text-[0.85rem] text-fg-muted">
          <span class="text-fg-faint">$ </span>
          northway open <span class="text-fg">{"<this-page>"}</span>
        </p>
        <h1
          data-hero-step="2"
          class="mt-4 text-[clamp(1.6rem,4.5vw,2.6rem)] font-semibold leading-tight"
        >
          command not found
          <span class="cursor-block ml-2" aria-hidden="true" />
        </h1>
        <p
          data-hero-step="3"
          class="mt-5 max-w-[52ch] text-[0.95rem] leading-[1.7] text-fg-muted"
        >
          404: this page doesn't exist. It may have moved, or the link had a
          typo in it.
        </p>

        <div data-hero-step="4" class="mt-8 border border-line bg-bg-soft p-5 text-[0.85rem] leading-[2]">
          <p class="text-fg-faint"># try one of these</p>
          <p>
            <a href="/" class="text-fg-muted transition-colors hover-hover:hover:text-accent">→ Home</a>
          </p>
          <p>
            <a href="/services" class="text-fg-muted transition-colors hover-hover:hover:text-accent">→ Services</a>
          </p>
          <p>
            <a href="/projects" class="text-fg-muted transition-colors hover-hover:hover:text-accent">→ Our work</a>
          </p>
          <p>
            <a href="/contact#audit" class="text-accent transition-colors hover-hover:hover:underline hover-hover:hover:underline-offset-[0.3em]">→ Get a free audit</a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
