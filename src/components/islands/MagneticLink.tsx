import { onCleanup, onMount } from "solid-js";

/**
 * Progressive enhancement for `<a data-magnetic>` and `[data-magnetic]`
 * anchors / spans anywhere on the page. Renders no DOM itself — it just
 * attaches a pointer listener per matched element and drives a CSS
 * transform.
 *
 * Each link is server-rendered as a plain `<a>` so the text is in the HTML
 * even when JS fails. Skips entirely on touch devices and under
 * prefers-reduced-motion.
 */
export default function MagneticLinks() {
  onMount(() => {
    if (matchMedia("(hover: none)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]"),
    );

    const cleanups = els.map((el) => {
      const strength = Number(el.dataset.magneticStrength ?? "0.25");
      let raf = 0;
      let nextX = 0;
      let nextY = 0;

      function apply() {
        raf = 0;
        el.style.transform = `translate(${nextX}px, ${nextY}px)`;
      }

      function onMove(e: PointerEvent) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        nextX = (e.clientX - cx) * strength;
        nextY = (e.clientY - cy) * strength;
        if (!raf) raf = requestAnimationFrame(apply);
      }

      function reset() {
        nextX = 0;
        nextY = 0;
        if (!raf) raf = requestAnimationFrame(apply);
      }

      el.style.transition = "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.willChange = "transform";
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", reset);
      el.addEventListener("blur", reset);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", reset);
        el.removeEventListener("blur", reset);
        if (raf) cancelAnimationFrame(raf);
        el.style.removeProperty("transform");
        el.style.removeProperty("transition");
        el.style.removeProperty("will-change");
      };
    });

    onCleanup(() => {
      for (const fn of cleanups) fn();
    });
  });

  return null;
}
