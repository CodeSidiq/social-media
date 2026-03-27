// src/features/feed/components/TimelineFeedPageClient.tsx
/**
 * Authenticated feed client.
 * Handles timeline data, protected interactions, and feed-level modal state.
 * Global shell responsibilities must stay outside this file.
 */

'use client';

import { generateDummyLikes } from '@/features/like/mocks/generateDummyLikes';

import { useEffect, useState } from 'react';

import FeedStateCard from '@/components/feedback/FeedStateCard';
import { Dialog } from '@/components/ui/dialog';
import ToastMessage from '@/components/ui/ToastMessage';
import CommentSurfaceShell from '@/features/comment/components/CommentSurfaceShell';
import { mockComments } from '@/features/comment/mocks/mockComments';
import { useFeed } from '@/features/feed/hooks/useFeed';
import LikesModalShell from '@/features/like/components/LikesModalShell';
import PostFeedCard from '@/features/post/components/PostFeedCard';

const INITIAL_FEED_PAGE = 1;
const INITIAL_FEED_LIMIT = 20;
const POST_SUCCESS_TOAST_STORAGE_KEY = 'social-media-post-success-toast';
const TOAST_AUTO_DISMISS_DURATION = 5000;

type TimelineToastPayload = Readonly<{
  message: string;
  variant: 'success';
}>;

type LikesModalState = Readonly<{
  isOpen: boolean;
  postId: number | null;
}>;

type CommentModalState = Readonly<{
  isOpen: boolean;
  postId: number | null;
}>;

const readTimelineSuccessToast = (): TimelineToastPayload | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawToastPayload = window.sessionStorage.getItem(
    POST_SUCCESS_TOAST_STORAGE_KEY
  );

  if (!rawToastPayload) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(rawToastPayload) as Partial<{
      message: unknown;
      variant: unknown;
      type: unknown;
    }>;

    window.sessionStorage.removeItem(POST_SUCCESS_TOAST_STORAGE_KEY);

    if (typeof parsedPayload.message !== 'string') {
      return null;
    }

    const normalizedVariant =
      parsedPayload.variant === 'success' || parsedPayload.type === 'success'
        ? 'success'
        : null;

    if (!normalizedVariant) {
      return null;
    }

    return {
      message: parsedPayload.message,
      variant: normalizedVariant,
    };
  } catch {
    window.sessionStorage.removeItem(POST_SUCCESS_TOAST_STORAGE_KEY);
    return null;
  }
};

const TimelineFeedSkeleton = () => {
  return (
    <section className='mx-auto w-full max-w-[42.75rem] px-4 py-2 sm:px-6 sm:py-4'>
      <div className='space-y-5 sm:space-y-6'>
        {Array.from({ length: 3 }).map((_, index) => (
          <article
            key={`timeline-skeleton-${index}`}
            className='mx-auto w-full max-w-[42.75rem]'
            aria-hidden='true'
          >
            <div className='flex items-start gap-3'>
              <div className='h-11 w-11 rounded-full bg-muted' />

              <div className='flex-1 space-y-2'>
                <div className='h-4 w-32 rounded bg-muted' />
                <div className='h-3 w-24 rounded bg-muted' />
              </div>
            </div>

            <div className='mt-4 aspect-square w-full rounded-[1rem] bg-muted' />

            <div className='mt-4 flex items-center justify-between'>
              <div className='flex items-center gap-5 sm:gap-6'>
                <div className='h-5 w-14 rounded bg-muted' />
                <div className='h-5 w-14 rounded bg-muted' />
                <div className='h-5 w-14 rounded bg-muted' />
              </div>

              <div className='h-5 w-5 rounded bg-muted' />
            </div>

            <div className='mt-4 space-y-2.5'>
              <div className='h-4 w-40 rounded bg-muted' />
              <div className='h-4 w-full rounded bg-muted' />
              <div className='h-4 w-3/4 rounded bg-muted' />
            </div>

            <div className='mt-6 h-px w-full bg-border/80' />
          </article>
        ))}
      </div>
    </section>
  );
};

const TimelineFeedPageClient = () => {
  const [successToast, setSuccessToast] = useState<TimelineToastPayload | null>(
    () => readTimelineSuccessToast()
  );
  const [likesModal, setLikesModal] = useState<LikesModalState>({
    isOpen: false,
    postId: null,
  });
  const [commentModal, setCommentModal] = useState<CommentModalState>({
    isOpen: false,
    postId: null,
  });

  const feedQuery = useFeed({
    page: INITIAL_FEED_PAGE,
    limit: INITIAL_FEED_LIMIT,
  });

  useEffect(() => {
    if (!successToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessToast(null);
    }, TOAST_AUTO_DISMISS_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [successToast]);

  const handleDismissToast = () => {
    setSuccessToast(null);
  };

  const handleOpenLikes = (postId: number) => {
    setLikesModal({
      isOpen: true,
      postId,
    });
  };

  const handleCloseLikes = () => {
    setLikesModal({
      isOpen: false,
      postId: null,
    });
  };

  const handleOpenComments = (postId: number) => {
    setCommentModal({
      isOpen: true,
      postId,
    });
  };

  const handleCloseComments = () => {
    setCommentModal({
      isOpen: false,
      postId: null,
    });
  };

  const items = feedQuery.data?.items ?? [];

  const selectedLikesPost =
    likesModal.postId === null
      ? null
      : items.find((post) => post.id === likesModal.postId) ?? null;

  const selectedCommentPost =
    commentModal.postId === null
      ? null
      : items.find((post) => post.id === commentModal.postId) ?? null;

  const renderContent = () => {
    if (feedQuery.isLoading) {
      return <TimelineFeedSkeleton />;
    }

    if (feedQuery.isError) {
      return (
        <section className='mx-auto w-full max-w-[42.75rem] px-4 sm:px-6'>
          <FeedStateCard
            title='Timeline'
            description={
              feedQuery.error.message ||
              'Terjadi kendala saat memuat authenticated feed.'
            }
            actionLabel='Coba lagi'
            onAction={() => {
              void feedQuery.refetch();
            }}
          />
        </section>
      );
    }

    if (items.length === 0) {
      return (
        <section className='mx-auto w-full max-w-[42.75rem] px-4 sm:px-6'>
          <FeedStateCard
            title='Timeline'
            description='Feed kamu masih kosong saat ini.'
          />
        </section>
      );
    }

    return (
      <section className='mx-auto w-full max-w-[42.75rem] px-4 sm:px-6'>
        <div className='space-y-5 sm:space-y-6'>
          {items.map((post) => (
            <PostFeedCard
              key={post.id}
              post={post}
              onOpenLikes={handleOpenLikes}
              onOpenComments={handleOpenComments}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className='relative'>
      {successToast ? (
        <div className='pointer-events-none absolute left-4 right-4 top-2 z-50 flex justify-center sm:left-auto sm:right-6 sm:justify-end lg:right-24'>
          <ToastMessage
            message={successToast.message}
            variant={successToast.variant}
            onClose={handleDismissToast}
            className='pointer-events-auto'
          />
        </div>
      ) : null}

      {renderContent()}

      {selectedLikesPost ? (
        <LikesModalShell
          open={likesModal.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseLikes();
            }
          }}
          post={selectedLikesPost}
          users={generateDummyLikes(50)}
        />
      ) : null}

      {selectedCommentPost ? (
        <Dialog
          open={commentModal.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseComments();
            }
          }}
        >
          <CommentSurfaceShell
            post={selectedCommentPost}
            variant={mockComments.length === 0 ? 'empty' : 'filled'}
            comments={mockComments}
          />
        </Dialog>
      ) : null}
    </div>
  );
};

export default TimelineFeedPageClient;
