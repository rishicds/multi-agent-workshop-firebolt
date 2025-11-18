import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md',
        secondary: 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 shadow-sm',
        outline: 'bg-white shadow-[2px_2px_5px_#d4ede1,_-2px_-2px_5px_#ffffff] text-emerald-700',
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md',
        warning: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}


