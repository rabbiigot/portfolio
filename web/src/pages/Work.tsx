import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Reveal } from '../components/Reveal';
import { ProjectCard } from '../components/ProjectCard';

export function Work() {
  const projects = useQuery({ queryKey: ['projects'], queryFn: () => api.projects() });

  return (
    <>
      <Reveal>
        <div className="eyebrow">Selected work</div>
        <h1 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight">
          Things I've built &amp; shipped
        </h1>
        <p className="mt-3 max-w-[560px] text-muted">
          A mix of my own products and platforms I've built for clients — each taken from idea to
          production. <span className="text-faint">Loaded live from the portfolio API.</span>
        </p>
      </Reveal>

      {projects.isLoading && <p className="mt-12 text-muted">Loading projects…</p>}
      {projects.isError && (
        <p className="mt-12 text-red-400">Couldn't reach the API. Is the backend running on :4000?</p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {projects.data?.map((p) => (
          <Reveal key={p.slug}>
            <ProjectCard project={p} feature={p.featured} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
