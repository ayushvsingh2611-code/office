// Global site config — single source of truth for SEO defaults.
export default {
  name: "AgentHive",
  blogName: "AgentHive Blog",
  // Relative paths for robust local & production hosting
  origin: "",
  baseUrl: "/blog/",
  // Blog-index description
  description:
    "Guides, deep dives, and comparisons on running multi-agent AI: orchestration, agent memory, automation, and the tooling landscape.",
  tagline: "Notes from the office floor.",
  lang: "en",
  locale: "en_US",
  author: {
    name: "Ayush Singh",
    twitter: "",
    url: "https://github.com/ayushvsingh2611-code/office",
  },
  // Home-page pillar anchors
  pillars: {
    what: "/#what",
    how: "/#how",
    why: "/#why",
    install: "/#install",
    claude: "/#claude",
    opensource: "/#opensource",
  },
  social: {
    github: "https://github.com/ayushvsingh2611-code/office",
    site: "/",
  },
  // Default OG image
  defaultOgImage: "/media/og.png",
  themeColor: "#0A0D14",
  // Topic clusters (categories) matching full 294-post catalog
  clusters: [
    { key: "comparisons", label: "Comparisons", count: 75, kind: "non-technical" },
    { key: "guides", label: "Guides", count: 62, kind: "technical" },
    { key: "concepts", label: "Concepts", count: 60, kind: "non-technical" },
    { key: "news", label: "News", count: 36, kind: "non-technical" },
    { key: "internals", label: "Internals", count: 19, kind: "technical" },
    { key: "story", label: "Story", count: 19, kind: "non-technical" },
    { key: "orchestration", label: "Orchestration", count: 9, kind: "technical" },
    { key: "use-cases", label: "Use Cases", count: 9, kind: "non-technical" },
    { key: "memory", label: "Memory", count: 5, kind: "technical" },
  ],
};
