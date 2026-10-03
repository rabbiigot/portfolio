/**
 * ┌────────────────────────────────────────────────────────────────┐
 * │  EDIT ME — this is the ONLY file with personal placeholders.     │
 * │  Replace the values below with your real details.                │
 * └────────────────────────────────────────────────────────────────┘
 */
export const site = {
  name: 'Rabbi Carabio Igot',
  role: 'Full-Stack Developer',
  focus: 'Web · Mobile · AI',
  location: 'Philippines',
  email: 'rabbiigot@gmail.com',
  github: 'https://github.com/rabbiigot',
  linkedin: 'https://ph.linkedin.com/in/rabbi-igot-ba8470163',
  available: true,

  // Optional avatar image URL (put a file in web/public and use "/me.jpg", or a
  // remote URL). Leave empty to show initials in a gradient circle.
  avatar: '/rabbi-pro-pic.png',
  tagline: 'Full-stack developer building AI-powered products end to end.',

  hero: {
    badge: 'Available for freelance & contract work',
    lead: 'I design, build, and ship complete web and mobile apps — from polished React frontends to NestJS/Prisma backends, AI features, and the infrastructure that runs them in production.',
  },

  stats: [
    { n: '15+', l: 'Products & platforms shipped' },
    { n: 'Full-stack', l: 'Frontend → backend → infra' },
    { n: 'AI-native', l: 'LLM agents, RAG, realtime voice' },
    { n: 'Prod-ready', l: 'Docker, CI/CD, self-hosted VPS' },
  ],

  stack: [
    {
      group: 'Frontend',
      items: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS', 'React Native / Expo'],
    },
    {
      group: 'Backend',
      items: ['Node.js', 'NestJS', 'Express', 'Prisma', 'PostgreSQL', 'REST & WebSockets'],
    },
    {
      group: 'AI',
      items: ['Claude Agent SDK', 'OpenAI', 'RAG & pgvector', 'Realtime voice', 'Prompt engineering'],
    },
    {
      group: 'DevOps & Integrations',
      items: ['Docker', 'nginx', 'GitHub Actions', 'Linux VPS', 'Stripe / PayMongo', 'Twilio', 'Google APIs'],
    },
  ],

  about: [
    "I'm a full-stack web developer who likes owning a product from the first line of code to the server it runs on. I've shipped SaaS products, mobile apps, and large client platforms — and I'm especially at home building AI-native features: agents, retrieval systems, and realtime voice.",
    "I care about the details that make software feel good — fast interfaces, clean APIs, and deployments that don't fall over. When something needs infrastructure (Docker, CI/CD, a VPS, TLS, background workers), I set it up myself rather than hand it off.",
    'Right now I\'m building my own products under the FlowLab umbrella while taking on select client work.',
  ],

  // ── Background / experience timeline (About page) ──────────────────
  // EDIT the periods/roles to your real history. Entries render newest-first
  // exactly as ordered here.
  experience: [
    {
      period: 'Apr 2025 — Dec 2025',
      role: 'Full-Stack Developer',
      org: 'itsJobvious · Cebu',
      blurb:
        'Full-stack across Vite/React + TypeScript frontends and NestJS backends — building components from UI/UX specs, designing SQL schemas and REST APIs, platform integrations, and clean module/controller/service architecture.',
    },
    {
      period: 'Jun 2022 — 2025',
      role: 'Software Engineer',
      org: 'Accenture Inc. · Cebu',
      blurb:
        'Built new features and remediated application vulnerabilities and bugs. Primary Build Master running CI/CD pipelines for staging and production; operations & support including PAM credential rotation and secrets management.',
    },
    {
      period: 'Nov 2023 — Dec 2024',
      role: 'System Analyst / Backend Developer (Part-time)',
      org: 'Grip & Grit · Cebu',
      blurb: 'Backend development, automations, and technical support for the client’s systems.',
    },
    {
      period: 'Jul 2021 — Dec 2021',
      role: 'Assistant Product Manager',
      org: 'DNA Micro Software Inc. · Cebu',
      blurb:
        'Assistant Product Owner — process flows (Visio) and sequence diagrams (Mermaid), coordinating multiple scrum teams, monitoring developer productivity, and planning delivery strategies.',
    },
  ],

  // Credentials — shown on the About page.
  credly: 'https://www.credly.com/users/rabbi-igot.a8b8a32d',
  certificatesUrl: 'https://rabbiigot.github.io/licenses-certifications',
  certifications: [
    'HashiCorp Terraform Associate',
    'AWS Solutions Architect — Associate',
    'AWS Certified Database — Specialty',
    'AWS Certified Cloud Practitioner',
    'Microsoft Azure Administrator (AZ-104)',
    'Microsoft Azure Fundamentals (AZ-900)',
    'Licensed Electronics Engineer',
    'Licensed Electronics Technician',
  ],
};

export type Site = typeof site;

/** The FlowLab umbrella brand shown atop the Services page. */
export const flowlab = {
  name: 'FlowLab',
  tagline: 'The studio behind SimpleFlow, VisionFlow & CallFlow.',
  blurb:
    'FlowLab is my product studio — a suite of AI-native tools built on one shared foundation. Each product below is a real app; click "Try demo" to explore its interface running on mock data, or open the live app where available.',
};

export interface ServiceItem {
  slug: string; // also the overview route: /services/:slug
  name: string;
  tagline: string;
  logo: string | null; // /public path, or null → monogram
  logoBg?: string; // background for the monogram tile (defaults to accent)
  accent: string;
  liveUrl?: string; // shown only when reachable (server-side uptime check)
  tags: string[];
  description: string;
  goal: string;
  features: string[];
}

/** Products with in-portfolio interactive demos (mock data, real branding). */
export const services: ServiceItem[] = [
  {
    slug: 'simpleflow',
    name: 'SimpleFlow',
    tagline: 'AI-powered operating system for teams — boards, tasks, and an AI orchestrator.',
    logo: '/simpleflow-mark.png',
    accent: '#0077ED',
    liveUrl: 'https://simpleflowai.syncstack.tech',
    tags: ['Team OS', 'AI orchestrator', 'Boards & tasks'],
    description:
      'An AI-powered operating system for teams — workspaces, task boards, a social feed, automations and analytics in one hub, all driveable in natural language through an AI orchestrator exposing 40+ tools.',
    goal: 'Give a team one place to run the business, and let AI handle the busywork across every tool.',
    features: [
      'Workspaces & Kanban task boards',
      'AI orchestrator: natural language → real actions',
      'Dashboards, insights & reports',
      'Trigger → action automations',
      'Team social feed & chat',
    ],
  },
  {
    slug: 'maako',
    name: 'MAAKO Daily',
    tagline: 'Local-first self-growth & habit tracking — calm, fast, and offline-friendly.',
    logo: '/maako-mark.png',
    accent: '#F5A524',
    tags: ['Habit tracking', 'Self-growth', 'Local-first'],
    description:
      'A local-first self-growth and habit-tracking mobile app (Expo / React Native) with a lightweight NestJS companion API. Calm, fast, and offline-friendly — it stays useful without a connection and syncs when online.',
    goal: 'Help people build daily habits and reflect, with zero friction and no login wall.',
    features: [
      'Daily habits, streaks & progress',
      'Journal & affirmations',
      'Community feed',
      'Works offline (local-first)',
      'Clean, warm mobile UI',
    ],
  },
  {
    slug: 'callflow',
    name: 'CallFlow',
    tagline: 'Automated phone screening with real-time conversational voice AI.',
    logo: '/callflow-mark.png',
    accent: '#0077ED',
    tags: ['Voice AI', 'Screening', 'Telephony'],
    description:
      'Automated phone screening powered by real-time conversational voice AI. It places the call, listens, responds naturally with low latency, and returns a scored, summarized transcript.',
    goal: 'Screen candidates or leads by phone at scale — consistent questions, instant summaries.',
    features: [
      'Real-time conversational voice AI',
      'Configurable call flows & voices',
      'Live transcripts',
      'Automatic scoring & summaries',
    ],
  },
  {
    slug: 'geo',
    name: 'Geo AI',
    tagline: 'AI development studio — prompt or speak, watch an agent edit a live app.',
    logo: null,
    logoBg: '#000000',
    accent: '#0077ED',
    liveUrl: 'https://geo.reiboss.tech',
    tags: ['AI dev studio', 'Live preview', 'Agent SDK'],
    description:
      'A browser-based AI development studio: describe a change by prompt or voice and an agent edits the live codebase while you watch it render. One click commits, opens a PR, merges, and streams CI status.',
    goal: 'Turn intent into shipped code — describe it, review the plan, deploy from the browser.',
    features: [
      'Prompt & voice input',
      'Agent edits a live codebase (Claude Agent SDK)',
      'Instant live preview (HMR)',
      'One-click PR + deploy with CI status',
      'Tool-approval permission layer',
    ],
  },
];
