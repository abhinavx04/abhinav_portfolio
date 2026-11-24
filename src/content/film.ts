// The film section: frames from RUNTIME (public/film), in film order. `at` is where the frame sits
// in the 41 second film. `story` is what shows when a visitor opens the frame.
// DRAFT stories: placeholders written from the film itself. Replace them with the real back stories.

export type FilmStill = {
  src: string;
  alt: string;
  at: string;
  title: string;
  story: string;
};

export const filmIntro = {
  eyebrow: "The film",
  heading: "Runtime",
  sub: "A 41 second film about a 2 AM outage, the crew that fixes it, and who wrote the prompts.",
  hint: "Open a frame to read its back story.",
  carouselLabel: "Frames from Runtime",
};

export const stills: FilmStill[] = [
  {
    src: "/film/still-1-6.webp",
    alt: "Bengaluru at 2 AM, rain on a neon street",
    at: "0:01",
    title: "2 AM",
    story:
      "Bengaluru, 2 AM, rain on a neon street. Every outage I’ve lived through starts the same way: a quiet city and one phone that won’t stop buzzing.",
  },
  {
    src: "/film/still-5-0.webp",
    alt: "A glass of chai beside a laptop: prod is down",
    at: "0:05",
    title: "Prod is down",
    story:
      "The chai is still hot when the alert lands. I wanted the calmest thing in the frame to sit right next to the worst news of the night.",
  },
  {
    src: "/film/still-13-4.webp",
    alt: "The Thinker, the Director and the Speedster walk down the server aisle",
    at: "0:13",
    title: "The crew",
    story:
      "The Thinker, the Director and the Speedster walk the server aisle together. Nobody fixes prod alone, and neither do I.",
  },
  {
    src: "/film/still-26-0.webp",
    alt: "A monster made of bugs towers over the crew",
    at: "0:26",
    title: "The monster",
    story: "Every bug from the sprint, stitched into one creature. This is what a backlog looks like at 2 AM.",
  },
  {
    src: "/film/still-32-2.webp",
    alt: "Close up of the Director’s eyes, lit red",
    at: "0:32",
    title: "The call",
    story: "Eyes lit red by the alarm. This is the moment I stop typing and start deciding.",
  },
  {
    src: "/film/still-35-0.webp",
    alt: "The monster bursts apart: deployed",
    at: "0:35",
    title: "Deployed",
    story: "The fix ships and the monster comes apart. One green word on a screen is worth the whole night.",
  },
  {
    src: "/film/still-38-6.webp",
    alt: "The crew walks away from a green explosion",
    at: "0:38",
    title: "Walk away",
    story: "Cool crews don’t look at explosions. We walk off, and the site you’re reading begins.",
  },
];
