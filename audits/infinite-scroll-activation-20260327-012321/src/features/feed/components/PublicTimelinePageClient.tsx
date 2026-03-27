// src/features/feed/components/PublicTimelinePageClient.tsx
/**
 * Public feed client.
 * Reuses the feed presentation layer while blocking protected interactions.
 * Login-required feedback for restricted actions is handled here.
 */

'use client';

import { useState } from 'react';

import FeedStateCard from '@/components/feedback/FeedStateCard';
import FeedShell from '@/components/layout/FeedShell';
import AppBottomDock from '@/components/layout/AppBottomDock';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import Spinner from '@/components/ui/Spinner';
import PostFeedCard from '@/features/post/components/PostFeedCard';
import { useExplorePosts } from '@/features/post/hooks/useExplorePosts';

const INITIAL_PUBLIC_PAGE = 1;
const INITIAL_PUBLIC_LIMIT = 20;

type RestrictedActionType = 'likes-list' | 'like' | 'share' | 'comment';

type RestrictedActionDialogState = Readonly<{
  open: boolean;
  title: string;
  description: string;
}>;

const RESTRICTED_ACTION_MESSAGES: Record<
  RestrictedActionType,
  Omit<RestrictedActionDialogState, 'open'>
> = {
  'likes-list': {
    title: 'Login required',
    description: 'Please log in to see who liked this post.',
  },
  like: {
    title: 'Login required',
    description: 'Please log in to like this post.',
  },
  share: {
    title: 'Login required',
    description: 'Please log in to share this post.',
  },
  comment: {
    title: 'Login required',
    description: 'Please log in to comment on this post.',
  },
};

const PublicTimelinePageClient = () => {
  const [restrictedActionDialog, setRestrictedActionDialog] =
    useState<RestrictedActionDialogState>({
      open: false,
      title: '',
      description: '',
    });

  const publicPostsQuery = useExplorePosts({
    page: INITIAL_PUBLIC_PAGE,
    limit: INITIAL_PUBLIC_LIMIT,
  });

  const posts = publicPostsQuery.data?.previews ?? [];

  const handleRestrictedAction = (actionType: RestrictedActionType) => {
    const message = RESTRICTED_ACTION_MESSAGES[actionType];

    setRestrictedActionDialog({
      open: true,
      title: message.title,
      description: message.description,
    });
  };

  const renderContent = () => {
    if (publicPostsQuery.isLoading) {
      return (
        <section className='mx-auto w-full max-w-[42.75rem] px-4 py-2 sm:px-6 sm:py-4'>
          <Spinner />
        </section>
      );
    }

    if (publicPostsQuery.isError) {
      return (
        <section className='mx-auto w-full max-w-[42.75rem] px-4 sm:px-6'>
          <FeedStateCard
            title='Public Feed'
            description={
              publicPostsQuery.error.message ||
              'Terjadi kendala saat memuat postingan public.'
            }
            actionLabel='Coba lagi'
            onAction={() => {
              void publicPostsQuery.refetch();
            }}
          />
        </section>
      );
    }

    if (posts.length === 0) {
      return (
        <section className='mx-auto w-full max-w-[42.75rem] px-4 sm:px-6'>
          <FeedStateCard
            title='Public Feed'
            description='Belum ada postingan public yang bisa ditampilkan saat ini.'
          />
        </section>
      );
    }

    return (
      <section className='mx-auto w-full max-w-[42.75rem] px-4 sm:px-6'>
        <div className='space-y-5 sm:space-y-6'>
          {posts.map((post) => (
            <PostFeedCard
              key={post.id}
              post={post}
              onRestrictedAction={handleRestrictedAction}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <FeedShell accessVariant='public'>{renderContent()}</FeedShell>

      <AppBottomDock variant='public' />

      <Dialog
        open={restrictedActionDialog.open}
        onOpenChange={(open) => {
          setRestrictedActionDialog((currentState) => ({
            ...currentState,
            open,
          }));
        }}
      >
        <DialogContent className='w-[min(92vw,26rem)] rounded-[1.5rem] border border-border bg-card p-6'>
          <DialogTitle className='text-base font-semibold text-foreground'>
            {restrictedActionDialog.title}
          </DialogTitle>

          <DialogDescription className='mt-2 text-sm leading-6 text-muted-foreground'>
            {restrictedActionDialog.description}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PublicTimelinePageClient;
