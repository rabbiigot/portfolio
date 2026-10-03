import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { site } from '../lib/site';
import { Avatar } from './Avatar';

interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
}

const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d={d} />
  </svg>
);

const NAV: NavItem[] = [
  { to: '/', label: 'Overview', icon: icon('M3 12l9-9 9 9M5 10v10h14V10') },
  { to: '/work', label: 'Work', icon: icon('M3 7h18v13H3zM8 7V4h8v3') },
  { to: '/services', label: 'Products & Services', icon: icon('M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z') },
  { to: '/stack', label: 'Tech Stack', icon: icon('M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5') },
  { to: '/demo', label: 'Technical Demo', icon: icon('M8 9l3 3-3 3M13 15h3M4 5h16v14H4z') },
  { to: '/about', label: 'About', icon: icon('M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0') },
  { to: '/contact', label: 'Contact', icon: icon('M4 5h16v14H4zM4 7l8 6 8-6') },
];

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-text"
    >
      {children}
    </a>
  );
}

const GH = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0022 12.25C22 6.58 17.52 2 12 2z" />
  </svg>
);
const LI = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.98 3.5A2.5 2.5 0 002.5 6a2.5 2.5 0 002.48 2.5A2.5 2.5 0 007.5 6a2.5 2.5 0 00-2.52-2.5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4z" />
  </svg>
);
const MAIL = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

function SidebarInner({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col p-3">
      {/* Profile */}
      <div className={`flex items-center gap-3 px-1 ${collapsed ? 'justify-center' : ''}`}>
        <Avatar size={collapsed ? 40 : 52} />
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-[15px] font-extrabold tracking-tight">{site.name}</div>
            <div className="truncate text-xs text-muted">{site.role}</div>
          </div>
        )}
      </div>

      {site.available && !collapsed && (
        <div className="mt-4 inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#c8cad0]">
          <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-emerald-400" />
          Open to work
        </div>
      )}

      {/* Nav */}
      <nav className="mt-6 flex flex-col gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl py-2 text-[15px] font-medium transition-colors ${
                collapsed ? 'justify-center px-0' : 'px-2.5'
              } ${
                isActive
                  ? 'bg-white/[0.07] text-text ring-1 ring-white/10'
                  : 'text-muted hover:bg-white/5 hover:text-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-all ${
                    isActive ? 'text-bg shadow-[0_0_16px_-4px_rgba(255,255,255,0.4)]' : 'text-muted group-hover:text-text'
                  }`}
                  style={
                    isActive
                      ? { background: 'linear-gradient(135deg,#f2f3f5,#cfd1d6)' }
                      : { background: 'rgba(255,255,255,0.05)' }
                  }
                >
                  {item.icon}
                </span>
                {!collapsed && item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-1 pt-6">
        <div className={`flex gap-2.5 ${collapsed ? 'flex-col items-center' : ''}`}>
          <Social href={site.github} label="GitHub">{GH}</Social>
          <Social href={site.linkedin} label="LinkedIn">{LI}</Social>
          <Social href={`mailto:${site.email}`} label="Email">{MAIL}</Social>
        </div>
        {!collapsed && (
          <p className="mt-4 text-xs text-faint">
            © {new Date().getFullYear()} {site.name}
          </p>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {/* Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-bg-soft transition-[width] duration-200 md:block ${
          collapsed ? 'w-[76px]' : 'w-72'
        }`}
      >
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-7 z-10 hidden h-6 w-6 place-items-center rounded-full border border-border bg-bg-soft text-muted transition-colors hover:text-text md:grid"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <SidebarInner collapsed={collapsed} />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg-soft/80 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2.5">
          <Avatar size={34} />
          <span className="text-sm font-extrabold tracking-tight">{site.name}</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-text">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-bg-soft">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 text-muted hover:text-text"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
