import type { Component } from "solid-js";

export type PostFrontmatter = {
  title: string;
  description?: string;
  date: string;
  tag?: string;
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  href: string;
  year: number;
  dateLabel: string;
};

export type PostModule = {
  default: Component;
  frontmatter: PostFrontmatter;
};

const modules = import.meta.glob<PostModule>("./notes/*.mdx", {
  eager: true,
});

const formatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function slugFromPath(path: string): string {
  const file = path.split("/").pop() ?? "";
  return file.replace(/\.mdx$/, "");
}

export const posts: PostMeta[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path);
    const fm = mod.frontmatter;
    const date = new Date(fm.date);
    return {
      ...fm,
      slug,
      href: `/notes/${slug}`,
      year: date.getUTCFullYear(),
      dateLabel: formatter.format(date),
    } satisfies PostMeta;
  })
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): { Component: Component; meta: PostMeta } | undefined {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromPath(path) === slug,
  );
  if (!entry) return undefined;
  const [, mod] = entry;
  const meta = posts.find((p) => p.slug === slug);
  if (!meta) return undefined;
  return { Component: mod.default, meta };
}

export function postsByYear(): Array<{ year: number; items: PostMeta[] }> {
  const map = new Map<number, PostMeta[]>();
  for (const p of posts) {
    const arr = map.get(p.year) ?? [];
    arr.push(p);
    map.set(p.year, arr);
  }
  return [...map.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, items }));
}
