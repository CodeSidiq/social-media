// src/features/post/components/ExplorePostList.tsx

'use client';

import { useState } from 'react';

import { Dialog } from '@/components/ui/dialog';
import FeedStateCard from '@/components/feedback/FeedStateCard';
import Spinner from '@/components/ui/Spinner';
import CommentSurfaceShell from '@/features/comment/components/CommentSurfaceShell';
import { mockComments } from '@/features/comment/mocks/mockComments';
import LikesModalShell from '@/features/like/components/LikesModalShell';
import { mockLikeUsers } from '@/features/like/mocks/mockLikeUsers';
import PostFeedCard from '@/features/post/components/PostFeedCard';
import { useExplorePosts } from '@/features/post/hooks/useExplorePosts';

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

  const exploreQuery = useExplorePosts();

  const previews = exploreQuery.data?.previews ?? [];

  const selectedLikesPost =
    likesModal.postId === null
      ? null
      : previews.find((post) => post.id === likesModal.postId) ?? null;

  const selectedCommentPost =
    commentModal.postId === null
      ? null
      : previews.find((post) => post.id === commentModal.postId) ?? null;

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

  if (exploreQuery.isLoading) {
    return (
      <section className='mx-auto w-full max-w-[42.75rem] px-4 py-2 sm:px-6 sm:py-4'>
        <Spinner />
      </section>
    );
  }

  if (exploreQuery.isError) {
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
            variant={mockComments.length === 0 ? 'empty' : 'filled'}
            comments={mockComments}
          />
        </Dialog>
      ) : null}
    </section>
  );
};

export default ExplorePostList;
