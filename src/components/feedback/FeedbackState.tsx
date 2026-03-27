// src/components/feedback/FeedbackState.tsx

import { AlertCircle, Inbox, LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

type FeedbackStateVariant = 'loading' | 'empty' | 'error';

type FeedbackStateProps = Readonly<{
  variant: FeedbackStateVariant;
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}>;

const iconMap: Record<FeedbackStateVariant, React.ReactNode> = {
  loading: <LoaderCircle className='size-5 animate-spin' aria-hidden='true' />,
  empty: <Inbox className='size-5' aria-hidden='true' />,
  error: <AlertCircle className='size-5' aria-hidden='true' />,
};

const iconToneMap: Record<FeedbackStateVariant, string> = {
  loading: 'bg-muted text-muted-foreground',
  empty: 'bg-muted text-muted-foreground',
  error: 'bg-destructive/10 text-destructive',
};

const FeedbackState = ({
  variant,
  title,
  description,
  className,
  action,
}: FeedbackStateProps) => {
  return (
    <section
      data-slot='feedback-state'
      data-variant={variant}
      className={cn(
        'flex w-full flex-col items-center justify-center rounded-3xl border border-border bg-card px-6 py-10 text-center',
        className
      )}
    >
      <div
        className={cn(
          'mb-4 inline-flex size-11 items-center justify-center rounded-full',
          iconToneMap[variant]
        )}
      >
        {iconMap[variant]}
      </div>

      <div className='max-w-md'>
        <h2 className='text-base font-semibold text-card-foreground'>
          {title}
        </h2>

        {description ? (
          <p className='mt-2 text-sm leading-6 text-muted-foreground'>
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className='mt-5'>{action}</div> : null}
    </section>
  );
};

export { FeedbackState };
