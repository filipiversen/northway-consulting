/**
 * Retainer pricing — single source of truth for `/pricing`, the home teaser,
 * and any cross-links. Same flat-rate idea as northway.agency, written in
 * Northway Consulting's voice: concrete, dry, no sales theater.
 */

export const pricing = {
  /** Round number on purpose. Consulting, not a checkout trick. */
  amount: 5000,
  amountLabel: "$5,000",
  cadence: "month",
  cadenceLabel: "/month",

  planName: "Monthly retainer",
  tagline: "Pause or cancel anytime. No minimum.",

  hero: {
    eyebrow: "Pricing",
    title: "Your AI & automation team, on retainer.",
    lead: "One flat monthly rate. We automate the repetitive work and add AI where it pays off. No hourly billing.",
  },

  howItWorks: [
    {
      title: "Get started",
      body: "Begin with the free audit, or jump straight in. You'll get a shared board and a first-week plan within a day. No six-week discovery.",
    },
    {
      title: "Submit request",
      body: "Tell us what you want off your plate, whenever it comes up. A short note, a quick recording, or a screenshot of the annoying task is all we need.",
    },
    {
      title: "Receive delivery",
      body: "Most scoped requests come back in about two business days. Bigger builds ship in daily increments, revised until they actually run.",
    },
  ],

  benefits: [
    {
      title: "One senior engineer, no handoffs",
      body: "You work with the person doing the work. No account managers, no juniors burning hours on your bill.",
    },
    {
      title: "Same price every month",
      body: "One request or twenty. No hourly billing, no change orders, no invoices to chase.",
    },
    {
      title: "Build things that actually will be used",
      body: "Agents, workflows, and integrations in your existing tech, with monitoring and human review where it matters.",
    },
    {
      title: "Unlimited requests and revisions",
      body: "Add as much as you like to the queue. We revise until you're satisfied, at no extra cost.",
    },
    {
      title: "Pause when things slow down",
      body: "Unused days roll over when you pause. You only pay for months you use. Cancel anytime.",
    },
    {
      title: "You own the work",
      body: "Code, prompts, workflows, and docs are yours. Built for your stack, not locked into ours.",
    },
  ],

  included: [
    "Unlimited AI and automation requests",
    "One active request at a time, most complete within 48 hours",
    "Agents, workflow automation, and systems integration",
    "Unlimited revisions until it works",
    "Production monitoring for what we build",
    "Pause anytime; unused days roll over",
  ],

  /** Work that fits the retainer — maps to the existing service catalog. */
  scope: [
    {
      title: "Workflow automation",
      body: "The copy-paste, re-key, and status-chase work already on the team's plate.",
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
      title: "RAG and internal knowledge",
      body: "Retrieval over your docs that answers honestly and cites sources.",
      href: "/services/rag-systems",
    },
    {
      title: "Managed AI ops",
      body: "We keep what we ship healthy: monitoring, model upgrades, cost tuning.",
      href: "/services/managed-ai-ops",
    },
    {
      title: "Custom software and design",
      body: "The thin product surface or internal tool an automation needs to be usable.",
      href: "/services/custom-software",
    },
  ],

  comparison: {
    headline: "One flat rate. No hourly billing.",
    body: "A senior AI engineer runs $180k+ a year to hire, if you can find one and keep them busy. Same kind of output here, for the months you actually need it.",
  },

  faqs: [
    {
      q: "Why wouldn't I just hire someone full-time?",
      a: "For some teams that's the right call. A hire means recruiting, onboarding, benefits, and a fixed cost whether the pipeline is full or quiet. The retainer is senior AI and automation help you can pause when priorities shift.",
    },
    {
      q: "What kind of work can I request?",
      a: "Anything from the service catalog that fits a request queue: workflow automation, agents, integrations, RAG, managed ops, and the small software or interface work those systems need. If something is a multi-month platform rebuild, we'll say so and suggest a better shape.",
    },
    {
      q: "How fast do things come back?",
      a: "Most scoped requests in about two business days. Larger projects ship in daily increments, so you always see progress.",
    },
    {
      q: "Is there a limit on requests?",
      a: "No. Queue as many as you like. We work one active request at a time so quality stays high and priorities stay clear. You control the order.",
    },
    {
      q: "What if I don't like what ships?",
      a: "Unlimited revisions until you're happy. If something fails in production, we stay on it. The point is outcomes, not ticket count.",
    },
    {
      q: "Who does the work?",
      a: "Filip and the Northway network: senior engineers and AI specialists, no junior handoffs. One accountable lead for the engagement.",
    },
    {
      q: "How does onboarding work?",
      a: "Start with the free audit if you want a ranked roadmap first, or go straight into the retainer. Either way: shared board, access to the systems that matter, and a first request within days.",
    },
    {
      q: "How do I submit requests?",
      a: "Through your request board. Written briefs, docs, recorded walkthroughs, or screenshots of the painful workflow all work. We'll ask clarifying questions before we build.",
    },
    {
      q: "How does pausing work?",
      a: "Pause anytime from your board. Unused days roll over, so a two-week pause credits two weeks when you resume. Cancel anytime, no penalty.",
    },
    {
      q: "What if I only need a month, or one project?",
      a: "That's fine. No minimum commitment. For a clearly bounded one-off (a single agent, a defined integration), we can quote a fixed project. Most teams stick with the retainer once they see the backlog.",
    },
    {
      q: "Who owns the work?",
      a: "You do. Source code, prompts, workflows, infrastructure config, and docs are yours. We don't lock you into a proprietary platform.",
    },
    {
      q: "What won't you take on?",
      a: "Pure brand identity, print design, or work outside AI, automation, and software. We also won't ship systems we can't stand behind in production. If a request is a bad idea, we'll say why.",
    },
  ],
} as const;

export function formatPrice(amount = pricing.amount): string {
  return `$${amount.toLocaleString("en-US")}`;
}
