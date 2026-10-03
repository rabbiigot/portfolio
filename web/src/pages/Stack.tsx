import type { ComponentType } from 'react';
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiVite,
  SiTailwindcss,
  SiExpo,
  SiNodedotjs,
  SiNestjs,
  SiExpress,
  SiPrisma,
  SiPostgresql,
  SiDocker,
  SiNginx,
  SiGithubactions,
  SiLinux,
  SiStripe,
  SiGoogle,
} from 'react-icons/si';
import { Sparkles, AudioLines, Braces, Network, Bot, Phone } from 'lucide-react';
import { site } from '../lib/site';
import { Reveal } from '../components/Reveal';
import { SpotlightCard } from '../components/SpotlightCard';

type IconCmp = ComponentType<{ size?: string | number; className?: string }>;

// Brand logos (Simple Icons) with sensible fallbacks for non-branded skills.
const ICONS: Record<string, IconCmp> = {
  React: SiReact,
  TypeScript: SiTypescript,
  'Next.js': SiNextdotjs,
  Vite: SiVite,
  'Tailwind CSS': SiTailwindcss,
  'React Native / Expo': SiExpo,
  'Node.js': SiNodedotjs,
  NestJS: SiNestjs,
  Express: SiExpress,
  Prisma: SiPrisma,
  PostgreSQL: SiPostgresql,
  'REST & WebSockets': Network,
  'Claude Agent SDK': Sparkles,
  OpenAI: Bot,
  'RAG & pgvector': SiPostgresql,
  'Realtime voice': AudioLines,
  'Prompt engineering': Braces,
  Docker: SiDocker,
  nginx: SiNginx,
  'GitHub Actions': SiGithubactions,
  'Linux VPS': SiLinux,
  'Stripe / PayMongo': SiStripe,
  Twilio: Phone,
  'Google APIs': SiGoogle,
};

export function Stack() {
  return (
    <>
      <Reveal>
        <div className="eyebrow">Toolbox</div>
        <h1 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight">Tech I work with</h1>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {site.stack.map((g) => (
          <Reveal key={g.group}>
            <SpotlightCard className="p-6">
              <h4 className="mb-4 text-sm uppercase tracking-[0.1em] text-faint">{g.group}</h4>
              <div className="flex flex-wrap gap-2.5">
                {g.items.map((i) => {
                  const Icon = ICONS[i];
                  return (
                    <span key={i} className="chip flex items-center gap-2">
                      {Icon ? (
                        <Icon size={15} className="text-muted" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-faint" />
                      )}
                      {i}
                    </span>
                  );
                })}
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </>
  );
}
