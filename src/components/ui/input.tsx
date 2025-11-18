import * as React from 'react';
import { cn } from '../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-11 w-full rounded-xl bg-white px-4 py-2 text-sm shadow-[inset_2px_2px_5px_#d4ede1,_inset_-2px_-2px_5px_#ffffff] placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all',
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';


