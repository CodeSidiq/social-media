// src/components/ui/input.tsx

import * as React from 'react';

import { cn } from '@/lib/utils';

type InputProps = React.ComponentProps<'input'> & {
  hasError?: boolean;
  wrapperClassName?: string;
  endAdornment?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      hasError = false,
      wrapperClassName,
      endAdornment,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative w-full', wrapperClassName)}>
        <input
          ref={ref}
          type={type}
          data-slot='input'
          aria-invalid={hasError}
          className={cn(
            'flex h-14 w-full rounded-2xl border bg-transparent px-4 text-sm text-foreground outline-none transition-colors',
            'border-border',
            'placeholder:text-muted-foreground/70',
            'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            hasError &&
              'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
            endAdornment ? 'pr-12' : '',
            className
          )}
          {...props}
        />

        {endAdornment ? (
          <div className='pointer-events-none absolute inset-y-0 right-4 flex items-center'>
            <div className='pointer-events-auto'>{endAdornment}</div>
          </div>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
