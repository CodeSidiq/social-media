// src/components/feedback/FeedStateCard.tsx

import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

type FeedStateCardProps = Readonly<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}>;

const FeedStateCard = ({
  title,
  description,
  actionLabel,
  onAction,
}: FeedStateCardProps) => {
  return (
    <section className='mx-auto w-full max-w-[42.75rem] py-2 sm:py-4'>
      <div className='px-1 py-6 sm:px-0 sm:py-8'>
        <div className='flex items-start gap-3'>
          <div className='mt-1 inline-flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <AlertCircle className='size-4' aria-hidden='true' />
          </div>

          <div className='flex-1'>
            <h2 className='text-base font-semibold text-foreground'>
              {title}
            </h2>

            <p className='mt-2 max-w-[32rem] text-sm leading-6 text-muted-foreground'>
              {description}
            </p>

            {actionLabel && onAction ? (
              <Button
                type='button'
                variant='outline'
                onClick={onAction}
                className='mt-5 h-10 px-5'
              >
                {actionLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedStateCard;
