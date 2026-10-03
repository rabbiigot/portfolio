import {
  LayoutDashboard,
  HandHeart,
  Layers,
  ServerCog,
  BarChart3,
  Workflow,
  Megaphone,
  Sparkles,
} from 'lucide-react';

const ACCENT = '#0077ED';

// SimpleFlow's real sidebar icons (from its constants/navigation).
const nav = [
  { label: 'Dashboard', Icon: LayoutDashboard },
  { label: 'Social', Icon: HandHeart },
  { label: 'Workspace', Icon: Layers },
  { label: 'Tasks', Icon: ServerCog },
  { label: 'Insights & Reports', Icon: BarChart3 },
  { label: 'Automation', Icon: Workflow },
  { label: 'Campaign', Icon: Megaphone },
  { label: 'Flowmo AI', Icon: Sparkles },
];
const kpis = [
  { l: 'Active goals', v: '8', d: '+2 this week' },
  { l: 'Tasks completed', v: '134', d: '+21 this week' },
  { l: 'Success rate', v: '92%', d: '+4%' },
  { l: 'Hours tracked', v: '76h', d: 'this week' },
];
const tasks = [
  { t: 'Finalize Q1 roadmap', s: 'In progress', time: '10:30' },
  { t: 'Review onboarding flow', s: 'Todo', time: '13:00' },
  { t: 'Ship billing webhook', s: 'In progress', time: '15:15' },
  { t: 'Team weekly sync', s: 'Done', time: '16:00' },
];

export function SimpleFlowDemo() {
  return (
    <div className="flex min-h-[520px] text-sm">
      {/* sidebar */}
      <aside className="hidden w-48 shrink-0 border-r border-slate-200 bg-white p-3 sm:block">
        <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Menu</div>
        {nav.map((n, i) => (
          <div
            key={n.label}
            className="mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium"
            style={i === 0 ? { background: ACCENT, color: '#fff' } : { color: '#475569' }}
          >
            <n.Icon size={16} strokeWidth={2} />
            {n.label}
          </div>
        ))}
      </aside>

      {/* main */}
      <div className="flex-1 overflow-hidden p-5">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Here's your overview</h2>
        <p className="text-slate-500">Tuesday — 4 tasks due, 2 goals on track this week.</p>

        {/* AI insight */}
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0d` }}>
          <div className="flex items-center gap-2 font-semibold" style={{ color: ACCENT }}>
            <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: ACCENT }}>
              <Sparkles size={13} />
            </span>
            Flowmo AI insight
          </div>
          <p className="mt-2 text-slate-600">
            You're 92% to this week's goal. Two tasks are blocked on the billing webhook — finishing it
            first unblocks the roadmap review.
          </p>
        </div>

        {/* KPIs */}
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.l} className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="text-2xl font-extrabold text-slate-900">{k.v}</div>
              <div className="text-xs font-medium text-slate-500">{k.l}</div>
              <div className="mt-1 text-[11px]" style={{ color: ACCENT }}>{k.d}</div>
            </div>
          ))}
        </div>

        {/* tasks */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3 font-semibold text-slate-800">Today's tasks</div>
          {tasks.map((task) => (
            <div key={task.t} className="flex items-center justify-between border-b border-slate-50 px-4 py-2.5 last:border-0">
              <div className="flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full border-2"
                  style={{ borderColor: task.s === 'Done' ? ACCENT : '#cbd5e1', background: task.s === 'Done' ? ACCENT : 'transparent' }}
                />
                <span className={task.s === 'Done' ? 'text-slate-400 line-through' : 'text-slate-700'}>{task.t}</span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: task.s === 'In progress' ? `${ACCENT}1a` : '#f1f5f9',
                    color: task.s === 'In progress' ? ACCENT : '#64748b',
                  }}
                >
                  {task.s}
                </span>
                <span className="text-xs text-slate-400">{task.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
