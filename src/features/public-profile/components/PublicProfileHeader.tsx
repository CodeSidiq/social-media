// src/features/public-profile/components/PublicProfileHeader.tsx

import { Avatar } from '@/components/ui/avatar';
import PublicProfileStats from '@/features/public-profile/components/PublicProfileStats';
import type { PublicProfileViewModel } from '@/features/public-profile/types/public-profile.types';

type PublicProfileHeaderProps = Readonly<{
  profile: PublicProfileViewModel;
}>;

const PublicProfileHeader = ({ profile }: PublicProfileHeaderProps) => {
  const bioText = profile.bio.trim();

  return (
    <section className='space-y-6'>
      <div className='rounded-[1.75rem] border border-border bg-card p-5 shadow-sm md:p-8'>
        <div className='flex flex-col gap-5 md:flex-row md:items-start'>
          <Avatar
            src={profile.avatarUrl}
            alt={`${profile.name} avatar`}
            fallbackText={profile.name}
            size='xl'
          />

          <div className='space-y-3'>
            <div className='space-y-1'>
              <h1 className='text-2xl font-semibold tracking-tight text-card-foreground md:text-3xl'>
                {profile.name}
              </h1>
              <p className='text-sm text-muted-foreground md:text-base'>
                @{profile.username}
              </p>
            </div>

            <p className='max-w-2xl text-sm leading-7 text-card-foreground md:text-base md:leading-8'>
              {bioText || 'No bio yet.'}
            </p>
          </div>
        </div>
      </div>

      <PublicProfileStats stats={profile.stats} />
    </section>
  );
};

export default PublicProfileHeader;
