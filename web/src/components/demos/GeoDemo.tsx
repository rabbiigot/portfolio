import { Send, Mic, Wrench } from 'lucide-react';

const ACCENT = '#0077ED';

const messages = [
  { kind: 'user', text: 'Add a pricing section with three tiers to the landing page.' },
  { kind: 'assistant', text: "On it — I'll create a PricingSection component and drop it into the page." },
  { kind: 'tool', text: 'read_file  src/pages/Landing.tsx' },
  { kind: 'tool', text: 'write_file  src/components/PricingSection.tsx' },
  { kind: 'tool', text: 'edit_file  src/pages/Landing.tsx  (+1 import, +1 usage)' },
  { kind: 'assistant', text: 'Done. Three tiers added and rendered — the preview on the right updated via HMR.' },
  { kind: 'done', text: '✓ 3 files changed · preview reloaded' },
];

export function GeoDemo() {
  return (
    <div className="min-h-[520px] bg-[#0b0c0e] text-slate-200">
      {/* top status bar */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2 text-xs">
        {[
          ['tunnel', true],
          ['backend :8787', true],
          ['frontend :5173', true],
        ].map(([label, ok]) => (
          <span key={label as string} className="inline-flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full" style={{ background: ok ? '#28c840' : '#ff5f57' }} />
            {label}
          </span>
        ))}
        <span className="ml-auto rounded-md px-2 py-1 font-medium text-white" style={{ background: ACCENT }}>
          ● Running
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* chat */}
        <div className="flex min-h-[440px] flex-col border-r border-white/10">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => {
              if (m.kind === 'tool')
                return (
                  <div key={i} className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-400">
                    <Wrench size={12} style={{ color: ACCENT }} /> {m.text}
                  </div>
                );
              if (m.kind === 'done')
                return (
                  <div key={i} className="text-xs font-medium text-emerald-400">{m.text}</div>
                );
              return (
                <div key={i} className={`flex ${m.kind === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] rounded-2xl px-3 py-2 text-sm"
                    style={m.kind === 'user' ? { background: ACCENT, color: '#fff' } : { background: '#1a1b1f', color: '#e2e8f0' }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>
          {/* input bar */}
          <div className="flex items-center gap-2 border-t border-white/10 p-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-500">
              <Mic size={15} />
              Describe a change, or hold to speak…
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: ACCENT }}>
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* preview pane */}
        <div className="flex min-h-[440px] flex-col">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-slate-400">
            <span className="rounded-md bg-white/10 px-2 py-1 text-white">App</span>
            <span>API docs</span>
            <span className="ml-auto font-mono">localhost:5173</span>
          </div>
          <div className="flex-1 bg-white p-5 text-slate-800">
            <div className="text-center">
              <div className="text-lg font-extrabold text-slate-900">Simple, honest pricing</div>
              <div className="text-xs text-slate-500">Live preview — updated by the agent</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {['Starter', 'Pro', 'Team'].map((tier, i) => (
                <div
                  key={tier}
                  className="rounded-lg border p-3 text-center"
                  style={i === 1 ? { borderColor: ACCENT, boxShadow: `0 0 0 1px ${ACCENT}` } : { borderColor: '#e2e8f0' }}
                >
                  <div className="text-xs font-semibold text-slate-700">{tier}</div>
                  <div className="mt-1 text-lg font-extrabold" style={{ color: i === 1 ? ACCENT : '#0f172a' }}>
                    ${[0, 19, 49][i]}
                  </div>
                  <div className="text-[10px] text-slate-400">/mo</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
