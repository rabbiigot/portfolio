import type { ReactNode } from 'react';
import type { ServiceItem } from '../../lib/site';
import { readableText } from '../../lib/ui';

export function ServiceLogo({
  service,
  size = 28,
  rounded = 8,
}: {
  service: ServiceItem;
  size?: number;
  rounded?: number;
}) {
  if (service.logo) {
    return (
      <img
        src={service.logo}
        alt={service.name}
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: rounded }}
        className="object-contain"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, borderRadius: rounded, background: service.logoBg ?? service.accent }}
      className="grid place-items-center font-extrabold text-white ring-1 ring-white/10"
    >
      <span style={{ fontSize: size * 0.5 }}>{service.name[0]}</span>
    </div>
  );
}

/**
 * A browser-window chrome wrapping a light "app canvas". The mock UIs render
 * inside — so a monochrome portfolio hosts a faithful, branded preview of each
 * real app running on mock data.
 */
export function DemoFrame({
  service,
  liveUp,
  children,
}: {
  service: ServiceItem;
  liveUp?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl2 border border-border shadow-2xl">
      {/* title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-[#0f1115] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 pl-2">
            <ServiceLogo service={service} size={20} rounded={5} />
            <span className="text-sm font-semibold text-white">{service.name}</span>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/70">
            Mock data
          </span>
        </div>
        {service.liveUrl && liveUp && (
          <a
            href={service.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: service.accent, color: readableText(service.accent) }}
          >
            Open live app
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        )}
      </div>

      {/* app canvas (light) */}
      <div className="bg-[#f4f6f9] text-slate-800">{children}</div>
    </div>
  );
}
