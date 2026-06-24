import { For } from "solid-js";
import type { PostMeta } from "~/content/notes";

type Props = {
  posts: PostMeta[];
  showYear?: boolean;
  /** Cascade row reveals after the parent hero-step has settled. */
  stagger?: boolean;
};

export default function WritingList(props: Props) {
  return (
    <ul
      class="-mx-2"
      {...(props.stagger ? { "data-stagger": "" } : {})}
    >
      <For each={props.posts}>
        {(post, i) => {
          const isLast = () => i() === props.posts.length - 1;
          return (
            <li style={`--i: ${i()}`}>
            <a
              href={post.href}
              class={[
                "group flex items-baseline justify-between gap-4",
                isLast() ? "px-2 py-3" : "divider px-2 py-3",
                "[transition:background-color_150ms_ease,box-shadow_350ms_ease,transform_150ms_ease]",
                "hover-hover:hover:bg-bg-hover hover-hover:hover:[box-shadow:inset_1px_1px_0_0_var(--color-line),1px_1px_0_0_var(--color-line)]",
                "active:scale-[0.995]",
              ].join(" ")}
            >
              <span class="flex min-w-0 flex-1 flex-col items-baseline gap-y-0.5 md:flex-row md:gap-x-3">
                <span
                  class="font-medium md:shrink-0 md:whitespace-nowrap"
                  style={`view-transition-name: post-title-${post.slug}`}
                >
                  {post.title}
                </span>
                {post.description ? (
                  <span class="text-sm text-fg-muted md:min-w-0 md:truncate">
                    {post.description}
                  </span>
                ) : null}
              </span>
              <span class="shrink-0 font-mono text-xs text-fg-faint tabular-nums">
                {props.showYear
                  ? post.dateLabel
                  : post.dateLabel.replace(`, ${post.year}`, "")}
              </span>
            </a>
          </li>
          );
        }}
      </For>
    </ul>
  );
}
