// src/features/search/components/SearchResultItem.tsx

import Image from 'next/image';
import Link from 'next/link';

import type { SearchUserItem } from '@/features/search/types/search.types';

type SearchResultItemProps = Readonly<{
  user: SearchUserItem;
  onSelect?: () => void;
}>;

const getInitials = (name: string): string => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'U';
  }

  const segments = trimmedName.split(/\s+/).slice(0, 2);

  return segments.map((segment) => segment.charAt(0).toUpperCase()).join('');
};

const SearchResultItem = ({ user, onSelect }: SearchResultItemProps) => {
  return (
    <Link
      href={`/users/${user.username}`}
      onClick={onSelect}
      className='flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      {user.avatarUrl ? (
        <div className='relative h-11 w-11 overflow-hidden rounded-full border border-border'>
          <Image
            src={user.avatarUrl}
            alt={`${user.name} avatar`}
            fill
            sizes='44px'
            className='object-cover'
          />
        </div>
      ) : (
        <div className='flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground'>
          {getInitials(user.name)}
        </div>
      )}

      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold text-foreground'>
          {user.name}
        </p>
        <p className='truncate text-sm text-muted-foreground'>
          @{user.username}
        </p>
      </div>
    </Link>
  );
};

export default SearchResultItem;
