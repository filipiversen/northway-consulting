import type { JSX } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { profile } from "~/content/profile";

const ThemeToggle = clientOnly(() => import("./islands/ThemeToggle"));

type Props = {
  children: JSX.Element;
  /** Constrain the main column to prose width (default) or let it run wide. */
  wide?: boolean;
};

const NAV_LINK =
  "relative -my-2 py-2 transition-colors duration-150 ease hover-hover:hover:text-fg";

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
  { label: "Services", href: "/services" },
  { label: "Work", href: "/projects" },
  { label: "Notes", href: "/notes" },
  { label: "About", href: "/about" },
];

export default function PageShell(props: Props) {
  return (
    <div
      class={`mx-auto flex min-h-screen w-full flex-col px-6 py-8 md:px-8 md:py-12 ${
        props.wide ? "max-w-5xl" : "max-w-prose"
      }`}
    >
      {/* Top anchor for the footer "↑ top" link */}
      <span id="top" class="sr-only" />

      <header class="mb-12 flex items-center justify-between gap-4 text-sm md:mb-16">
        <a
          href="/"
          aria-label={`Home — ${profile.name}`}
          class="relative -m-2 p-2 transition-opacity hover-hover:hover:opacity-70"
        >
          <span class="font-manrope text-[19px] font-extrabold leading-tight tracking-tight text-fg sm:text-[22px] md:text-[25px]">
            northway.consulting
          </span>
        </a>

        <nav class="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.08em] text-fg-muted sm:gap-5">
          {NAV.map((item) => (
            <a href={item.href} class={`${NAV_LINK} hidden sm:inline`}>
              {item.label}
            </a>
          ))}
          <a
            href="/ai-audit"
            class="whitespace-nowrap rounded-full border border-line px-3 py-1 text-fg transition-colors hover-hover:hover:border-fg"
          >
            Free Audit →
          </a>
          <ThemeToggle />
        </nav>
      </header>

      <main class="flex-1">{props.children}</main>

      <footer class="mt-24 border-t border-line pt-8 font-mono text-xs text-fg-faint md:mt-32">
        <div class="mb-6 flex flex-wrap items-start justify-between gap-6">
          <div class="max-w-xs">
            <a href="/" class="flex items-center gap-2 text-fg">
              <NorthStar class="h-3.5 w-3.5 text-accent" />
              <span class="font-display text-sm font-semibold tracking-tight">
                Northway
              </span>
            </a>
            <p class="mt-3 normal-case leading-relaxed text-fg-muted">
              {profile.tagline} {profile.location}.
            </p>
          </div>

          <nav class="flex flex-col gap-2">
            <span class="text-fg-faint/70">Site</span>
            {NAV.map((item) => (
              <a
                href={item.href}
                class="text-fg-muted transition-colors hover-hover:hover:text-fg"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/contact"
              class="text-fg-muted transition-colors hover-hover:hover:text-fg"
            >
              Contact
            </a>
          </nav>

          <nav class="flex flex-col gap-2">
            <span class="text-fg-faint/70">Elsewhere</span>
            {profile.links.map((link) => (
              <a
                href={link.href}
                class="text-fg-muted transition-colors hover-hover:hover:text-fg"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.label}
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
            class="-my-2 py-2 transition-colors duration-150 ease hover-hover:hover:text-fg"
            aria-label="Scroll to top"
          >
            ↑ top
          </a>
        </div>
      </footer>
    </div>
  );
}
