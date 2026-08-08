import { defineConfig } from "@solidjs/start/config";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync } from "node:fs";

// Vinxi's dev server only loads `.env` into process.env — honor `.env.local`
// too (that's where the Stripe keys live), earlier files winning. Production
// (Vercel) gets env from the dashboard, so this is a local-dev nicety.
for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match) continue;
    const value = match[2].replace(/^(["'])(.*)\1$/, "$2");
    process.env[match[1]] ??= value;
  }
}

export default defineConfig({
  experimental: {
    islands: true,
  },
  server: {
    preset: "vercel",
    routeRules: {
      "/ai-audit": { redirect: { to: "/contact", statusCode: 301 } },
    },
    prerender: {
      crawlLinks: true,
      routes: [
        "/",
        "/services",
        "/projects",
        "/notes",
        "/about",
        "/pricing",
        "/start",
        "/start/complete",
        "/contact",
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
