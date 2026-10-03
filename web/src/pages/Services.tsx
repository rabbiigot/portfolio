import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { flowlab, services, type ServiceItem } from '../lib/site';
import { readableText } from '../lib/ui';
import { Reveal } from '../components/Reveal';
import { SpotlightCard } from '../components/SpotlightCard';
import { ServiceLogo } from '../components/demos/DemoFrame';

function LiveLink({ service }: { service: ServiceItem }) {
  const up = useQuery({
    queryKey: ['uptime', service.liveUrl],
    queryFn: () => api.uptime(service.liveUrl!),
    enabled: !!service.liveUrl,
    staleTime: 5 * 60 * 1000,
  });

  if (!service.liveUrl || !up.data?.up) return null; // fallback: hide when down/unknown
  return (
    <a
      href={service.liveUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold"
      style={{ color: service.accent }}
    >
      Open live app
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <SpotlightCard className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <ServiceLogo service={service} size={44} rounded={12} />
        <div>
          <h3 className="text-lg font-bold">{service.name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {service.tags.map((t) => (
              <span key={t} className="text-xs text-faint">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 flex-1 text-[15px] text-muted">{service.tagline}</p>

      <div className="mt-4 flex items-center gap-4">
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold"
          style={{ background: service.accent, color: readableText(service.accent) }}
        >
          Overview
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
        <LiveLink service={service} />
      </div>
    </SpotlightCard>
  );
}

export function Services() {
  return (
    <>
      <Reveal>
        <div className="eyebrow">Products &amp; services</div>
        <h1 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight">{flowlab.name}</h1>
        <p className="mt-2 text-lg text-muted">{flowlab.tagline}</p>
        <p className="mt-4 max-w-[640px] text-muted">{flowlab.blurb}</p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {services.map((s) => (
          <Reveal key={s.slug}>
            <ServiceCard service={s} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
