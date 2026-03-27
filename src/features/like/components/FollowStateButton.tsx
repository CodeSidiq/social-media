// src/features/like/components/FollowStateButton.tsx

'use client';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FollowStateButtonProps = Readonly<{
  isFollowing: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}>;

const FollowStateButton = ({
  isFollowing,
  className,
  onClick,
  disabled = false,
  isLoading = false,
}: FollowStateButtonProps) => {
  if (isFollowing) {
    return (
      <Button
        type='button'
        variant='outline'
        size='lg'
        onClick={onClick}
        disabled={disabled || isLoading}
        className={cn(
          'min-w-32 border-border bg-transparent px-4 text-sm font-semibold text-foreground hover:bg-muted',
          className
        )}
        aria-label='Following'
      >
        <Check className='size-4' aria-hidden='true' />
        <span>{isLoading ? 'Loading...' : 'Following'}</span>
      </Button>
    );
  }

  return (
    <Button
      type='button'
      size='lg'
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'min-w-28 px-5 text-sm font-semibold shadow-[0_10px_30px_rgba(127,81,249,0.26)]',
        className
      )}
      aria-label='Follow'
    >
      <span>{isLoading ? 'Loading...' : 'Follow'}</span>
    </Button>
  );
};

export default FollowStateButton;
