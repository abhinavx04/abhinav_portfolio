// Site-wide content. Edit text here; components read from this file.
// Items marked PLACEHOLDER must be replaced before launch.

export const site = {
  name: "Abhinav Rajesh Pillai",
  shortName: "Abhinav Pillai",
  // PLACEHOLDER: production domain (used for canonical URLs, sitemap, OG tags).
  url: "https://abhinavpillai.vercel.app",
  description:
    "AI Generalist, data analyst and software developer. I turn messy data and manual work into systems that make sense.",
  roles: ["AI Generalist", "Data Analyst", "Software Developer"],
  tagline: "I turn messy data and manual work into systems that make sense.",
  // PLACEHOLDER: real contact details.
  email: "hello@example.com",
  links: {
    linkedin: "https://www.linkedin.com/in/PLACEHOLDER",
    github: "https://github.com/PLACEHOLDER",
    resume: "/resume.pdf", // PLACEHOLDER: add public/resume.pdf
  },
} as const;

export const nav = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "contact", label: "Contact", href: "/#contact" },
] as const;

export type NavItem = (typeof nav)[number];
