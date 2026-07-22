/**
 * Northway's service catalog. Single source of truth for the services hub
 * (`/services`), the per-service detail pages (`/services/[slug]`), the home
 * "Work" teaser, and the footer columns.
 *
 * `tier: "core"` services lead the hub; `"more"` services round it out.
 */

export type Capability = {
  title: string;
  body: string;
};

export type Service = {
  slug: string;
  title: string;
  /** Short label for nav / footer / chips. */
  short: string;
  tier: "core" | "more";
  /** The "we focus on…" one-liner. */
  focus: string;
  /** Detail-page lead paragraph. */
  summary: string;
  /** Four concrete capabilities. */
  capabilities: Capability[];
  /** What the client walks away with. */
  outcomes: string[];
  tags: string[];
};

export const services: Service[] = [
  {
    slug: "operations-audit",
    title: "Operations Audit",
    short: "Operations Audit",
    tier: "core",
    focus:
      "We find the work that is worth automating and prove the ROI before you spend a dollar building.",
    summary:
      "Most teams have a ghost employee: ten to thirty hours a week of manual work nobody tracks. The audit finds it, names it, prices it at your loaded hourly rate, and hands you a ranked roadmap, whether you build with us or not.",
    capabilities: [
      {
        title: "Automation ROI, ranked",
        body: "Every recurring manual process, costed at your loaded hourly rate and sorted by payback period.",
      },
      {
        title: "Hidden coupling risks",
        body: "Where one brittle spreadsheet or copy-paste step is quietly load-bearing for the whole operation.",
      },
      {
        title: "Vendor and model exposure",
        body: "Which tools and AI models you depend on, what they cost, and where a price change or deprecation would hurt.",
      },
      {
        title: "A first-90-days plan",
        body: "The three-to-five highest-leverage automations, in order, with effort and expected return.",
      },
    ],
    outcomes: [
      "A written manual-work inventory grouped by function",
      "Real-dollar cost per workflow",
      "A prioritized 90-day automation roadmap",
    ],
    tags: ["Discovery", "ROI", "Roadmap"],
  },
  {
    slug: "ai-agents",
    title: "AI Agent Development",
    short: "AI Agents",
    tier: "core",
    focus:
      "We build agents that do the boring, repetitive work your team is already doing, trained on your context rather than a generic chatbot.",
    summary:
      "An agent is software with a loop and a toolbox. We build ones that handle whole tasks end to end (research, triage, drafting, execution), grounded in your data and wired into the tools you already use, with guardrails and evals so they behave in production.",
    capabilities: [
      {
        title: "Triage agents",
        body: "Read an inbox, ticket queue, or lead list; classify, route, and draft the first response.",
      },
      {
        title: "Document agents",
        body: "Extract, summarize, and generate documents (contracts, policies, reports) with citations.",
      },
      {
        title: "Workflow agents",
        body: "Run a multi-step process across systems, pausing for human approval where it matters.",
      },
      {
        title: "Monitoring agents",
        body: "Watch a dataset or queue and surface only the things a person actually needs to see.",
      },
    ],
    outcomes: [
      "A production agent grounded in your context",
      "An evaluation harness so quality is measured, not guessed",
      "Human-in-the-loop controls and an audit trail",
    ],
    tags: ["Agents", "LLM", "Evals"],
  },
  {
    slug: "workflow-automation",
    title: "Workflow Automation",
    short: "Workflow Automation",
    tier: "core",
    focus:
      "We automate the work that's already on your team's plate, with measurable ROI in 30–60 days.",
    summary:
      "Data pipelines, approval flows, document processing, the report someone rebuilds from scratch every month. We automate the repetitive operational work that's quietly eating hours, and we ship it fast enough that the payback is obvious.",
    capabilities: [
      {
        title: "Customer-facing triage",
        body: "Intake, classification, and first-touch responses that feel fast and human.",
      },
      {
        title: "Back-office paperwork",
        body: "Invoices, onboarding, compliance forms: captured, validated, and filed automatically.",
      },
      {
        title: "Internal knowledge assistants",
        body: "Answers pulled from your own docs, wikis, and tickets instead of tribal memory.",
      },
      {
        title: "Proactive monitoring",
        body: "Systems that watch the numbers and ping a human only when something's off.",
      },
    ],
    outcomes: [
      "Manual hours removed, measured before and after",
      "A documented automation you own, not a black box",
      "ROI visible inside the first 60 days",
    ],
    tags: ["Automation", "Ops", "ROI"],
  },
  {
    slug: "systems-integration",
    title: "Systems Integration",
    short: "Systems Integration",
    tier: "core",
    focus:
      "We connect the systems your team has been moving data between by hand.",
    summary:
      "CRM, project management, finance, custom tools, data platforms, unified into one system that talks to itself. APIs, webhooks, and smart routing, built to scale and built to be understood by the next engineer who touches it.",
    capabilities: [
      {
        title: "CRM ↔ ops sync",
        body: "Keep sales, delivery, and finance looking at the same numbers without manual re-entry.",
      },
      {
        title: "Data warehouse loaders",
        body: "Reliable pipelines that land clean data where your analytics actually live.",
      },
      {
        title: "API gateway & partner integrations",
        body: "A clean boundary for partners and internal consumers, versioned and observable.",
      },
      {
        title: "Legacy bridges",
        body: "A modern surface over the old system you can't rip out yet.",
      },
    ],
    outcomes: [
      "Systems that share one source of truth",
      "Observable, retry-safe data flows",
      "Documentation the next engineer can follow",
    ],
    tags: ["APIs", "Data", "Integration"],
  },
  {
    slug: "ai-strategy",
    title: "AI Strategy",
    short: "AI Strategy",
    tier: "core",
    focus:
      "We figure out which AI investments are going to pay off, and which are hype.",
    summary:
      "A clear-eyed read on where AI helps your business and where it doesn't. We size the opportunities, pick the models and vendors, settle build-vs-buy, and leave you with a roadmap your team can actually execute.",
    capabilities: [
      {
        title: "AI roadmap",
        body: "A sequenced plan tied to business outcomes, not a list of demos.",
      },
      {
        title: "Vendor & model selection",
        body: "The right model for each job, with a thin abstraction so the next deprecation is a one-line change.",
      },
      {
        title: "Build-vs-buy reviews",
        body: "An honest call on what to buy, what to build, and what to leave alone.",
      },
      {
        title: "Org & hiring guidance",
        body: "What roles and skills you need to run this once we're gone.",
      },
    ],
    outcomes: [
      "A prioritized, costed AI roadmap",
      "A vendor and model decision you can defend",
      "A hiring and capability plan",
    ],
    tags: ["Strategy", "Roadmap", "Advisory"],
  },
  {
    slug: "fractional-cto",
    title: "Fractional CTO",
    short: "Fractional CTO",
    tier: "more",
    focus:
      "We sit in your engineering org as a senior voice on architecture, hiring, and AI strategy, without taking equity.",
    summary:
      "For teams that need senior engineering judgment but not another full-time exec. We review architecture and code, help you hire and level, set technical and AI direction, and keep the roadmap honest.",
    capabilities: [
      {
        title: "Architecture & code review",
        body: "A second set of senior eyes on the decisions that are expensive to undo.",
      },
      {
        title: "Hiring & leveling",
        body: "Job ladders, interview loops, and calibration that actually predict performance.",
      },
      {
        title: "Vendor & AI strategy",
        body: "What to adopt, what to wait on, and how to not get locked in.",
      },
      {
        title: "Roadmap reality-check",
        body: "Scope and sequencing grounded in what the team can really ship.",
      },
    ],
    outcomes: [
      "Senior technical direction on a fractional cadence",
      "A stronger, better-leveled engineering team",
      "A roadmap the team believes in",
    ],
    tags: ["Leadership", "Advisory", "Architecture"],
  },
  {
    slug: "custom-software",
    title: "Custom Software Development",
    short: "Custom Software",
    tier: "more",
    focus:
      "We build the software your business needs and can't buy off the shelf.",
    summary:
      "Internal tools, customer-facing apps, data pipelines, AI-augmented features. Built on a modern, typed stack with the foundations (design system, headless API, CI) that let a small team ship like a big one.",
    capabilities: [
      {
        title: "Internal tools",
        body: "The admin panel, dashboard, or workflow app your team has been faking in spreadsheets.",
      },
      {
        title: "Customer-facing web apps",
        body: "Fast, accessible, and polished: the surface your customers judge you on.",
      },
      {
        title: "Data pipelines",
        body: "Ingestion, transformation, and delivery that you can trust and observe.",
      },
      {
        title: "AI-augmented features",
        body: "Search, drafting, classification, and assistants built into the product, not bolted on.",
      },
    ],
    outcomes: [
      "Production software on a modern, maintainable stack",
      "A design system and API you can keep building on",
      "Tests, CI, and docs included, not a prototype",
    ],
    tags: ["Full-stack", "TypeScript", "Product"],
  },
  {
    slug: "rag-systems",
    title: "RAG & Knowledge Systems",
    short: "RAG Systems",
    tier: "more",
    focus:
      "We build retrieval over your documents that answers honestly and cites its sources.",
    summary:
      "A knowledge system your team can trust: it answers from your own content, shows where each answer came from, and says \"I don't know\" instead of making things up. Evaluated on real questions before it ships.",
    capabilities: [
      {
        title: "Internal knowledge search",
        body: "One place to ask across wikis, docs, tickets, and chat history.",
      },
      {
        title: "Customer-facing Q&A",
        body: "Grounded answers in your product or support surface, with citations.",
      },
      {
        title: "Sales & proposal assistants",
        body: "Draft accurate, on-brand responses from your own approved material.",
      },
      {
        title: "Compliance & policy lookup",
        body: "Fast, traceable answers from the documents that have to be right.",
      },
    ],
    outcomes: [
      "A retrieval system grounded in your corpus",
      "Citations on every answer",
      "An eval set that proves accuracy before launch",
    ],
    tags: ["RAG", "Search", "Knowledge"],
  },
  {
    slug: "managed-ai-ops",
    title: "Managed AI Operations",
    short: "Managed AI Ops",
    tier: "more",
    focus:
      "We run the AI systems we've built so your team doesn't need a 24/7 on-call rotation.",
    summary:
      "Production AI drifts: models get deprecated, costs creep, quality slips. We monitor what we ship, handle upgrades and incidents, and keep a regular eye on cost and quality so the system stays as good as the day it launched.",
    capabilities: [
      {
        title: "Production monitoring",
        body: "Latency, errors, and output quality watched continuously, not quarterly.",
      },
      {
        title: "Model upgrades",
        body: "New models adopted safely behind evals: the gains without the surprises.",
      },
      {
        title: "Incident response",
        body: "When something breaks, a senior engineer is already on it.",
      },
      {
        title: "Cost & quality reviews",
        body: "Routing, caching, and batching tuned so the bill keeps shrinking.",
      },
    ],
    outcomes: [
      "An SLA-backed owner for your AI systems",
      "Lower run-cost through ongoing tuning",
      "Quality that holds as models change",
    ],
    tags: ["Operations", "SRE", "Cost"],
  },
  {
    slug: "product-design",
    title: "Product & Interface Design",
    short: "Product Design",
    tier: "more",
    focus:
      "We design fast product interfaces and design systems: the polish that makes AI features feel trustworthy.",
    summary:
      "AI features live or die on how they feel. We design the interface and the design system underneath it: tokens, components, and interaction patterns that make automation legible, controllable, and worth trusting.",
    capabilities: [
      {
        title: "Design systems & component libraries",
        body: "Tokens and primitives implemented in code, so design and engineering share one source of truth.",
      },
      {
        title: "Product & dashboard UI",
        body: "Dense, data-heavy surfaces that stay clear under real-world load.",
      },
      {
        title: "Marketing & landing pages",
        body: "Fast, considered pages that convert without a monthly site-builder tax.",
      },
      {
        title: "AI-native interaction patterns",
        body: "Streaming, citations, undo, and human-in-the-loop controls that make AI feel safe to use.",
      },
    ],
    outcomes: [
      "A design system you can keep building on",
      "Interfaces that make AI legible and controllable",
      "A measurable lift in clarity and conversion",
    ],
    tags: ["Design systems", "UI", "Product"],
  },
];

/** Northway's engagement shape — the same four acts on every build. */
export const engagement = [
  {
    title: "Discovery",
    body: "We learn your business, map your workflows, and find where automation will have the biggest impact.",
  },
  {
    title: "Design",
    body: "We architect the solution: the right tools, the logic, the integration plan, the guardrails.",
  },
  {
    title: "Build & Test",
    body: "We build iteratively, testing against real data and real evals until it runs the way it should.",
  },
  {
    title: "Deploy & Support",
    body: "We launch, monitor, and hand over documentation and training so your team can own it.",
  },
];

export const coreServices = services.filter((s) => s.tier === "core");
export const moreServices = services.filter((s) => s.tier === "more");

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
