// src/features/profile/components/SelfProfileTabs.tsx

import type { ProfileTabKey } from '@/features/profile/types/profile.types';

import ProfileTabButton from '@/features/profile/components/ProfileTabButton';

type SelfProfileTabsProps = Readonly<{
  activeTab: ProfileTabKey;
  onTabChange: (tab: ProfileTabKey) => void;
}>;

const SelfProfileTabs = ({
  activeTab,
  onTabChange,
}: SelfProfileTabsProps) => {
  return (
    <div className='border-b border-border'>
      <div className='flex items-center gap-6'>
        <ProfileTabButton
          isActive={activeTab === 'gallery'}
          onClick={() => onTabChange('gallery')}
        >
          Gallery
        </ProfileTabButton>

        <ProfileTabButton
          isActive={activeTab === 'saved'}
          onClick={() => onTabChange('saved')}
        >
          Saved
        </ProfileTabButton>
      </div>
    </div>
  );
};

export default SelfProfileTabs;
