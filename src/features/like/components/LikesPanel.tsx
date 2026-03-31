// src/features/like/components/LikesPanel.tsx

import Spinner from '@/components/ui/Spinner';
import LikesUserList from '@/features/like/components/LikesUserList';
import type { LikeUserShellItem } from '@/features/like/types/like-shell.types';

type LikesPanelProps = Readonly<{
  users: readonly LikeUserShellItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  onFollowClick?: (user: LikeUserShellItem) => void;
  followLoadingUsername?: string | null;
  isFollowActionDisabled?: boolean;
  followActionError?: string | null;
}>;

const LikesPanel = ({
  users,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  hasNextPage = false,
  isLoadingMore = false,
  onLoadMore,
  onFollowClick,
  followLoadingUsername = null,
  isFollowActionDisabled = false,
  followActionError = null,
}: LikesPanelProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex min-h-[12rem] items-center justify-center'>
          <Spinner />
        </div>
      );
    }

    if (isError) {
      return (
        <div className='flex min-h-[12rem] flex-col items-center justify-center gap-4 text-center'>
          <p className='text-sm text-destructive'>
            {errorMessage || 'Something went wrong while loading likes.'}
          </p>

          {onRetry ? (
            <button
              type='button'
              onClick={onRetry}
              className='inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary'
            >
              Try again
            </button>
          ) : null}
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className='flex min-h-[12rem] items-center justify-center text-center'>
          <p className='text-sm text-muted-foreground'>No likes yet.</p>
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-4'>
        {followActionError ? (
          <p className='text-sm text-destructive'>{followActionError}</p>
        ) : null}

        <LikesUserList
          users={users}
          onFollowClick={onFollowClick}
          followLoadingUsername={followLoadingUsername}
          isFollowActionDisabled={isFollowActionDisabled}
        />

        {hasNextPage ? (
          <div className='flex justify-center pt-1'>
            <button
              type='button'
              onClick={onLoadMore}
              disabled={isLoadingMore || !onLoadMore}
              className='inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isLoadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section className='flex flex-col'>
      <header className='pb-4'>
        <h2 className='text-lg font-semibold leading-none text-foreground'>
          Likes
        </h2>
      </header>

      <div>{renderContent()}</div>
    </section>
  );
};

export default LikesPanel;
