import { defineConfig } from "@solidjs/start/config";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  experimental: {
    islands: true,
  },
  server: {
    preset: "vercel",
    prerender: {
      crawlLinks: true,
      routes: [
        "/",
        "/services",
        "/projects",
        "/notes",
        "/about",
        "/pricing",
        "/contact",
        "/ai-audit",
        "/thanks",
      ],
    },
  },
  extensions: ["mdx", "md", "tsx", "ts", "jsx", "js"],
  vite: ({ router }: { router: string }) => {
    // The SSR / server-fns routers in Islands mode otherwise pick the
    // browser export of `solid-js/web` (missing `ssrStyleProperty` etc.).
    const serverConditions = ["node", "solid", "import", "module", "default"];
    const isServer = router !== "client";
    return {
      resolve: isServer ? { conditions: serverConditions } : undefined,
      ssr: isServer
        ? {
            resolve: {
              conditions: serverConditions,
              externalConditions: serverConditions,
            },
          }
        : undefined,
      plugins: [
        tailwindcss(),
        {
          ...mdx({
            jsx: true,
            jsxImportSource: "solid-js",
            providerImportSource: "solid-mdx",
            remarkPlugins: [
              remarkFrontmatter,
              [remarkMdxFrontmatter, { name: "frontmatter" }],
            ],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ],
          }),
          enforce: "pre",
        },
      ],
    };
  },
});
