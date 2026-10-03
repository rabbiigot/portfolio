import type { ReactNode } from 'react';

/** Cursor-following spotlight, same effect the Work cards use. */
function spotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
}

/**
 * The reusable Work-page card: frosted glass, lift + border on hover, and a
 * spotlight that follows the cursor. Use everywhere for consistent cards.
 */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      onPointerMove={spotlight}
      className={`card-surface group hover:-translate-y-1 hover:border-white/30 ${className}`}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(30rem 20rem at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.06), transparent 60%)',
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
