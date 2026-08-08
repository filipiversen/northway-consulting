/**
 * Brand + contact identity for Northway Consulting. Single source of truth for
 * the firm name, positioning line, contact details, and outbound links used
 * across the shell, home, contact, and footer.
 *
 * PLACEHOLDERS — replace with the real thing before launch:
 *   - `email`            (currently hello@northway.consulting)
 *   - `location`         (coverage line — adjust to where you actually work)
 */
export const profile = {
  name: "Northway Consulting",
  short: "Northway",

  /** One-line positioning — used in <title> and beside the wordmark. */
  role: "AI Consulting & Engineering",

  /** Brand line — short enough for a hero or a business card. */
  tagline: "Practical AI, built to ship.",

  /** Firm blurb — footer + meta descriptions + about lead. */
  blurb:
    "Northway is an AI consulting practice. We design, build, and run " +
    "intelligent systems for teams that want results, not pilots: custom " +
    "agents, workflow automation, and the engineering judgment to ship them.",

  email: "hello@northway.consulting",

  /** Coverage line. Northway is remote-first; edit to taste. */
  location: "Remote-first · working with teams across North America & Europe",

  links: [
    {
      label: "Email",
      text: "hello@northway.consulting",
      href: "mailto:hello@northway.consulting",
    },
    {
      label: "LinkedIn",
      text: "Filip Iversen",
      href: "https://www.linkedin.com/in/filip-iversen-96319897/",
    },
  ],
} as const;
