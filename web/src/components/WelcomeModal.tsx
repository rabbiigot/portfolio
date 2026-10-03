import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from './Avatar';
import { site } from '../lib/site';

/** Shown once on first visit (localStorage-gated). Introduces the goal and
 *  points visitors to Contact to message + book a meeting. */
export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('welcome-seen-v1')) setOpen(true);
  }, []);

  const close = () => {
    localStorage.setItem('welcome-seen-v1', '1');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />

      {/* animated running-light border wrapping a solid card */}
      <div className="running-border relative w-full max-w-lg rounded-[32px] p-[2px] shadow-2xl">
        <div className="relative z-10 overflow-hidden rounded-[30px] bg-[#0a0b0e] p-8 text-center">
          {/* soft top glow */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-40"
            style={{ background: 'radial-gradient(60% 100% at 50% 0%, rgba(255,255,255,0.06), transparent 70%)' }}
          />

          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 text-faint transition-colors hover:text-text"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="relative flex justify-center">
            <Avatar size={88} />
          </div>
          <h2 className="relative mt-4 text-2xl font-extrabold tracking-tight">
            Hi, I'm {site.name.split(' ')[0]}
          </h2>

          <p className="relative mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
            As a developer, my goal is to bring to life the app, product, automation, or system your
            organization or team wants to have.{' '}
            <span className="text-text">Let's achieve great things together.</span>
          </p>

          <p className="relative mx-auto mt-4 max-w-sm text-sm text-faint">
            If you'd like to proceed, head to <span className="text-text">Contact</span> — send a
            message and book a meeting (over Google Meet).
          </p>

          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" onClick={close} className="btn btn-primary">
              Go to Contact
            </Link>
            <button onClick={close} className="btn">
              Explore first
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
