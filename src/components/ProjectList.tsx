import { For } from "solid-js";
import { clientOnly } from "@solidjs/start";
import type { Project } from "~/content/projects";

const ProjectRowEffects = clientOnly(
  () => import("./islands/ProjectRowEffects"),
);

type Props = {
  projects: Project[];
};

export default function ProjectList(props: Props) {
  return (
    <ul
      class="-mx-2"
      data-project-list
      data-stagger
    >
      <For each={props.projects}>
        {(project, i) => {
          const external = project.href.startsWith("http");
          const isLast = () => i() === props.projects.length - 1;
          return (
            <li style={`--i: ${i()}`}>
              <a
                href={project.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                data-project-row
                data-external={external ? "true" : "false"}
                class={[
                  "group/row relative flex items-baseline justify-between gap-4",
                  isLast() ? "px-2 py-3" : "divider px-2 py-3",
                  "[transition:background-color_150ms_ease,box-shadow_350ms_ease,transform_150ms_ease]",
                  "hover-hover:hover:bg-bg-hover hover-hover:hover:[box-shadow:inset_1px_1px_0_0_var(--color-line),1px_1px_0_0_var(--color-line)]",
                  "active:scale-[0.995]",
                ].join(" ")}
              >
                <span class="flex min-w-0 flex-1 flex-col items-baseline gap-y-0.5 md:flex-row md:gap-x-3">
                  <span
                    data-row-title
                    class="font-medium md:shrink-0 md:whitespace-nowrap"
                    style={`view-transition-name: project-title-${project.slug}`}
                  >
                    {project.title}
                  </span>
                  <span class="text-sm text-fg-muted md:min-w-0 md:truncate">
                    {project.description}
                  </span>
                </span>
                <span class="shrink-0 font-mono text-xs text-fg-faint tabular-nums">
                  <span data-row-year>{project.year}</span>
                  {external ? (
                    <span
                      aria-hidden="true"
                      data-magnetic
                      data-magnetic-strength="0.6"
                      class="ml-2 inline-block transition-transform duration-200 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  ) : null}
                </span>
              </a>
            </li>
          );
        }}
      </For>

      <ProjectRowEffects />
    </ul>
  );
}
