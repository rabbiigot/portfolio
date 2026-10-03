import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Reveal } from '../components/Reveal';

export function ProjectDetail() {
  const { slug = '' } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.project(slug),
  });

  return (
    <div>
      <Link to="/work" className="text-sm text-muted transition-colors hover:text-text">
        ← Back to work
      </Link>

      {isLoading && <p className="mt-10 text-muted">Loading…</p>}
      {isError && <p className="mt-10 text-red-400">Project not found.</p>}

      {data && (
        <Reveal>
          <div className="mt-6 font-mono text-xs text-accent2">// {data.kind}</div>
          <h1 className="mt-3 text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight">{data.title}</h1>
          <p className="mt-4 max-w-[720px] text-lg text-muted">{data.blurb}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {data.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {data.liveUrl && (
              <a href={data.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                Visit live site
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            )}
            {data.sourceUrl && (
              <a href={data.sourceUrl} target="_blank" rel="noreferrer" className="btn">
                Source
              </a>
            )}
          </div>

          <div className="mt-12 max-w-[760px] rounded-xl2 border border-border bg-bg-soft p-7">
            <h2 className="text-sm uppercase tracking-[0.1em] text-faint">Overview</h2>
            <p className="mt-4 whitespace-pre-line text-[17px] leading-relaxed text-muted">
              {data.description || data.blurb}
            </p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
