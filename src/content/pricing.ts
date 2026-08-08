/**
 * Retainer pricing — single source of truth for `/pricing`, the home teaser,
 * and any cross-links. Modeled on the northway.agency subscription shape,
 * reframed for AI automation consulting.
 */

export const pricing = {
  /** Display price. Round number on purpose — consulting, not a checkout trick. */
  amount: 5000,
  amountLabel: "$5,000",
  cadence: "month",
  cadenceLabel: "/month",

  planName: "Monthly Retainer",
  tagline: "Pause or cancel anytime. No minimum commitment.",

  hero: {
    eyebrow: "Pricing · Monthly retainer",
    title: "Your AI & automation team, on retainer.",
    lead: "One flat monthly rate. We automate the repetitive work, wire AI into your operations, and keep shipping — without hourly billing, proposals, or surprise invoices.",
  },

  howItWorks: [
    {
      title: "Start",
      body: "Book a free audit or jump straight in. Within a day of kicking off you get a shared request board and a clear first-week plan — no contracts theater, no six-week discovery.",
    },
    {
      title: "Request",
      body: "Queue automations, agents, integrations, and AI features as you need them. A written brief, a Loom, or a screenshot of the painful workflow all work.",
    },
    {
      title: "Ship",
      body: "Most scoped requests come back within two business days. Larger builds ship in daily increments so you always see progress — and everything is revised until it actually runs.",
    },
  ],

  benefits: [
    {
      title: "One senior lead, zero handoffs",
      body: "You work with the person doing the work. No account managers, no junior bench burning hours on your bill.",
    },
    {
      title: "One flat rate, no surprises",
      body: "The same fixed price every month, whether you queue one request or twenty. No hourly billing, no change orders.",
    },
    {
      title: "Built for production",
      body: "Agents, workflows, and integrations that run in your stack — with monitoring, evals, and human-in-the-loop where it matters.",
    },
    {
      title: "Unlimited requests & revisions",
      body: "Add as much as you like to the queue. Every deliverable gets revised until you're satisfied, at no extra cost.",
    },
    {
      title: "Pause when things slow down",
      body: "Unused days roll over when you pause, so you only pay for months you actually use. Cancel anytime.",
    },
    {
      title: "You own everything",
      body: "Code, prompts, workflows, and docs are yours. We build from scratch for your stack — no black-box SaaS lock-in.",
    },
  ],

  included: [
    "Unlimited AI & automation requests",
    "One active request at a time · avg. 48-hour turnaround",
    "Agents, workflow automation, and systems integration",
    "Unlimited revisions until it ships clean",
    "Production monitoring for what we build",
    "Pause anytime — unused days roll over",
  ],

  /** Work that fits the retainer — maps to existing service catalog. */
  scope: [
    {
      title: "Workflow automation",
      body: "The copy-paste, re-key, and chase-the-status work already on the team's plate.",
      href: "/services/workflow-automation",
    },
    {
      title: "AI agents",
      body: "Triage, document, and ops agents grounded in your data and tools.",
      href: "/services/ai-agents",
    },
    {
      title: "Systems integration",
      body: "Connect the CRM, finance, and ops tools people currently glue together by hand.",
      href: "/services/systems-integration",
    },
    {
      title: "RAG & internal knowledge",
      body: "Retrieval over your docs that answers honestly and cites sources.",
      href: "/services/rag-systems",
    },
    {
      title: "Managed AI ops",
      body: "We keep what we ship healthy: monitoring, model upgrades, cost tuning.",
      href: "/services/managed-ai-ops",
    },
    {
      title: "Custom software & design",
      body: "The thin product surface or internal tool an automation needs to be usable.",
      href: "/services/custom-software",
    },
  ],

  comparison: {
    headline: "One flat rate. No contracts, no hourly billing.",
    body: "A senior AI engineer costs $180,000+ a year to hire — if you can find one, onboard them, and keep them. Get the same output for a fraction of the cost, and only for the months you need it.",
  },

  faqs: [
    {
      q: "Why wouldn't I just hire a full-time engineer?",
      a: "You can — and for some teams that's right. A full-time hire means recruiting, onboarding, benefits, and a fixed cost whether the pipeline is full or quiet. The retainer gives you senior AI and automation capacity at a fraction of that cost, pauseable when priorities shift.",
    },
    {
      q: "What kind of work can I request?",
      a: "Anything in our service catalog that fits a request queue: workflow automation, AI agents, systems integration, RAG, managed ops, and the custom software or interface work that makes those systems usable. If a request is a multi-month platform rebuild, we'll say so and propose a better shape.",
    },
    {
      q: "How fast will I receive my work?",
      a: "Most scoped requests come back within two business days. Larger projects ship in daily increments so you always see progress. You'll never wonder what's happening.",
    },
    {
      q: "Is there a limit to how many requests I can make?",
      a: "No. Queue as many as you like. We work one active request at a time so quality stays high and priorities stay clear — you control the order.",
    },
    {
      q: "What if I don't like what ships?",
      a: "Unlimited revisions until you're happy. If something isn't working in production, we stay on it. The point of the retainer is outcomes, not ticket volume.",
    },
    {
      q: "Who does the work?",
      a: "Filip and the Northway network — senior engineers and AI specialists, no junior handoffs. You get one accountable lead for the engagement.",
    },
    {
      q: "How does onboarding work?",
      a: "Start with the free audit if you want a ranked roadmap first, or jump straight into the retainer. Either way: shared board, access to the systems that matter, and a first request within days — not weeks.",
    },
    {
      q: "How will I submit requests?",
      a: "Through your request board. Written briefs, Google docs, Loom walkthroughs, or screenshots of the painful workflow all work. We'll ask clarifying questions before we build.",
    },
    {
      q: "How does the pause feature work?",
      a: "Pause anytime from your board. Unused days roll over, so a two-week pause credits two weeks when you resume. Cancel anytime with no penalty.",
    },
    {
      q: "What if I only need a month, or a single project?",
      a: "That's fine. There's no minimum commitment. For a clearly bounded one-off (a single agent, a defined integration), we can also quote a fixed project — but most teams find the retainer simpler once they see the backlog.",
    },
    {
      q: "Who owns the work?",
      a: "You do. Source code, prompts, workflows, infrastructure config, and documentation are yours. We don't lock you into a proprietary platform.",
    },
    {
      q: "Are there any requests you don't support?",
      a: "We don't do pure brand identity, print design, or work outside AI/automation/software. We also won't ship systems we can't stand behind in production — if a request is a bad idea, we'll tell you why.",
    },
  ],
} as const;

export function formatPrice(amount = pricing.amount): string {
  return `$${amount.toLocaleString("en-US")}`;
}
