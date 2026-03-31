// src/features/profile/components/ProfileTabButton.tsx

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ProfileTabButtonProps = Readonly<{
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}>;

const ProfileTabButton = ({
  isActive,
  onClick,
  children,
}: ProfileTabButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'relative inline-flex h-12 items-center justify-center px-2 text-sm font-medium transition-colors',
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      )}
      aria-pressed={isActive}
    >
      <span>{children}</span>
      <span
        className={cn(
          'absolute inset-x-0 bottom-0 h-0.5 rounded-full transition-opacity',
          isActive ? 'bg-primary opacity-100' : 'bg-transparent opacity-0'
        )}
        aria-hidden='true'
      />
    </button>
  );
};

export default ProfileTabButton;
