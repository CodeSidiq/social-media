// src/features/search/components/SearchResultsPanel.tsx

import { cn } from '@/lib/utils';
import SearchResultItem from '@/features/search/components/SearchResultItem';
import type { SearchUserItem } from '@/features/search/types/search.types';

type SearchResultsPanelProps = Readonly<{
  keyword: string;
  users: SearchUserItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onSelectItem?: () => void;
  emptyMessage?: string;
  idleMessage?: string;
  minimumKeywordLength?: number;
  className?: string;
}>;

const DEFAULT_MINIMUM_SEARCH_KEYWORD_LENGTH = 2;

const SearchResultsPanel = ({
  keyword,
  users,
  isLoading,
  isError,
  errorMessage,
  onSelectItem,
  emptyMessage = 'User not found.',
  idleMessage = 'Type a name or username to search.',
  minimumKeywordLength = DEFAULT_MINIMUM_SEARCH_KEYWORD_LENGTH,
  className,
}: SearchResultsPanelProps) => {
  const normalizedKeyword = keyword.trim();

  if (normalizedKeyword.length === 0) {
    return (
      <div
        className={cn(
          'rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-lg',
          className
        )}
      >
        {idleMessage}
      </div>
    );
  }

  if (normalizedKeyword.length < minimumKeywordLength) {
    return (
      <div
        className={cn(
          'rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-lg',
          className
        )}
      >
        {`Type at least ${minimumKeywordLength} character${minimumKeywordLength > 1 ? 's' : ''}.`}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-lg',
          className
        )}
      >
        Searching users...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          'rounded-3xl border border-destructive/30 bg-card p-4 text-sm text-destructive shadow-lg',
          className
        )}
      >
        {errorMessage || 'Failed to search users.'}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div
        className={cn(
          'rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-lg',
          className
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-3xl border border-border bg-card shadow-lg',
        className
      )}
    >
      <ul className='divide-y divide-border'>
        {users.map((user) => (
          <li key={user.id}>
            <SearchResultItem user={user} onSelect={onSelectItem} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsPanel;
