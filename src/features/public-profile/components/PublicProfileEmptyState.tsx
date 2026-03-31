// src/features/public-profile/components/PublicProfileEmptyState.tsx

type PublicProfileEmptyStateProps = Readonly<{
  username: string;
}>;

const PublicProfileEmptyState = ({ username }: PublicProfileEmptyStateProps) => {
  return (
    <section className='rounded-[1.75rem] border border-dashed border-border bg-card p-6 text-center md:p-8'>
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold text-card-foreground'>
          No posts yet
        </h2>
        <p className='text-sm leading-7 text-muted-foreground'>
          @{username} has not published any public posts yet.
        </p>
      </div>
    </section>
  );
};

export default PublicProfileEmptyState;
