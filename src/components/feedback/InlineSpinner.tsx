// src/components/feedback/InlineSpinner.tsx

import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

type InlineSpinnerProps = Readonly<{
  label?: string;
  className?: string;
}>;

const InlineSpinner = ({
  label = 'Loading...',
  className,
}: InlineSpinnerProps) => {
  return (
    <div
      data-slot='inline-spinner'
      className={cn(
        'inline-flex items-center gap-2 text-sm text-muted-foreground',
        className
      )}
      role='status'
      aria-live='polite'
    >
      <LoaderCircle className='size-4 animate-spin' aria-hidden='true' />
      <span>{label}</span>
    </div>
  );
};

export { InlineSpinner };
