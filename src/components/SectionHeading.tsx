import { Show, children, type JSX } from "solid-js";

type Props = {
  children: JSX.Element;
  aside?: JSX.Element;
};

/**
 * Section label in the console voice: a markdown-style "##" prefix in faint
 * grey, the label in muted grey, an optional aside pinned right.
 */
export default function SectionHeading(props: Props) {
  // Resolve the aside once — reading a JSX prop both in a condition and in
  // the template creates the elements twice, which breaks SSR hydration.
  const aside = children(() => props.aside);
  return (
    <div class="mb-5 flex items-baseline justify-between gap-4">
      <h2 class="text-[0.95rem] font-semibold lowercase text-fg-muted">
        <span aria-hidden="true" class="text-fg-faint">
          ##{" "}
        </span>
        {props.children}
      </h2>
      <Show when={aside()}>
        <span class="text-xs text-fg-faint">{aside()}</span>
      </Show>
    </div>
  );
}
