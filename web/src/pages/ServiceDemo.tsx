import type { ComponentType } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { services, type ServiceItem } from '../lib/site';
import { Reveal } from '../components/Reveal';
import { DemoFrame } from '../components/demos/DemoFrame';
import { SimpleFlowDemo } from '../components/demos/SimpleFlowDemo';
import { MaakoDemo } from '../components/demos/MaakoDemo';
import { CallFlowDemo } from '../components/demos/CallFlowDemo';
import { GeoDemo } from '../components/demos/GeoDemo';

export type DemoProps = { service: ServiceItem; liveUp?: boolean };

const DEMOS: Record<string, ComponentType<DemoProps>> = {
  simpleflow: SimpleFlowDemo,
  maako: MaakoDemo,
  callflow: CallFlowDemo,
  geo: GeoDemo,
};

export function ServiceDemo() {
  const { slug = '' } = useParams();
  const service = services.find((s) => s.slug === slug);
  const Demo = DEMOS[slug];

  const up = useQuery({
    queryKey: ['uptime', service?.liveUrl],
    queryFn: () => api.uptime(service!.liveUrl!),
    enabled: !!service?.liveUrl,
    staleTime: 5 * 60 * 1000,
  });

  if (!service || !Demo) {
    return (
      <div>
        <p className="text-red-400">Demo not found.</p>
        <Link to="/services" className="text-muted hover:text-text">
          ← Back to services
        </Link>
      </div>
    );
  }

  return (
    <>
      <Reveal>
        <Link to="/services" className="text-sm text-muted transition-colors hover:text-text">
          ← Back to services
        </Link>
        <h1 className="mt-4 text-[clamp(26px,4vw,40px)] font-extrabold tracking-tight">
          {service.name} <span className="text-muted">— overview</span>
        </h1>
        <p className="mt-2 max-w-[680px] text-lg text-muted">{service.tagline}</p>
      </Reveal>

      {/* Overview: description · goal · features */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <div className="space-y-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent2">What it is</div>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{service.description}</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent2">Goal</div>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{service.goal}</p>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="rounded-xl2 border border-border bg-bg-soft p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent2">Features</div>
            <ul className="mt-3 space-y-2">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: service.accent }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="mb-3 mt-10 text-xs font-semibold uppercase tracking-[0.14em] text-accent2">
          Interactive preview — mock data, real branding
        </div>
      </Reveal>
      <div>
        <DemoFrame service={service} liveUp={up.data?.up}>
          <Demo service={service} liveUp={up.data?.up} />
        </DemoFrame>
      </div>
    </>
  );
}
