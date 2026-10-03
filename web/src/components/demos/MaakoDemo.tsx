import { useState } from 'react';
import {
  Sun,
  Users,
  BookOpen,
  TrendingUp,
  User,
  Flame,
  CircleCheck,
  Circle,
  Wifi,
  BatteryFull,
  SignalHigh,
} from 'lucide-react';

// MAAKO's real palette (from the app's theme.ts): warm cream + "sun" amber.
const C = {
  bg: '#FBF7F0',
  card: '#FFFFFF',
  text: '#1F2430',
  soft: '#6B7280',
  sun: '#F5A524',
  sunSoft: '#FEF1D6',
  sunDeep: '#B4740A',
  leaf: '#6FA84B',
  border: '#ECE7DE',
  track: '#F3E3C0',
};

const initialHabits = [
  { name: 'Morning journal', done: true },
  { name: 'Drink water', done: true },
  { name: 'Read 10 pages', done: false },
  { name: 'Workout', done: false },
  { name: 'No phone after 10pm', done: false },
];

export function MaakoDemo() {
  const [habits, setHabits] = useState(initialHabits);
  const doneCount = habits.filter((h) => h.done).length;
  const pct = Math.round((doneCount / habits.length) * 100);

  return (
    <div
      className="grid min-h-[560px] place-items-center p-8"
      style={{ background: 'radial-gradient(circle at 50% 25%, #fbf7f0 0%, #e7e1d5 75%)' }}
    >
      {/* device bezel */}
      <div
        className="relative rounded-[46px] p-3 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)]"
        style={{ background: 'linear-gradient(150deg,#2b2b30,#0a0a0c)' }}
      >
        <div className="relative w-[300px] overflow-hidden rounded-[36px]" style={{ background: C.bg }}>
          {/* status bar */}
          <div
            className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold"
            style={{ color: C.text }}
          >
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <SignalHigh size={13} />
              <Wifi size={13} />
              <BatteryFull size={16} />
            </div>
          </div>
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          <div className="px-5 pb-3 pt-3" style={{ color: C.text }}>
            {/* greeting */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs" style={{ color: C.soft }}>
                  Good morning
                </div>
                <div className="text-lg font-extrabold">Rabbi 🌱</div>
              </div>
              <div
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                style={{ background: C.sunSoft, color: C.sunDeep }}
              >
                <Flame size={13} /> 12-day streak
              </div>
            </div>

            {/* progress card */}
            <div className="mt-4 rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Today's growth</div>
                  <div className="text-xs" style={{ color: C.soft }}>
                    {doneCount} of {habits.length} habits
                  </div>
                </div>
                {/* ring */}
                <div
                  className="grid h-14 w-14 place-items-center rounded-full text-sm font-extrabold"
                  style={{
                    background: `conic-gradient(${C.sun} ${pct}%, ${C.track} ${pct}%)`,
                    color: C.sunDeep,
                  }}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full" style={{ background: C.card }}>
                    {pct}%
                  </div>
                </div>
              </div>
            </div>

            {/* habits */}
            <div className="mt-4 text-sm font-semibold">Today's habits</div>
            <div className="mt-2 space-y-2">
              {habits.map((h, i) => (
                <button
                  key={h.name}
                  onClick={() =>
                    setHabits((prev) => prev.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))
                  }
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left"
                  style={{ background: C.card, border: `1px solid ${C.border}` }}
                >
                  {h.done ? (
                    <CircleCheck size={22} color={C.leaf} />
                  ) : (
                    <Circle size={22} color={C.border} />
                  )}
                  <span className="flex-1 text-sm" style={{ color: h.done ? C.soft : C.text, textDecoration: h.done ? 'line-through' : 'none' }}>
                    {h.name}
                  </span>
                </button>
              ))}
            </div>

            {/* bottom tab bar — MAAKO's real tabs */}
            <div className="mt-5 flex items-center justify-around rounded-2xl py-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              {[
                { label: 'Home', Icon: Sun },
                { label: 'Community', Icon: Users },
                { label: 'Journal', Icon: BookOpen },
                { label: 'Progress', Icon: TrendingUp },
                { label: 'Profile', Icon: User },
              ].map((t, i) => (
                <div
                  key={t.label}
                  className="flex flex-col items-center gap-0.5 text-[10px] font-medium"
                  style={{ color: i === 0 ? C.sunDeep : C.soft }}
                >
                  <t.Icon size={18} />
                  {t.label}
                </div>
              ))}
            </div>
          </div>
          {/* home indicator */}
          <div className="flex justify-center pb-2">
            <div className="h-1 w-28 rounded-full bg-black/25" />
          </div>
        </div>
      </div>
    </div>
  );
}
