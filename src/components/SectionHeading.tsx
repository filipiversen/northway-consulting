import type { JSX } from "solid-js";

type Props = {
  children: JSX.Element;
  aside?: JSX.Element;
};

export default function SectionHeading(props: Props) {
  return (
    <div class="divider mb-5 flex items-baseline justify-between pb-2">
      <h2 class="font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">
        {props.children}
      </h2>
      {props.aside ? (
        <span class="font-mono text-xs text-fg-faint">{props.aside}</span>
      ) : null}
    </div>
  );
}
