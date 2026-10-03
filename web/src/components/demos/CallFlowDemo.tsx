import { useState } from 'react';
import { PhoneCall } from 'lucide-react';
import type { ServiceItem } from '../../lib/site';

const ACCENT = '#0077ED';

const flows = [
  { name: 'Frontend Screen — React', status: 'Active', voice: 'sage', calls: 24 },
  { name: 'Sales SDR Qualifier', status: 'Active', voice: 'alloy', calls: 58 },
  { name: 'Support Callback', status: 'Draft', voice: 'coral', calls: 0 },
  { name: 'Recruiter Pre-screen', status: 'Active', voice: 'verse', calls: 11 },
];

const transcript = [
  { who: 'AI', text: 'Hi! Thanks for taking the call. Ready for a few quick questions about the React role?' },
  { who: 'Candidate', text: 'Yes, go ahead.' },
  { who: 'AI', text: 'Great. How do you decide between useMemo and useCallback?' },
  { who: 'Candidate', text: 'useMemo memoizes a computed value; useCallback memoizes a function reference…' },
  { who: 'AI', text: 'Solid. And how would you debug an unnecessary re-render?' },
];

export function CallFlowDemo({ service, liveUp }: { service?: ServiceItem; liveUp?: boolean }) {
  const [selected, setSelected] = useState(0);
  const embeddable = !!(service?.liveUrl && liveUp);

  return (
    <div className="min-h-[520px] p-5 text-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900">
          <PhoneCall size={20} style={{ color: ACCENT }} />
          Call Flows
        </h2>
        <button className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ background: ACCENT }}>
          + Create new
        </button>
      </div>

      {/* When CallFlow is deployed, embed the real app; the transcript below
          still shows a scored session. Until then, the flows list stands in. */}
      {embeddable && (
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
            Live CallFlow — embedded
          </div>
          <iframe src={service!.liveUrl} title="CallFlow" className="h-72 w-full" />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* flows list */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-slate-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <span>Flow</span>
            <span>Voice</span>
            <span>Calls</span>
          </div>
          {flows.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setSelected(i)}
              className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-slate-50 px-4 py-3 text-left last:border-0"
              style={i === selected ? { background: `${ACCENT}0d` } : undefined}
            >
              <div>
                <div className="font-medium text-slate-800">{f.name}</div>
                <span
                  className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={
                    f.status === 'Active'
                      ? { background: '#dcfce7', color: '#16a34a' }
                      : { background: '#f1f5f9', color: '#64748b' }
                  }
                >
                  {f.status}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-500">{f.voice}</span>
              <span className="text-xs text-slate-500">{f.calls}</span>
            </button>
          ))}
        </div>

        {/* session transcript */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-slate-800">Latest session</div>
            <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white" style={{ background: ACCENT }}>
              Score 8.5/10
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-400">{flows[selected].name} · 3m 42s</div>

          <div className="mt-3 space-y-2">
            {transcript.map((m, i) => (
              <div key={i} className={`flex ${m.who === 'AI' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className="max-w-[85%] rounded-2xl px-3 py-2 text-xs"
                  style={
                    m.who === 'AI'
                      ? { background: '#f1f5f9', color: '#334155' }
                      : { background: ACCENT, color: '#fff' }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
