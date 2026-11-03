// The Crew section. Images: drop transparent WebP cut-outs at public/crew/<id>.webp and they
// replace the placeholder figures automatically at the next build.

export type CrewMember = {
  id: "director" | "thinker" | "speedster";
  label: string; // plain-text name (no logos)
  role: string;
  line: string;
  alt: string;
};

export const crewIntro = {
  heading: "I don’t work alone.",
  sub: "They make me look like a genius. I write the prompts.",
};

// Display order on desktop: Thinker, Director (centre), Speedster.
export const crew: CrewMember[] = [
  {
    id: "thinker",
    label: "Claude Code",
    role: "The Thinker",
    line: "Analysis, planning and reasoning through structure.",
    alt: "The Thinker: a cream retro TV robot with an orange screen face and a small smile.",
  },
  {
    id: "director",
    label: "Me",
    role: "The Director",
    line: "Understands the problem, designs the workflow and makes the calls.",
    alt: "The Director: Abhinav as a vinyl toy in a black hoodie and white sneakers, holding a glass of chai.",
  },
  {
    id: "speedster",
    label: "Codex",
    role: "The Speedster",
    line: "Fast builds, rapid prototypes, shipping.",
    alt: "The Speedster: a violet juice box with big round eyes and a striped bendy straw.",
  },
];
