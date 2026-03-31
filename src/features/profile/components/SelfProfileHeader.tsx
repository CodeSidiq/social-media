// src/features/profile/components/SelfProfileHeader.tsx

import { Avatar } from '@/components/ui/avatar';
import EditProfileCta from '@/features/profile/components/EditProfileCta';
import SelfProfileStats from '@/features/profile/components/SelfProfileStats';
import type { MyProfileViewModel } from '@/features/profile/types/profile.types';

type SelfProfileHeaderProps = Readonly<{
  profile: MyProfileViewModel;
}>;

const SelfProfileHeader = ({ profile }: SelfProfileHeaderProps) => {
  const bioText = profile.bio.trim();

  return (
    <section className='space-y-6'>
      <div className='rounded-[1.75rem] border border-border bg-card p-5 shadow-sm md:p-8'>
        <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
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

          <div className='flex items-center gap-3 md:shrink-0'>
            <div className='flex-1 md:flex-none'>
              <EditProfileCta />
            </div>
            <div className='md:hidden'>
              <EditProfileCta compact />
            </div>
          </div>
        </div>
      </div>

      <SelfProfileStats stats={profile.stats} />
    </section>
  );
};

export default SelfProfileHeader;
