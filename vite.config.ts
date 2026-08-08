import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { solidStart } from "@solidjs/start/config";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync } from "node:fs";

// Vite only exposes VITE_-prefixed env vars — make sure server code sees the
// Stripe keys from `.env.local` / `.env` in dev too (earlier files winning).
// Production (Vercel) gets env from the dashboard, so this is a local-dev nicety.
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
  // SolidStart's dev error overlay imports CJS packages (source-map-js,
  // error-stack-parser); pre-bundling gives Vite the ESM interop it needs.
  optimizeDeps: {
    include: ["source-map-js", "error-stack-parser"],
  },
  plugins: [
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
    tailwindcss(),
    solidStart({
      extensions: ["js", "jsx", "ts", "tsx", "mdx", "md"],
    }),
    nitro(),
  ],
  nitro: {
    preset: "vercel",
    routeRules: {
      "/ai-audit": { redirect: { to: "/contact", status: 301 } },
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
});
