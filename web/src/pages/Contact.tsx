import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Calendar, Video, Clock, CalendarIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { api } from '../lib/api';
import { site } from '../lib/site';
import { cn } from '../lib/utils';
import { Reveal } from '../components/Reveal';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Calendar as DatePicker } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';

export function Contact() {
  return (
    <>
      <Reveal>
        <div className="eyebrow">Contact</div>
        <h1 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight">Let's build something.</h1>
        <p className="mt-4 max-w-[560px] text-lg text-muted">
          Have a product, platform, automation, or AI feature you want shipped? Send a message — or
          book a meeting and we'll talk it through over Google Meet.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
        <Reveal className="h-full">
          <MessageForm />
        </Reveal>
        <Reveal className="h-full">
          <BookMeeting />
        </Reveal>
      </div>

      <p className="mt-8 text-sm text-faint">
        Or email me directly at{' '}
        <a href={`mailto:${site.email}`} className="text-muted hover:text-text">
          {site.email}
        </a>
        .
      </p>
    </>
  );
}

function MessageForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const mutation = useMutation({
    mutationFn: api.contact,
    onSuccess: () => toast.success('Message sent — I’ll get back to you shortly.'),
    onError: () => toast.error('Couldn’t send your message. Please try again or email me directly.'),
  });

  return (
    <div className="card-surface !p-6 flex h-full flex-col">
      <h3 className="text-lg font-bold">Send a message</h3>
      {mutation.isSuccess ? (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-sm text-emerald-300">
          Thanks — your message was received (id #{mutation.data.id}). I'll get back to you at{' '}
          {form.email || 'your email'}.
        </div>
      ) : (
        <form
          className="mt-4 flex flex-1 flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(form);
          }}
        >
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-border bg-card px-4 py-3 text-text outline-none focus:border-accent"
          />
          <input
            required
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border border-border bg-card px-4 py-3 text-text outline-none focus:border-accent"
          />
          <Textarea
            required
            placeholder="What are you building?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="h-auto min-h-32 flex-1"
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn btn-primary justify-center gap-2 disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 size={15} className="animate-spin" />}
            {mutation.isPending ? 'Sending…' : 'Send message'}
          </button>
          {mutation.isError && <p className="text-sm text-red-400">Something went wrong. Try again.</p>}
        </form>
      )}
    </div>
  );
}

const SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

function BookMeeting() {
  const [b, setB] = useState({ name: '', email: '', date: '', time: '' });
  const selectedDate = b.date ? new Date(`${b.date}T00:00:00`) : undefined;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  // Creates a real Google Calendar event with a Meet link server-side and
  // emails the invite to the guest.
  const booking = useMutation({
    mutationFn: api.bookMeeting,
    onSuccess: (data) =>
      toast.success('Meeting booked!', {
        description: `Invite sent to ${b.email}${data.meetLink ? ' with the Google Meet link.' : '.'}`,
      }),
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : '';
      toast.error('Couldn’t book that slot', {
        description: /not connected/i.test(msg)
          ? 'Calendar booking isn’t available right now — please email me directly.'
          : 'Try another time, or email me directly.',
      });
    },
  });

  const ready = b.name.trim() && b.email.trim() && b.date && b.time;

  const book = () => {
    if (!ready || booking.isPending) return;
    booking.mutate({ name: b.name, email: b.email, date: b.date, time: b.time });
  };

  return (
    <div className="card-surface !p-6 flex h-full flex-col">
      <h3 className="flex items-center gap-2 text-lg font-bold">
        <Calendar size={18} className="text-accent2" />
        Book a meeting
      </h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <Video size={14} /> 30-minute call over Google Meet.
      </p>

      {booking.isSuccess ? (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-sm text-emerald-300">
          Booked for <b>{b.date}</b> at <b>{b.time}</b> ({booking.data.timeZone}). A calendar invite
          with the Google Meet link is on its way to <b>{b.email}</b>.
          {booking.data.meetLink && (
            <>
              {' '}Join:{' '}
              <a
                href={booking.data.meetLink}
                target="_blank"
                rel="noreferrer"
                className="underline break-all"
              >
                {booking.data.meetLink}
              </a>
            </>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          <input
            placeholder="Your name"
            value={b.name}
            onChange={(e) => setB({ ...b, name: e.target.value })}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-text outline-none focus:border-accent"
          />
          <input
            type="email"
            placeholder="you@email.com"
            value={b.email}
            onChange={(e) => setB({ ...b, email: e.target.value })}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-text outline-none focus:border-accent"
          />
          <div>
            <label className="text-xs font-medium text-faint">Select a date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'mt-1 h-auto w-full justify-start rounded-xl px-4 py-3 text-sm font-normal',
                    !b.date && 'text-faint',
                  )}
                >
                  <CalendarIcon size={15} className="mr-2 text-accent2" />
                  {selectedDate ? format(selectedDate, 'EEE, MMM d, yyyy') : 'Select a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DatePicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setB({ ...b, date: format(d, 'yyyy-MM-dd') })}
                  disabled={{ before: todayStart }}
                  defaultMonth={selectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-faint">
              <Clock size={13} /> Pick a time
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setB({ ...b, time: s })}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    b.time === s
                      ? 'border-accent bg-white/10 text-text'
                      : 'border-border text-muted hover:text-text'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={book}
            disabled={!ready || booking.isPending}
            className="btn btn-primary justify-center gap-2 disabled:opacity-50"
          >
            {booking.isPending && <Loader2 size={15} className="animate-spin" />}
            {booking.isPending ? 'Booking…' : 'Book meeting on Google Meet'}
          </button>
          {booking.isError && (
            <p className="text-sm text-red-400">
              Couldn't book that slot — try another time, or email me directly.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
