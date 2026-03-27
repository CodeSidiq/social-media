// src/components/ui/textarea.tsx

import * as React from 'react';

import { cn } from '@/lib/utils';

type TextareaProps = React.ComponentProps<'textarea'> & {
  hasError?: boolean;
  wrapperClassName?: string;
  resize?: 'none' | 'vertical' | 'both';
};

const resizeClasses: Record<NonNullable<TextareaProps['resize']>, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  both: 'resize',
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      hasError = false,
      wrapperClassName,
      resize = 'vertical',
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative w-full', wrapperClassName)}>
        <textarea
          ref={ref}
          rows={rows}
          data-slot='textarea'
          aria-invalid={hasError}
          className={cn(
            'flex min-h-28 w-full rounded-2xl border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors',
            'border-border',
            'placeholder:text-muted-foreground/70',
            'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            resizeClasses[resize],
            hasError &&
              'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
