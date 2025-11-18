import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:scale-105 active:scale-95 h-10 px-4 py-2',
  {
    variants: {
      variant: {
        default: '',
        outline: 'bg-gradient-to-br from-slate-50 to-slate-100 shadow-[3px_3px_8px_#d4ede1,_-3px_-3px_8px_#ffffff] text-slate-800 border border-slate-300 font-semibold hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-900 hover:border-emerald-300 hover:shadow-[inset_3px_3px_8px_#d4ede1,_inset_-3px_-3px_8px_#ffffff] hover:scale-100',
        secondary: 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 font-semibold hover:from-slate-200 hover:to-slate-300',
        ghost: 'bg-transparent hover:bg-emerald-50 text-emerald-800 font-semibold',
        link: 'bg-transparent underline-offset-4 hover:underline text-emerald-700 font-semibold',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3 text-sm',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = 'Button';


