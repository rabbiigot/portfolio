import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Real projects, ported from the original static portfolio. `description` adds
 * the long-form Problem/Solution detail the React project pages render.
 */
const projects = [
  {
    slug: 'geo-ai-dev-studio',
    title: 'Geo — AI Development Studio',
    kind: 'flagship · AI dev studio',
    blurb:
      'A prompt- and voice-driven studio where an AI agent edits a live codebase and you watch the changes render instantly.',
    description:
      'Geo is a browser-based development studio: describe a change by prompt or voice and an AI agent edits the live codebase while you watch it render via HMR. One-click ship commits, opens a pull request, merges, and streams live CI build status — all without leaving the browser. Built on the Claude Agent SDK with an interactive permission layer so risky actions ask before they run.',
    tags: ['React', 'Node.js', 'WebSockets', 'Claude Agent SDK', 'nginx', 'GitHub Actions'],
    liveUrl: 'https://geo.reiboss.tech',
    featured: true,
    order: 1,
  },
  {
    slug: 'simpleflow',
    title: 'SimpleFlow (FlowLab)',
    kind: 'SaaS · operations',
    blurb:
      'An AI-powered operating system for teams — automates and aggregates business data into one hub and runs weekly leadership meetings in-app.',
    description:
      'SimpleFlow aggregates business data from the tools a team already uses into a single hub, then lets them run weekly leadership meetings in-app with every metric live in one place. It ships an AI orchestration layer exposing 40+ tools (workspaces, tasks, automations, analytics) driven by natural language — the same orchestrator this portfolio’s Technical Demo talks to.',
    tags: ['React', 'NestJS', 'Prisma', 'PostgreSQL', 'AI Orchestration', 'Payments'],
    liveUrl: 'https://simpleflowai.syncstack.tech',
    featured: false,
    order: 2,
  },
  {
    slug: 'visionflow',
    title: 'VisionFlow',
    kind: 'AI · media',
    blurb:
      'An AI video studio that turns scripts and prompts into finished videos, with AI voiceover and generated background music.',
    description:
      'VisionFlow turns scripts and prompts into finished videos end to end: scene assembly, AI voiceover, and generated background music through a media pipeline. Built as a standalone studio spun out of SimpleFlow.',
    tags: ['React', 'Node.js', 'AI Audio', 'Media pipeline'],
    featured: false,
    order: 3,
  },
  {
    slug: 'callflow',
    title: 'CallFlow',
    kind: 'AI · voice',
    blurb:
      'Automated phone screening powered by real-time conversational AI — it calls, listens, responds naturally, and summarizes.',
    description:
      'CallFlow runs automated phone screens with real-time conversational AI: it places the call, listens, responds naturally with low latency, and produces a structured summary of the conversation. Built on realtime voice AI over telephony.',
    tags: ['Realtime voice AI', 'Node.js', 'Telephony'],
    featured: false,
    order: 4,
  },
  {
    slug: 'rei-boss',
    title: 'REI-BOSS — Investor Operating System',
    kind: 'product · real estate ops',
    blurb:
      'A large operations + CRM platform for real-estate investors: pipeline with two-way CRM sync, in-app video meetings, and an AI "second brain".',
    description:
      'REI-BOSS is a large operations and CRM platform for real-estate investors: a sales pipeline with two-way GoHighLevel sync, self-hosted in-app video meetings (LiveKit), an AI "second brain" (RAG over company docs with pgvector), real-time notifications, and role-based team workspaces. Runs self-hosted on a Linux VPS behind nginx with Dockerised services and CI/CD.',
    tags: ['React', 'NestJS', 'Postgres + pgvector', 'Docker', 'LiveKit', 'Realtime'],
    liveUrl: 'https://reiboss.tech',
    featured: false,
    order: 5,
  },
  {
    slug: 'maako-daily',
    title: 'MAAKO Daily',
    kind: 'mobile · wellness',
    blurb:
      'A local-first self-growth and habit-tracking mobile app with a lightweight companion API — clean, fast, offline-friendly.',
    description:
      'MAAKO Daily is a local-first self-growth and habit-tracking mobile app (Expo / React Native) backed by a lightweight NestJS + Prisma companion API. Designed to stay fast and useful offline, syncing when a connection is available.',
    tags: ['React Native', 'Expo', 'NestJS', 'Prisma'],
    featured: false,
    order: 6,
  },
  {
    slug: 'recruitment-ats',
    title: 'Recruitment / ATS Platform',
    kind: 'client · recruitment',
    blurb:
      'A candidate–job matching platform with automated screening, compensation rules, and notification workflows across the hiring pipeline.',
    description:
      'An applicant tracking / recruitment platform: candidate–job matching with automated screening, compensation-rule enforcement, and notification workflows across every stage of the hiring pipeline, integrated with external job boards.',
    tags: ['TypeScript', 'Node.js', 'PostgreSQL', 'Integrations'],
    featured: false,
    order: 7,
  },
];

async function main() {
  for (const p of projects) {
    const data = { ...p, tags: JSON.stringify(p.tags) };
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }
  console.log(`Seeded ${projects.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
