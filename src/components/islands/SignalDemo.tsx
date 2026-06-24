import { batch, createMemo, createSignal } from "solid-js";

/**
 * A tiny live signal playground intended to be embedded inside an MDX post.
 *
 * Demonstrates two ideas:
 *  1. A signal flowing into derived computations (createMemo).
 *  2. Solid's "no virtual DOM" — only the text nodes that depend on `count`
 *     update when the signal changes. The surrounding markup is created
 *     once.
 *
 * Bonus: the three numeric outputs each have a `view-transition-name`, so
 * count changes use the View Transitions API to cross-fade the digits with
 * a soft blur. Pure CSS handles the animation (see app.css).
 */
export default function SignalDemo() {
  const [count, setCount] = createSignal(3);
  const doubled = createMemo(() => count() * 2);
  const fib = createMemo(() => {
    let a = 0;
    let b = 1;
    for (let i = 0; i < count(); i++) {
      [a, b] = [b, a + b];
    }
    return a;
  });

  function update(next: number) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };
    const apply = () => batch(() => setCount(Math.max(0, next)));
    if (!reduced && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  }

  // Concentric radii: outer 24px, inner buttons 8px, padding ~20px.
  // 8 + 20 ≈ 28 — close enough to 24 to read as concentric on this scale.
  const btn = [
    "relative inline-flex h-7 w-7 items-center justify-center rounded-lg",
    "border border-line text-fg-muted",
    "transition-[transform,color,border-color] duration-150 ease-out",
    "hover-hover:hover:border-fg-muted hover-hover:hover:text-fg",
    "active:scale-[0.96]",
    // 40x40 hit area
    "after:absolute after:inset-[-6px] after:content-['']",
  ].join(" ");

  return (
    <figure class="not-prose my-8 rounded-3xl border border-line bg-bg-soft p-5 font-mono text-sm">
      <div class="mb-4 flex items-center justify-between">
        <span class="text-xs uppercase tracking-[0.12em] text-fg-faint">
          live signal
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            onClick={() => update(count() - 1)}
            class={btn}
            aria-label="Decrement"
          >
            −
          </button>
          <output class="w-10 text-center tabular-nums">{count()}</output>
          <button
            type="button"
            onClick={() => update(count() + 1)}
            class={btn}
            aria-label="Increment"
          >
            +
          </button>
        </div>
      </div>

      <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-fg-muted">
        <dt>count()</dt>
        <dd
          class="text-fg tabular-nums"
          style="view-transition-name: signal-count"
        >
          {count()}
        </dd>

        <dt>doubled()</dt>
        <dd
          class="text-fg tabular-nums"
          style="view-transition-name: signal-doubled"
        >
          {doubled()}
        </dd>

        <dt>fib(count())</dt>
        <dd
          class="text-fg tabular-nums"
          style="view-transition-name: signal-fib"
        >
          {fib()}
        </dd>
      </dl>

      <figcaption class="mt-4 border-t border-line pt-3 text-xs text-fg-faint">
        Only the three numbers above re-render. The labels, the buttons, the
        border — all created once.
      </figcaption>
    </figure>
  );
}
