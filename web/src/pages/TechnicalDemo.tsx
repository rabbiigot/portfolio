import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api, type PlanResult } from '../lib/api';
import { Reveal } from '../components/Reveal';
import { SpotlightCard } from '../components/SpotlightCard';
import { DemoStepper } from '../components/DemoStepper';

export function TechnicalDemo() {
  return (
    <div>
      <Reveal>
        <div className="eyebrow">Technical demo</div>
        <h1 className="text-[clamp(30px,5vw,48px)] font-extrabold tracking-tight">
          This page is the proof.
        </h1>
        <p className="mt-4 max-w-[680px] text-lg text-muted">
          Everything below talks to a real backend — a NestJS + Prisma API on a live database. The AI
          panel routes a natural-language request through the SimpleFlow AI orchestrator (in{' '}
          <span className="text-text">dry-run</span> mode, so it plans real tool calls without mutating
          anything).
        </p>
      </Reveal>

      <Reveal>
        <Architecture />
      </Reveal>

      <Reveal>
        <div className="mt-14">
          <DemoStepper />
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-6">
          <AiPlanner />
        </div>
      </Reveal>

      <Reveal>
        <ToolsCatalogue />
      </Reveal>
    </div>
  );
}

function Architecture() {
  return (
    <div className="mt-10">
      <SpotlightCard className="overflow-x-auto !p-6">
        <pre className="font-mono text-xs leading-relaxed text-muted sm:text-sm">{`Browser (this page)
     │  fetch /api/*
     ▼
React + TanStack Query  ──►  NestJS API (/api)  ──►  Prisma  ──►  SQLite / PostgreSQL
                                  │
                                  │  POST /ai-orchestration/chat  { dryRun: true }
                                  ▼
                      SimpleFlow AI Orchestrator  ──►  LLM plans 40+ tools`}</pre>
      </SpotlightCard>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SpotlightCard className="!p-6">
      <h3 className="text-lg font-bold">{title}</h3>
      {children}
    </SpotlightCard>
  );
}

function AiPlanner() {
  const [message, setMessage] = useState('Create a workspace Q1 with tasks: design login, build API, ship dashboard');
  const plan = useMutation<PlanResult, Error, string>({ mutationFn: api.aiPlan });

  return (
    <Panel title="AI orchestrator — natural language → tool plan">
      <p className="mt-2 text-sm text-muted">
        Type a request. The API asks the orchestrator to <em>plan</em> the tool calls it would run.
      </p>
      <form
        className="mt-4 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          plan.mutate(message);
        }}
      >
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-xl border border-border bg-bg-soft px-4 py-3 text-sm text-text outline-none focus:border-accent"
        />
        <button type="submit" disabled={plan.isPending} className="btn btn-primary justify-center">
          {plan.isPending ? 'Planning…' : 'Plan it'}
        </button>
      </form>

      {plan.isError && <p className="mt-3 text-sm text-red-400">{plan.error.message}</p>}

      {plan.data && (
        <div className="mt-5">
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                plan.data.source === 'simpleflow'
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-white/10 text-muted'
              }`}
            >
              {plan.data.source === 'simpleflow' ? 'SimpleFlow orchestrator' : 'local planner'}
            </span>
            <span className="text-muted">{plan.data.message}</span>
          </div>

          <ol className="mt-4 space-y-2">
            {plan.data.plannedActions.map((a, i) => (
              <li key={i} className="rounded-xl border border-border bg-bg-soft p-3">
                <div className="font-mono text-sm text-accent">{a.tool}</div>
                {Object.keys(a.input).length > 0 && (
                  <pre className="mt-1 overflow-x-auto font-mono text-xs text-muted">
                    {JSON.stringify(a.input)}
                  </pre>
                )}
                {a.reason && <div className="mt-1 text-xs text-faint">{a.reason}</div>}
              </li>
            ))}
          </ol>

          {plan.data.note && <p className="mt-3 text-xs text-faint">{plan.data.note}</p>}
        </div>
      )}
    </Panel>
  );
}

function ToolsCatalogue() {
  const tools = useQuery({ queryKey: ['ai-tools'], queryFn: () => api.aiTools() });
  const groups = (tools.data ?? []).reduce<Record<string, typeof tools.data>>((acc, t) => {
    (acc[t.group] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="mt-14">
      <div className="eyebrow">Orchestrator catalogue</div>
      <h2 className="text-[clamp(24px,3.5vw,34px)] font-extrabold tracking-tight">
        Tools the AI can plan against
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="rounded-xl2 border border-border bg-bg-soft p-5">
            <h4 className="mb-3 text-sm uppercase tracking-[0.1em] text-faint">{group}</h4>
            <ul className="space-y-2">
              {items?.map((t) => (
                <li key={t.name}>
                  <div className="font-mono text-xs text-accent">{t.name}</div>
                  <div className="text-xs text-muted">{t.description}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
