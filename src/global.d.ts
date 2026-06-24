/// <reference types="@solidjs/start/env" />

declare module "*.mdx" {
  import type { Component } from "solid-js";

  export const frontmatter: {
    title: string;
    description?: string;
    date: string;
    tag?: string;
    draft?: boolean;
  };

  const MDXComponent: Component;
  export default MDXComponent;
}

declare module "solid-mdx" {
  import type { Component, JSX } from "solid-js";

  export const MDXProvider: Component<{
    components?: Record<string, Component<JSX.HTMLAttributes<HTMLElement>>>;
    children?: JSX.Element;
  }>;
}
