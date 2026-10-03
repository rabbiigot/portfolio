import { useState } from 'react';
import { LayoutDashboard, PhoneCall } from 'lucide-react';
import { api, type TaskRow, type WorkspaceRow } from '../lib/api';

/** Small step-rail shared by both flows. */
function StepRail({ steps, step }: { steps: string[]; step: number }) {
  return (
    <div className="mt-5 flex items-center gap-2">
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 items-center gap-2">
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
              i <= step ? 'bg-white text-bg' : 'bg-white/10 text-muted'
            }`}
          >
            {i + 1}
          </span>
          <span className={`hidden text-xs sm:block ${i <= step ? 'text-text' : 'text-faint'}`}>{label}</span>
          {i < steps.length - 1 && <span className="h-px flex-1 bg-white/10" />}
        </div>
      ))}
    </div>
  );
}

/** SimpleFlow flow — real workspace/task rows written to and read from the DB. */
function WorkspaceFlow() {
  const STEPS = ['Intro', 'Create workspace', 'Add tasks', 'Result'];
  const [step, setStep] = useState(0);
  const [name, setName] = useState('Q1 Launch');
  const [workspace, setWorkspace] = useState<WorkspaceRow | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [fetched, setFetched] = useState<(WorkspaceRow & { tasks: TaskRow[] }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <StepRail steps={STEPS} step={step} />
      <div className="mt-6">
        {step === 0 && (
          <div>
            <p className="text-sm text-muted">
              You'll create a workspace, add a few tasks, then fetch the result straight from the
              database — the same stack that powers a real app.
            </p>
            <button onClick={() => setStep(1)} className="btn btn-primary mt-4">
              Start
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="text-xs font-medium text-faint">Workspace name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-bg-soft px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
            <div className="mt-2 font-mono text-xs text-faint">POST /api/workspaces</div>
            <button
              onClick={() =>
                run(async () => {
                  const w = await api.createWorkspace(name.trim() || 'Untitled');
                  setWorkspace(w);
                  setStep(2);
                })
              }
              disabled={busy}
              className="btn btn-primary mt-4"
            >
              {busy ? 'Creating…' : 'Create workspace'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-sm text-muted">
              Workspace <span className="font-semibold text-text">#{workspace?.id}</span> created. Add
              some tasks:
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(async () => {
                  if (!workspace || taskTitle.trim().length < 1) return;
                  const t = await api.addTask(workspace.id, taskTitle.trim());
                  setTasks((prev) => [...prev, t]);
                  setTaskTitle('');
                });
              }}
            >
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Design the login screen"
                className="flex-1 rounded-xl border border-border bg-bg-soft px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
              <button type="submit" disabled={busy} className="btn">
                Add
              </button>
            </form>
            <div className="mt-1 font-mono text-xs text-faint">POST /api/workspaces/{workspace?.id}/tasks</div>

            <ul className="mt-3 space-y-1.5">
              {tasks.map((t) => (
                <li key={t.id} className="rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm">
                  <span className="font-mono text-xs text-faint">#{t.id}</span> {t.title}
                </li>
              ))}
              {tasks.length === 0 && <li className="text-sm text-faint">No tasks yet.</li>}
            </ul>

            <button
              onClick={() =>
                run(async () => {
                  if (!workspace) return;
                  const w = await api.getWorkspace(workspace.id);
                  setFetched(w);
                  setStep(3);
                })
              }
              disabled={busy || tasks.length === 0}
              className="btn btn-primary mt-4"
            >
              {busy ? 'Fetching…' : 'Fetch from database →'}
            </button>
          </div>
        )}

        {step === 3 && fetched && (
          <div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="text-sm font-semibold text-emerald-300">
                Fetched from the database: GET /api/workspaces/{fetched.id}
              </div>
              <div className="mt-3">
                <div className="text-lg font-bold">{fetched.name}</div>
                <div className="text-xs text-faint">
                  {fetched.tasks.length} task{fetched.tasks.length === 1 ? '' : 's'} · created{' '}
                  {new Date(fetched.createdAt).toLocaleString()}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {fetched.tasks.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 text-sm">
                      <span className="h-4 w-4 rounded-full border-2 border-border" />
                      {t.title}
                      <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-faint">
                        {t.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={() =>
                run(async () => {
                  if (workspace) await api.deleteWorkspace(workspace.id);
                  setWorkspace(null);
                  setTasks([]);
                  setFetched(null);
                  setTaskTitle('');
                  setName('Q1 Launch');
                  setStep(0);
                })
              }
              disabled={busy}
              className="btn mt-4"
            >
              {busy ? 'Resetting…' : 'Reset demo'}
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}

/** CallFlow flow — a guided (simulated) phone screening producing a transcript. */
function ScreeningFlow() {
  const STEPS = ['Configure', 'Call', 'Result'];
  const [step, setStep] = useState(0);
  const [voice, setVoice] = useState('sage');
  const [question, setQuestion] = useState('How do you decide between useMemo and useCallback?');
  const [progress, setProgress] = useState(0);

  const startCall = () => {
    setStep(1);
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + 14;
        if (next >= 100) {
          clearInterval(id);
          setStep(2);
          return 100;
        }
        return next;
      });
    }, 260);
  };

  const transcript = [
    { who: 'AI', text: `Hi! Ready for a quick question? ${question}` },
    { who: 'Candidate', text: 'Sure — useMemo caches a computed value; useCallback caches a function reference…' },
    { who: 'AI', text: 'Good. When would that actually matter for performance?' },
    { who: 'Candidate', text: 'When passing callbacks to memoized children, or for expensive recomputations.' },
  ];

  return (
    <div>
      <StepRail steps={STEPS} step={step} />
      <div className="mt-6">
        {step === 0 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-faint">Voice</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {['alloy', 'sage', 'verse', 'coral'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVoice(v)}
                    className="rounded-lg border px-2.5 py-1 text-xs font-medium"
                    style={
                      voice === v
                        ? { background: '#0077ED', color: '#fff', borderColor: '#0077ED' }
                        : { borderColor: 'var(--border,#212329)', color: '#9a9ca4' }
                    }
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-faint">Screening question</label>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-bg-soft px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <button onClick={startCall} className="btn btn-primary mt-1">
              Run screening call
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-sm text-muted">Calling with the “{voice}” voice…</div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#0077ED] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-xs text-faint">Listening & transcribing…</div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Session transcript</div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                Score 8.5/10
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {transcript.map((m, i) => (
                <div key={i} className={`flex ${m.who === 'AI' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                      m.who === 'AI' ? 'bg-white/5 text-muted' : 'bg-[#0077ED] text-white'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="btn mt-4">
              Run another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const FLOWS = [
  { key: 'simpleflow', label: 'SimpleFlow — Workspace & tasks', Icon: LayoutDashboard, live: true },
  { key: 'callflow', label: 'CallFlow — Phone screening', Icon: PhoneCall, live: false },
] as const;

/**
 * Pick a service, then run its flow. SimpleFlow writes/reads real rows in the
 * database; CallFlow runs a guided simulated screening. Extendable per service.
 */
export function DemoStepper() {
  const [flow, setFlow] = useState<(typeof FLOWS)[number]['key']>('simpleflow');

  return (
    <div className="card-surface !p-6">
      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/15 text-[10px] text-emerald-400">
            ●
          </span>
          Live service · pick a demo to run
        </div>
        <h3 className="mt-2 text-xl font-bold">Try a real workflow</h3>

        {/* service selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {FLOWS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFlow(f.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                flow === f.key
                  ? 'border-white/30 bg-white/10 text-text'
                  : 'border-border text-muted hover:text-text'
              }`}
            >
              <f.Icon size={15} />
              {f.label}
              {f.live && (
                <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  DB
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-2 text-sm text-muted">
          {flow === 'simpleflow'
            ? 'Creates real workspace + task rows via the NestJS API, then reads them back from the database.'
            : 'Runs a guided phone-screening simulation and returns a scored transcript.'}
        </div>

        {flow === 'simpleflow' ? <WorkspaceFlow /> : <ScreeningFlow />}
      </div>
    </div>
  );
}
