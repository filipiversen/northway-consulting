import type { JSX } from "solid-js";
import { profile } from "~/content/profile";

type Props = {
  children: JSX.Element;
  /** Constrain the main column to prose width (default) or let it run wide. */
  wide?: boolean;
};

/** North-star mark — a four-point sparkle. Inherits color from its parent. */
export function NorthStar(props: { class?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      class={props.class}
    >
      <path d="M12 1.5c.8 5.6 3.4 8.2 9 9-5.6.8-8.2 3.4-9 9-.8-5.6-3.4-8.2-9-9 5.6-.8 8.2-3.4 9-9Z" />
    </svg>
  );
}

const NAV = [
  { label: "services", href: "/services" },
  { label: "pricing", href: "/pricing" },
  { label: "work", href: "/projects" },
  { label: "notes", href: "/notes" },
  { label: "about", href: "/about" },
];

export default function PageShell(props: Props) {
  return (
    <div
      class={`relative mx-auto flex min-h-screen w-full flex-col px-6 py-6 md:px-8 md:py-8 ${
        props.wide ? "max-w-[60rem]" : "max-w-prose"
      }`}
    >
      {/* CRT scanlines + vignette over everything, purely decorative. */}
      <div class="crt" aria-hidden="true" />

      {/* Top anchor for the footer "↑ top" link */}
      <span id="top" class="sr-only" />

      <header class="divider mb-12 flex items-center justify-between gap-4 pb-5 text-[0.8rem] md:mb-14">
        <a
          href="/"
          aria-label={`Home · ${profile.name}`}
          class="font-semibold transition-colors hover-hover:hover:text-accent"
        >
          northway.consulting
        </a>

        <nav class="flex items-center gap-4 text-fg-muted sm:gap-5">
          {NAV.map((item) => (
            <a
              href={item.href}
              class="hidden transition-colors hover-hover:hover:text-fg hover-hover:hover:underline hover-hover:hover:underline-offset-[0.3em] sm:inline"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/ai-audit"
            class="whitespace-nowrap border border-line px-3 py-1.5 text-[0.75rem] font-semibold text-fg transition-colors hover-hover:hover:border-accent hover-hover:hover:text-accent"
          >
            Free audit
          </a>
        </nav>
      </header>

      <main class="flex-1">{props.children}</main>

      <footer class="mt-24 border-t border-line pt-8 text-xs text-fg-faint md:mt-28">
        <div class="mb-6 flex flex-wrap items-start justify-between gap-6">
          <div class="max-w-xs">
            <a href="/" class="flex items-center gap-2 text-fg">
              <span class="font-semibold">northway.consulting</span>
              <span class="cursor-block h-[0.9em] w-[0.5em]" aria-hidden="true" />
            </a>
            <p class="mt-3 leading-relaxed text-fg-muted">
              {profile.tagline} {profile.location}.
            </p>
          </div>

          <nav class="flex flex-col gap-2">
            <span class="text-fg-faint/80"># site</span>
            {NAV.map((item) => (
              <a
                href={item.href}
                class="text-fg-muted transition-colors hover-hover:hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/contact"
              class="text-fg-muted transition-colors hover-hover:hover:text-accent"
            >
              contact
            </a>
          </nav>

          <nav class="flex flex-col gap-2">
            <span class="text-fg-faint/80"># elsewhere</span>
            {profile.links.map((link) => (
              <a
                href={link.href}
                class="text-fg-muted transition-colors hover-hover:hover:text-accent"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.label.toLowerCase()}
              </a>
            ))}
          </nav>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <a
            href="#top"
            class="-my-2 py-2 transition-colors hover-hover:hover:text-accent"
            aria-label="Scroll to top"
          >
            ↑ top
          </a>
        </div>
      </footer>
    </div>
  );
}
