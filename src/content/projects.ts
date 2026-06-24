import type { Component } from "solid-js";

export type ProjectFrontmatter = {
  title: string;
  description: string;
  /** Used purely for ordering within the list. */
  date: string;
  /** Optional human role line shown on the article header. */
  role?: string;
  /** Optional small status pill ("live" / "wip" / "ongoing" / etc). */
  status?: string;
  /** External URL (live site, repo). Surfaced as a "visit ↗" link in the article. */
  url?: string;
  draft?: boolean;
};

/**
 * Public shape consumed by `ProjectList` and the slug route. Kept named
 * `Project` to avoid touching every consumer.
 */
export type Project = ProjectFrontmatter & {
  slug: string;
  /** Where the row navigates to. Article slug if present, else `url`, else `#`. */
  href: string;
  year: number;
};

export type ProjectModule = {
  default: Component;
  frontmatter: ProjectFrontmatter;
};

const modules = import.meta.glob<ProjectModule>("./projects/*.mdx", {
  eager: true,
});

function slugFromPath(path: string): string {
  const file = path.split("/").pop() ?? "";
  return file.replace(/\.mdx$/, "");
}

export const projects: Project[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path);
    const fm = mod.frontmatter;
    const date = new Date(fm.date);
    return {
      ...fm,
      slug,
      href: `/projects/${slug}`,
      year: date.getUTCFullYear(),
    } satisfies Project;
  })
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getProject(
  slug: string,
): { Component: Component; meta: Project } | undefined {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromPath(path) === slug,
  );
  if (!entry) return undefined;
  const [, mod] = entry;
  const meta = projects.find((p) => p.slug === slug);
  if (!meta) return undefined;
  return { Component: mod.default, meta };
}
