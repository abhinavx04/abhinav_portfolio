// Journey timeline. Newest last; the line draws top to bottom.
// `year` is the short label in the year column; `period` is the longer date shown in the entry.

export type TimelineItem = {
  year: string;
  title: string;
  org: string;
  period?: string;
  detail?: string;
};

export const timeline: TimelineItem[] = [
  {
    year: "2023",
    title: "B.Tech, Computer Science and Engineering",
    org: "SRM Institute of Science and Technology, Kattankulathur",
    period: "Expected 2027",
  },
  {
    year: "2024",
    title: "Web Developer",
    org: "Churotech, freelance",
    period: "2024 to 2025",
    detail: "React, Next.js and Firebase. Built a platform for an automobile dealership.",
  },
  {
    year: "2025",
    title: "Software Developer Intern",
    org: "AstroX Aerospace",
    detail: "Drone telemetry systems.",
    // TODO [VERIFY]: exact dates, then add `period`.
  },
  {
    year: "2026",
    title: "Full-Stack Developer Intern",
    org: "Plustech Systems & Solutions",
    period: "January to February 2026",
  },
  {
    year: "2026",
    title: "Semester abroad",
    org: "Jeonbuk National University, South Korea",
    period: "March to June 2026",
    detail: "Database Design and Statistical Analysis.",
  },
  {
    year: "Now",
    title: "AI Generalist Intern",
    org: "Plivo, Bengaluru",
    period: "Since 2026",
  },
];

export const about =
  "I'm a Computer Science student at SRM Institute of Science and Technology, currently working as an AI Generalist Intern at Plivo. I've built web apps for clients, worked on real-time drone telemetry, replatformed production frontends, and now apply AI to real business workflows. I don't just want to use technology. I want to understand it, build with it, and use it to solve meaningful problems.";

// TODO [VERIFY]: CGPA, certifications, SRMJEE rank. Hidden until confirmed.
