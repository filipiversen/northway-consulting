import { createSignal, onMount } from "solid-js";

type Theme = "light" | "dark";

const STORAGE_KEY = "fi-theme";

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function currentTheme(): Theme {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "dark" ? "dark" : "light";
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
}

export default function ThemeToggle() {
  // Initialize from the attribute the boot script already set in <head>,
  // so the icon never flashes the wrong state.
  const [theme, setTheme] = createSignal<Theme>("light");

  onMount(() => {
    setTheme(readStored() ?? currentTheme() ?? systemTheme());
  });

  function swap(next: Theme, origin?: { x: number; y: number }) {
    const root = document.documentElement;

    // 1. Disable every transition/animation site-wide for this frame so the
    //    page doesn't ripple as 200 individual color transitions fire.
    root.setAttribute("data-theme-transitioning", "");

    const update = () => {
      applyTheme(next);
      setTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
    };

    const cleanup = () => {
      requestAnimationFrame(() => {
        root.removeAttribute("data-theme-transitioning");
        root.classList.remove("theme-spotlight");
        root.style.removeProperty("--x");
        root.style.removeProperty("--y");
      });
    };

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };

    if (!reduced && origin && typeof doc.startViewTransition === "function") {
      // Spotlight reveal: clip-path circle radiating from the click point.
      root.style.setProperty("--x", `${origin.x}px`);
      root.style.setProperty("--y", `${origin.y}px`);
      root.classList.add("theme-spotlight");
      const t = doc.startViewTransition(update);
      t.finished.finally(cleanup);
    } else if (typeof doc.startViewTransition === "function") {
      const t = doc.startViewTransition(update);
      t.finished.finally(cleanup);
    } else {
      update();
      cleanup();
    }
  }

  function toggle(e: MouseEvent) {
    const next: Theme = theme() === "dark" ? "light" : "dark";
    swap(next, { x: e.clientX, y: e.clientY });
  }

  const nextLabel = () =>
    `Switch to ${theme() === "dark" ? "light" : "dark"} mode`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={nextLabel()}
      title={nextLabel()}
      class={[
        "relative inline-flex h-7 w-7 items-center justify-center rounded-full",
        "border border-line text-fg-muted",
        "transition-[transform,color,border-color] duration-150 ease-out",
        "hover-hover:hover:border-fg-muted hover-hover:hover:text-fg",
        "active:scale-[0.96]",
        // 40x40 hit area extension
        "after:absolute after:inset-[-6px] after:content-['']",
      ].join(" ")}
    >
      {/* Cross-fade pattern: both icons stay in DOM, layered. The "active"
          one scales/blurs in, the inactive one scales/blurs out. */}
      <span class="relative block h-3.5 w-3.5">
        <SunIcon
          class={[
            "absolute inset-0 transition-[opacity,filter,scale] duration-300",
            "[transition-timing-function:cubic-bezier(0.2,0,0,1)]",
            theme() === "dark"
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]",
          ].join(" ")}
        />
        <MoonIcon
          class={[
            "absolute inset-0 transition-[opacity,filter,scale] duration-300",
            "[transition-timing-function:cubic-bezier(0.2,0,0,1)]",
            theme() === "dark"
              ? "scale-[0.25] opacity-0 blur-[4px]"
              : "scale-100 opacity-100 blur-0",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

function SunIcon(props: { class?: string }) {
  return (
    <svg class={props.class} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon(props: { class?: string }) {
  return (
    <svg class={props.class} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}
