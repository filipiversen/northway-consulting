import { createSignal, onCleanup, onMount, Show } from "solid-js";

/**
 * Floating preview card that follows the cursor over the projects list.
 * Mounts as a single island; the entire UL is server-rendered HTML. A single
 * pointermove listener on the parent UL drives ONE fixed card's transform
 * with a Solid signal — only the card's `style.transform` updates per frame.
 *
 * Skips entirely on touch devices and under prefers-reduced-motion.
 */
export default function ProjectRowEffects() {
  const [pos, setPos] = createSignal({ x: 0, y: 0 });
  const [active, setActive] = createSignal(false);
  const [card, setCard] = createSignal<{ title: string; year: string; external: boolean }>({
    title: "",
    year: "",
    external: false,
  });

  onMount(() => {
    if (matchMedia("(hover: none)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const list = document.querySelector<HTMLUListElement>("[data-project-list]");
    if (!list) return;

    let raf = 0;
    let nextX = 0;
    let nextY = 0;

    function onMove(e: PointerEvent) {
      const target = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        "[data-project-row]",
      );
      if (!target) {
        setActive(false);
        return;
      }
      setActive(true);
      const title = target.querySelector("[data-row-title]")?.textContent ?? "";
      const year = target.querySelector("[data-row-year]")?.textContent ?? "";
      const external = target.dataset.external === "true";
      const cur = card();
      if (cur.title !== title || cur.year !== year || cur.external !== external) {
        setCard({ title, year, external });
      }
      nextX = e.clientX;
      nextY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          setPos({ x: nextX, y: nextY });
        });
      }
    }

    function onLeave() {
      setActive(false);
    }

    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);

    onCleanup(() => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    });
  });

  return (
    <Show when={active()}>
      <div
        aria-hidden="true"
        class={[
          "pointer-events-none fixed left-0 top-0 z-40",
          "select-none",
          "transition-[opacity,scale] duration-150 ease-out",
          // Soft drop shadow plus a 1px ring shadow — depth that adapts to bg
          "[box-shadow:var(--shadow-border-hover)]",
          "rounded-xl bg-bg/85 backdrop-blur-md",
          "px-3.5 py-2.5",
        ].join(" ")}
        style={{
          // Position from cursor with a small offset; the second translate
          // anchors the card slightly above the cursor.
          transform: `translate3d(${pos().x}px, ${pos().y}px, 0) translate(-50%, calc(-100% - 14px))`,
          opacity: active() ? 1 : 0,
          scale: active() ? "1" : "0.92",
        }}
      >
        <div class="flex items-baseline gap-3 whitespace-nowrap">
          <span class="font-medium text-fg">{card().title}</span>
          <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-faint tabular-nums">
            {card().year}
            {card().external ? <span class="ml-1.5">↗</span> : null}
          </span>
        </div>
      </div>
    </Show>
  );
}
