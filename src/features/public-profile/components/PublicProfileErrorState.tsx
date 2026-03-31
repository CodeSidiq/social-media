// src/features/public-profile/components/PublicProfileErrorState.tsx

import { RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

type PublicProfileErrorStateProps = Readonly<{
  title: string;
  message: string;
  onRetry?: () => void;
}>;

const PublicProfileErrorState = ({
  title,
  message,
  onRetry,
}: PublicProfileErrorStateProps) => {
  return (
    <section className='rounded-[1.75rem] border border-border bg-card p-6 md:p-8'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <h1 className='text-xl font-semibold text-card-foreground'>{title}</h1>
          <p className='text-sm leading-7 text-muted-foreground'>{message}</p>
        </div>

        {onRetry ? (
          <Button
            type='button'
            variant='outline'
            onClick={onRetry}
            className='inline-flex items-center gap-2'
          >
            <RefreshCcw className='size-4' aria-hidden='true' />
            <span>Try again</span>
          </Button>
        ) : null}
      </div>
    </section>
  );
};

export default PublicProfileErrorState;
