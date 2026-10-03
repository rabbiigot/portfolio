import { Link } from 'react-router-dom';
import { site } from '../lib/site';
import { Reveal } from '../components/Reveal';
import { SpotlightCard } from '../components/SpotlightCard';

export function Overview() {
  return (
    <>
      <Reveal>
        {site.available && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-[#c8cad0]">
            <span className="h-2 w-2 animate-pulseDot rounded-full bg-emerald-400" />
            {site.hero.badge}
          </div>
        )}
        <h1 className="text-[clamp(36px,6vw,68px)] font-extrabold leading-[1.03] tracking-tight">
          Full-stack developer building
          <br />
          <span className="grad-text">AI-powered products</span> end to end.
        </h1>
        <p className="mt-6 max-w-[620px] text-[clamp(17px,2.2vw,20px)] text-muted">{site.hero.lead}</p>

        <div className="mt-9 flex flex-wrap gap-3.5">
          <Link to="/work" className="btn btn-primary">
            View my work
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link to="/demo" className="btn">
            Try the technical demo
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-16 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {site.stats.map((s) => (
            <SpotlightCard key={s.l} className="p-6">
              <div className="text-3xl font-extrabold tracking-tight">
                <span className="grad-text">{s.n}</span>
              </div>
              <div className="mt-1 text-sm text-faint">{s.l}</div>
            </SpotlightCard>
          ))}
        </div>
      </Reveal>
    </>
  );
}
