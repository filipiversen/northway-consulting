import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import PageShell from "~/components/PageShell";
import SectionHeading from "~/components/SectionHeading";
import WritingList from "~/components/WritingList";
import { postsByYear, posts } from "~/content/notes";
import { profile } from "~/content/profile";

export default function NotesIndex() {
  const grouped = postsByYear();

  return (
    <PageShell>
      <Title>Articles · {profile.name}</Title>
      <Meta
        name="description"
        content="Articles on shipping practical AI: agents, automation, cost, and the engineering judgment behind them."
      />

      <header class="mb-12">
        <p
          data-hero-step="1"
          class="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent"
        >
          Articles
        </p>
        <h1
          data-hero-step="2"
          class="mb-2 font-display text-3xl font-semibold tracking-tight text-balance md:text-[2.25rem]"
        >
          Receipts, ideas, and the occasional rant.
        </h1>
        <p
          data-hero-step="3"
          class="max-w-[34rem] text-pretty text-fg-muted"
        >
          {posts.length} {posts.length === 1 ? "article" : "articles"} on shipping
          practical AI: what we build, what we measure, and what we'd tell you
          over coffee.
        </p>
      </header>

      <For each={grouped}>
        {(group, gi) => (
          <section class="mb-12" data-hero-step={String(4 + gi())}>
            <SectionHeading>{group.year.toString()}</SectionHeading>
            <WritingList posts={group.items} stagger />
          </section>
        )}
      </For>
    </PageShell>
  );
}
