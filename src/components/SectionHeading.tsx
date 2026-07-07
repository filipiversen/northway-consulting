import type { JSX } from "solid-js";

type Props = {
  children: JSX.Element;
  aside?: JSX.Element;
};

/**
 * Section label in the console voice: a markdown-style "##" prefix in faint
 * grey, the label in muted grey, an optional aside pinned right.
 */
export default function SectionHeading(props: Props) {
  return (
    <div class="mb-5 flex items-baseline justify-between gap-4">
      <h2 class="text-[0.95rem] font-semibold lowercase text-fg-muted">
        <span aria-hidden="true" class="text-fg-faint">
          ##{" "}
        </span>
        {props.children}
      </h2>
      {props.aside ? (
        <span class="text-xs text-fg-faint">{props.aside}</span>
      ) : null}
    </div>
  );
}
