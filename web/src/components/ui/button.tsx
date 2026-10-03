import * as React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'outline' | 'ghost';
type Size = 'default' | 'sm' | 'icon';

const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50';

const variantStyles: Record<Variant, string> = {
  default: 'bg-accent text-bg hover:bg-accent/90',
  outline: 'border border-border bg-card text-text hover:bg-white/5',
  ghost: 'text-muted hover:bg-white/5 hover:text-text',
};

const sizeStyles: Record<Size, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 px-3',
  icon: 'h-7 w-7',
};

/** shadcn-style button variants, themed to the portfolio palette. */
export function buttonVariants({
  variant = 'outline',
  size = 'default',
}: { variant?: Variant; size?: Size } = {}) {
  return cn(base, variantStyles[variant], sizeStyles[size]);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
