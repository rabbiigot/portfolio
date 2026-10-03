import { BadgeCheck } from 'lucide-react';
import { site } from '../lib/site';
import { Reveal } from '../components/Reveal';
import { Avatar } from '../components/Avatar';
import { SpotlightCard } from '../components/SpotlightCard';

function Row({ k, v, last = false }: { k: string; v: string; last?: boolean }) {
  return (
    <div className={`flex justify-between py-3 text-[15px] ${last ? '' : 'border-b border-border'}`}>
      <span className="text-faint">{k}</span>
      <span>{v}</span>
    </div>
  );
}

export function About() {
  return (
    <>
      {/* Profile header */}
      <Reveal>
        <div className="eyebrow">About</div>
        <div className="mt-2 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar size={140} />
          <div>
            <h1 className="text-[clamp(26px,4vw,40px)] font-extrabold tracking-tight">{site.name}</h1>
            <p className="text-muted">{site.tagline}</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Bio */}
        <Reveal>
          <div className="space-y-4 text-[17px] text-muted">
            {site.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        {/* Details card */}
        <Reveal>
          <SpotlightCard className="p-6">
            <Row k="Role" v={site.role} />
            <Row k="Focus" v={site.focus} />
            <Row k="Location" v={site.location} />
            <Row k="Availability" v={site.available ? 'Open to work' : 'Booked'} />
            <Row k="Email" v={site.email} last />
          </SpotlightCard>
        </Reveal>
      </div>

      {/* Background / experience timeline */}
      <Reveal>
        <h2 className="mt-16 text-[clamp(22px,3vw,30px)] font-extrabold tracking-tight">Background</h2>
      </Reveal>
      <div className="mt-8 border-l border-border pl-6">
        {site.experience.map((e, i) => (
          <Reveal key={i}>
            <div className="relative pb-8 last:pb-0">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-accent" />
              <div className="text-xs font-medium uppercase tracking-[0.1em] text-faint">{e.period}</div>
              <div className="mt-1 text-lg font-bold">
                {e.role} <span className="text-muted">· {e.org}</span>
              </div>
              <p className="mt-1.5 max-w-[640px] text-[15px] text-muted">{e.blurb}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Licenses & certifications */}
      <Reveal>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[clamp(22px,3vw,30px)] font-extrabold tracking-tight">
            Licenses &amp; certifications
          </h2>
          <div className="flex flex-wrap gap-2.5">
            <a href={site.credly} target="_blank" rel="noreferrer" className="btn text-sm">
              View on Credly ↗
            </a>
          </div>
        </div>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {site.certifications.map((c) => (
          <Reveal key={c}>
            <a
              href={site.credly}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-4 py-3 text-sm transition-colors hover:border-accent"
            >
              <BadgeCheck size={18} className="shrink-0 text-accent2" />
              {c}
            </a>
          </Reveal>
        ))}
      </div>
    </>
  );
}
