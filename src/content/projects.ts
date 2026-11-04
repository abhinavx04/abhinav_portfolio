// Featured projects. Order here = order on the page. Edit freely; components read this file.
// Accuracy rule: only facts from the owner. Anything unconfirmed stays in a TODO comment.

export type Project = {
  slug: string;
  title: string;
  context: string; // company or setting, shown under the title
  status?: string; // shown as a pill when the work is not finished
  outcome: string; // one sentence for the card
  tags: string[]; // shown on the card (keep to ~5)
  // Detail page (/work/[slug])
  problem: string;
  built: string[];
  role?: string;
  stack: string[];
  result: string;
  metric?: { label: string; from: string; to: string }; // a verified before/after number
  statusNote: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "drone-telemetry-api",
    title: "Drone Telemetry API",
    context: "AstroX Aerospace, internship",
    outcome:
      "Turned live drone telemetry into filtered metrics, APIs and a real-time dashboard that tracks several drones on a map.",
    tags: ["Python", "FastAPI", "MQTT", "TimescaleDB", "WebSockets"],
    problem:
      "A Ground Control Station streams raw drone telemetry over UDP using MAVLink. That stream had to be filtered down to the metrics that matter and made available to other services and to people watching live.",
    built: [
      "FastAPI endpoints that expose the filtered telemetry",
      "MQTT messaging between the telemetry source and the services that consume it",
      "Time-series storage and schema design in TimescaleDB on PostgreSQL, with the SQL behind it",
      "WebSocket updates feeding a live dashboard",
      "Multi-drone tracking on maps",
      "Docker deployment on a VPS, plus exploration of failover and a microservices split",
    ],
    role: "Primarily backend and data interpretation.",
    stack: ["Python", "FastAPI", "MQTT", "MAVLink", "TimescaleDB", "PostgreSQL", "SQL", "WebSockets", "Docker"],
    result:
      "A pipeline from live MAVLink telemetry to time-series storage, APIs and a real-time dashboard with multi-drone tracking on maps.",
    statusNote: "Internship project at AstroX Aerospace.",
    // TODO [VERIFY]: exact internship dates before showing them.
  },
  {
    slug: "ai-recruitment-workflow",
    title: "AI-Assisted Recruitment Workflow",
    context: "Plivo",
    status: "Ongoing",
    outcome:
      "Designing AI-assisted steps for technical hiring, from reading a job description to drafting outreach and ranking resumes.",
    tags: ["Claude", "Claude Code", "Gemini", "Google Sheets"],
    problem:
      "Technical recruitment runs through the same steps for every role: reading the job description, turning it into search criteria, screening profiles and writing outreach. I am exploring which of those steps AI can help with.",
    built: [
      "Job description analysis that turns a JD into search criteria",
      "Profile screening into structured trackers",
      "Personalised outreach drafts",
      "LLM-based resume evaluation and ranking",
      "Role-specific evaluation instructions kept in separate Markdown files, so each role is judged against its own bar",
    ],
    role: "I design the workflows.",
    stack: ["Claude", "Claude Code", "Gemini", "Excel", "Google Sheets", "LinkedIn Recruiter"],
    result:
      "Some of these workflows work today; others are still experiments. I describe them here at a high level only.",
    statusNote: "Ongoing at Plivo.",
  },
  {
    slug: "application-replatform",
    title: "Application Replatform",
    context: "Plustech Systems & Solutions, internship",
    outcome:
      "Moved an existing app to React 19, TypeScript and Vite and raised its Lighthouse performance score from 81 to 96.",
    tags: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Firebase"],
    problem:
      "An existing application needed a modern frontend foundation, better performance and admin tooling that respected user roles.",
    built: [
      "The replatformed frontend on React 19, TypeScript and Vite",
      "Role-based admin features",
      "CRUD workflows for managing the app's data",
      "Performance and usability improvements across the app",
    ],
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Firebase"],
    result: "Lighthouse performance score went from 81 to 96.",
    metric: { label: "Lighthouse performance", from: "81", to: "96" },
    statusNote: "Internship project at Plustech Systems & Solutions.",
    // TODO [VERIFY]: my exact role on this project, if you want a "My role" section.
  },
  {
    slug: "smartagri",
    title: "SmartAgri",
    context: "Team project, four members",
    outcome:
      "Combined IoT air sensors, live updates and ML-based pest and disease prediction in one farm dashboard.",
    tags: ["Python", "ML", "React", "Node.js", "Socket.io"],
    problem:
      "Bring air sensor readings, live updates and pest and disease prediction together in one place.",
    built: [
      "IoT sensor data from an MQ-135 sensor (CO₂ and ammonia)",
      "Real-time updates with Socket.io",
      "Charts with Chart.js",
      "ML-based pest and disease prediction",
    ],
    stack: ["Python", "ML", "React", "Vite", "Node.js", "Express", "MongoDB", "Socket.io", "Chart.js"],
    result: "A dashboard that brings sensor readings, live charts and predictions together.",
    statusNote: "University team project.",
    // TODO [VERIFY]: ~94% validation accuracy. Add to `result` once confirmed.
    // TODO [VERIFY]: my role in the team.
    // NOTE: may be replaced by a dedicated SQL / data-analysis project.
  },
];

export const githubMoreLabel = "More projects on GitHub";

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
