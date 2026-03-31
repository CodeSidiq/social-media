// src/features/public-profile/components/PublicProfilePostsSection.tsx

import PostFeedCard from '@/features/post/components/PostFeedCard';
import PublicProfileEmptyState from '@/features/public-profile/components/PublicProfileEmptyState';
import PublicProfileErrorState from '@/features/public-profile/components/PublicProfileErrorState';
import type { PostPreview } from '@/types/entities/post';

type PublicProfilePostsSectionProps = Readonly<{
  username: string;
  posts: PostPreview[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}>;

const PostsLoadingShell = () => {
  return (
    <div className='space-y-5 sm:space-y-6'>
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={`public-profile-posts-skeleton-${index + 1}`}
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
          </div>

          <div className='mt-6 h-px w-full bg-border/80' />
        </article>
      ))}
    </div>
  );
};

const PublicProfilePostsSection = ({
  username,
  posts,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: PublicProfilePostsSectionProps) => {
  if (isLoading) {
    return <PostsLoadingShell />;
  }

  if (isError) {
    return (
      <PublicProfileErrorState
        title='Failed to load public posts'
        message={
          errorMessage || 'Something went wrong while loading public posts.'
        }
        onRetry={onRetry}
      />
    );
  }

  if (posts.length === 0) {
    return <PublicProfileEmptyState username={username} />;
  }

  return (
    <div className='space-y-5 sm:space-y-6'>
      {posts.map((post) => (
        <PostFeedCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PublicProfilePostsSection;
