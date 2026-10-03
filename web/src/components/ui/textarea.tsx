import * as React from 'react';
import { cn } from '../../lib/utils';

/** shadcn Textarea, themed to the portfolio palette. */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // resize-none + fixed height → it scrolls internally instead of
          // growing when you type past the visible area.
          'flex h-32 w-full resize-none overflow-y-auto rounded-xl border border-border bg-card px-4 py-3 text-sm text-text',
          'placeholder:text-faint focus-visible:border-accent focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
