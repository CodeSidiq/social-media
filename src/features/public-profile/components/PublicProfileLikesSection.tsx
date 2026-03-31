// src/features/public-profile/components/PublicProfileLikesSection.tsx

import PostFeedCard from '@/features/post/components/PostFeedCard';
import PublicProfileErrorState from '@/features/public-profile/components/PublicProfileErrorState';
import type { PostPreview } from '@/types/entities/post';

type PublicProfileLikesSectionProps = Readonly<{
  username: string;
  posts: PostPreview[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
}>;

const PublicProfileLikesSection = ({
  username,
  posts,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: PublicProfileLikesSectionProps) => {
  if (isError) {
    return (
      <PublicProfileErrorState
        title='Failed to load liked posts'
        message={
          errorMessage || 'Something went wrong while loading liked posts.'
        }
        onRetry={onRetry}
      />
    );
  }

  if (isLoading) {
    return (
      <section className='mt-8 space-y-6' aria-busy='true' aria-live='polite'>
        <div className='h-32 animate-pulse rounded-[2rem] border border-border bg-card' />
        <div className='h-32 animate-pulse rounded-[2rem] border border-border bg-card' />
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className='mt-8 rounded-[2rem] border border-border bg-card p-6 text-center sm:p-8'>
        <h2 className='text-base font-semibold text-foreground'>
          No liked posts yet
        </h2>

        <p className='mt-2 text-sm leading-6 text-muted-foreground'>
          @{username} does not have any public liked posts to show right now.
        </p>
      </section>
    );
  }

  return (
    <section className='mt-8 space-y-6'>
      {posts.map((post) => (
        <PostFeedCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default PublicProfileLikesSection;
