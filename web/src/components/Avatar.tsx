import { site } from '../lib/site';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '·';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

/** Avatar: uses site.avatar if set, otherwise a gradient circle with initials. */
export function Avatar({ size = 56 }: { size?: number }) {
  const dim = { width: size, height: size };
  if (site.avatar) {
    return (
      <img
        src={site.avatar}
        alt={site.name}
        style={dim}
        className="rounded-full border border-border object-cover"
      />
    );
  }
  return (
    <div
      style={{ ...dim, background: 'linear-gradient(135deg,#d7d9de,#8a8d96)' }}
      className="grid place-items-center rounded-full font-extrabold text-bg"
    >
      <span style={{ fontSize: size * 0.36 }}>{initials(site.name)}</span>
    </div>
  );
}
