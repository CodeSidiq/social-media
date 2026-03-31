// src/features/profile/components/MyProfileGallerySection.tsx

import { RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import MyProfileEmptyState from '@/features/profile/components/MyProfileEmptyState';
import MyProfileGalleryGrid from '@/features/profile/components/MyProfileGalleryGrid';
import { useMyPosts } from '@/features/profile/hooks/useMyPosts';

type MyProfileGallerySectionProps = Readonly<{
  token: string | null | undefined;
}>;

const GalleryLoadingSkeleton = () => {
  return (
    <section
      aria-label='Loading gallery'
      className='grid grid-cols-3 gap-3 md:gap-4'
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={`gallery-skeleton-${index + 1}`}
          className='aspect-square animate-pulse rounded-2xl border border-border bg-muted/60'
          aria-hidden='true'
        />
      ))}
    </section>
  );
};

const GalleryErrorState = ({
  message,
  onRetry,
}: Readonly<{
  message: string;
  onRetry: () => void;
}>) => {
  return (
    <section className='rounded-[1.75rem] border border-border bg-card p-6 md:p-8'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-lg font-semibold text-card-foreground md:text-xl'>
            Failed to load your posts
          </h2>
          <p className='text-sm leading-7 text-muted-foreground'>{message}</p>
        </div>

        <Button
          type='button'
          variant='outline'
          onClick={onRetry}
          className='inline-flex items-center gap-2'
        >
          <RefreshCcw className='size-4' aria-hidden='true' />
          <span>Try again</span>
        </Button>
      </div>
    </section>
  );
};

const MyProfileGallerySection = ({
  token,
}: MyProfileGallerySectionProps) => {
  const { data, isLoading, isError, error, refetch } = useMyPosts({
    token,
    page: 1,
    limit: 20,
  });

  if (isLoading) {
    return <GalleryLoadingSkeleton />;
  }

  if (isError || !data) {
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong while loading your posts.';

    return (
      <GalleryErrorState
        message={message}
        onRetry={() => void refetch()}
      />
    );
  }

  if (data.posts.length === 0) {
    return <MyProfileEmptyState />;
  }

  return <MyProfileGalleryGrid posts={data.posts} />;
};

export default MyProfileGallerySection;
