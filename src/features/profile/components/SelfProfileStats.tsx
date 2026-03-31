// src/features/profile/components/SelfProfileStats.tsx

import type { MyProfileStats } from '@/features/profile/types/profile.types';

type SelfProfileStatsProps = Readonly<{
  stats: MyProfileStats;
}>;

const formatStatValue = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

const SelfProfileStats = ({ stats }: SelfProfileStatsProps) => {
  const items = [
    { label: 'Post', value: stats.postsCount },
    { label: 'Followers', value: stats.followersCount },
    { label: 'Following', value: stats.followingCount },
    { label: 'Likes', value: stats.likesCount },
  ] as const;

  return (
    <section
      aria-label='Profile statistics'
      className='grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-4'
    >
      {items.map((item, index) => (
        <div
          key={item.label}
          className={[
            'flex min-h-24 flex-col items-center justify-center gap-2 px-4 py-5 text-center',
            index !== items.length - 1 ? 'md:border-r md:border-border' : '',
            index < 2 ? 'border-b border-border md:border-b-0' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className='text-2xl font-semibold leading-none text-card-foreground'>
            {formatStatValue(item.value)}
          </span>
          <span className='text-sm text-muted-foreground'>{item.label}</span>
        </div>
      ))}
    </section>
  );
};

export default SelfProfileStats;
