// src/features/post/components/ExplorePostList.tsx
/**
 * Explore feed list.
 * Uses the shared post card with the explore data source.
 * Explore-specific orchestration should remain isolated in this file.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';

import FeedStateCard from '@/components/feedback/FeedStateCard';
import Spinner from '@/components/ui/Spinner';
import { Dialog } from '@/components/ui/dialog';
import CommentSurfaceShell from '@/features/comment/components/CommentSurfaceShell';
import { mockComments } from '@/features/comment/mocks/mockComments';
import LikesModalShell from '@/features/like/components/LikesModalShell';
import { mockLikeUsers } from '@/features/like/mocks/mockLikeUsers';
import PostFeedCard from '@/features/post/components/PostFeedCard';
import { useInfiniteExplorePosts } from '@/features/post/hooks/useInfiniteExplorePosts';
import { useInfiniteScrollSentinel } from '@/hooks/useInfiniteScrollSentinel';

const INITIAL_EXPLORE_LIMIT = 2;

type LikesModalState = Readonly<{
  isOpen: boolean;
  postId: number | null;
}>;

type CommentModalState = Readonly<{
  isOpen: boolean;
  postId: number | null;
}>;

const ExplorePostList = () => {
  const [likesModal, setLikesModal] = useState<LikesModalState>({
    isOpen: false,
    postId: null,
  });
  const [commentModal, setCommentModal] = useState<CommentModalState>({
    isOpen: false,
    postId: null,
  });

  const exploreQuery = useInfiniteExplorePosts({
    limit: INITIAL_EXPLORE_LIMIT,
  });

  const previews = useMemo(() => {
    return exploreQuery.data?.pages.flatMap((page) => page.previews) ?? [];
  }, [exploreQuery.data]);

  const currentExplorePosts = previews;

  const selectedLikesPost =
    likesModal.postId === null
      ? null
      : previews.find((post) => post.id === likesModal.postId) ?? null;

  const selectedCommentPost =
    commentModal.postId === null
      ? null
      : currentExplorePosts.find((post) => post.id === commentModal.postId) ?? null;

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

  const handleLoadMore = useCallback(() => {
    if (!exploreQuery.hasNextPage || exploreQuery.isFetchingNextPage) {
      return;
    }

    void exploreQuery.fetchNextPage();
  }, [exploreQuery]);

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: Boolean(
      exploreQuery.hasNextPage &&
        !exploreQuery.isFetchingNextPage &&
        !(exploreQuery.isError && previews.length > 0)
    ),
    onIntersect: handleLoadMore,
  });

  const renderBottomStatus = () => {
    if (exploreQuery.isError && previews.length > 0) {
      return (
        <div className='py-6 text-center text-sm text-destructive'>
          Failed to load more posts.
        </div>
      );
    }

    if (exploreQuery.isFetchingNextPage) {
      return <Spinner className='py-6' />;
    }

    if (exploreQuery.hasNextPage) {
      return <div ref={sentinelRef} className='h-4 w-full' aria-hidden='true' />;
    }

    return (
      <p className='py-6 text-center text-sm text-muted-foreground'>
        No more posts to load.
      </p>
    );
  };

  if (exploreQuery.isLoading && previews.length === 0) {
    return (
      <section className='mx-auto w-full max-w-[42.75rem] px-4 py-2 sm:px-6 sm:py-4'>
        <Spinner />
      </section>
    );
  }

  if (exploreQuery.isError && previews.length === 0) {
    return (
      <section className='mx-auto w-full max-w-[42.75rem] px-4 sm:px-6'>
        <FeedStateCard
          title='Explore'
          description='Terjadi kendala saat mengambil data explore post. Silakan coba lagi.'
          actionLabel='Coba lagi'
          onAction={() => {
            void exploreQuery.refetch();
          }}
        />
      </section>
    );
  }

  if (previews.length === 0) {
    return (
      <section className='mx-auto w-full max-w-[42.75rem] px-4 sm:px-6'>
        <FeedStateCard
          title='Explore'
          description='Belum ada postingan public yang tersedia saat ini.'
        />
      </section>
    );
  }

  return (
    <section className='mx-auto w-full max-w-[42.75rem] px-4 sm:px-6'>
      <div className='space-y-5 sm:space-y-6'>
        {previews.map((post) => (
          <PostFeedCard
            key={post.id}
            post={post}
            onOpenLikes={handleOpenLikes}
            onOpenComments={handleOpenComments}
          />
        ))}
      </div>

      {renderBottomStatus()}

      {selectedLikesPost ? (
        <LikesModalShell
          open={likesModal.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseLikes();
            }
          }}
          post={selectedLikesPost}
          users={mockLikeUsers}
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
            dataMode='runtime'
            variant={mockComments.length === 0 ? 'empty' : 'filled'}
            comments={mockComments}
          />
        </Dialog>
      ) : null}
    </section>
  );
};

export default ExplorePostList;
