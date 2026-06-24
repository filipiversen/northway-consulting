import { onMount } from "solid-js";

/**
 * Splits the text content of every `[data-title-reveal]` heading on the
 * page into per-word `<span data-word style="--i:n">` and lets the CSS
 * (app.css) animate them in with a soft blur + lift, staggered.
 *
 * Skips under prefers-reduced-motion AND when the browser is mid-View-
 * Transition (the page-to-page nav already handles the visual entrance via
 * `view-transition-name: post-title-{slug}`, so we shouldn't compete).
 */
export default function TitleReveal() {
  onMount(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Detect "we just navigated here via view transitions" — the page lifecycle
    // sets a temporary attribute on <html> in practice. Easiest heuristic:
    // skip the animation if the History navigation type is "back_forward" or
    // the document was rendered from BFCache.
    const navEntry = performance.getEntriesByType?.("navigation")?.[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload =
      navEntry?.type === "reload" || navEntry?.type === "back_forward";

    document
      .querySelectorAll<HTMLElement>("[data-title-reveal]")
      .forEach((el) => {
        if (el.dataset.titleRevealReady === "true") return;

        const text = el.textContent ?? "";
        const words = text.split(/(\s+)/); // keep spaces
        el.textContent = "";

        let idx = 0;
        for (const w of words) {
          if (/^\s+$/.test(w)) {
            el.appendChild(document.createTextNode(w));
            continue;
          }
          const span = document.createElement("span");
          span.dataset.word = "";
          span.style.setProperty("--i", String(idx));
          span.textContent = w;
          if (isReload) {
            // Skip animation, just show the word.
            span.style.animation = "none";
            span.style.opacity = "1";
            span.style.filter = "none";
            span.style.transform = "none";
          }
          el.appendChild(span);
          idx++;
        }

        el.dataset.titleRevealReady = "true";
      });
  });

  return null;
}
