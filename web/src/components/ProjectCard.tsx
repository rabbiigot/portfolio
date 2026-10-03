import { Link } from 'react-router-dom';
import type { Project } from '../lib/api';
import { SpotlightCard } from './SpotlightCard';

export function ProjectCard({ project, feature = false }: { project: Project; feature?: boolean }) {
  return (
    <SpotlightCard className={feature ? 'sm:col-span-2' : ''}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-accent2">// {project.kind}</span>
        {/* Only show the Live link when the site is actually reachable
            (liveUp === true). Down or unknown → no dead link. */}
        {project.liveUrl && project.liveUp && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-bg-soft px-2.5 py-1 text-xs font-semibold transition-all hover:-translate-y-px hover:border-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            Live
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        )}
      </div>

      <h3 className="mt-3.5 text-[22px] font-bold tracking-tight">
        <Link to={`/projects/${project.slug}`} className="hover:text-white">
          {project.title}
        </Link>
      </h3>
      <p className="mt-2.5 text-[15px] text-muted">{project.blurb}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-text"
        >
          Read more
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </SpotlightCard>
  );
}
