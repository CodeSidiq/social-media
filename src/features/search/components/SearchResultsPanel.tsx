// src/features/search/components/SearchResultsPanel.tsx

import { FeedbackState } from '@/components/feedback/FeedbackState';
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

  const feedbackClassName =
    'rounded-3xl border border-border bg-card p-0 shadow-lg';

  if (normalizedKeyword.length === 0) {
    return (
      <FeedbackState
        variant='empty'
        title='Search users'
        description={idleMessage}
        className={cn(feedbackClassName, className)}
      />
    );
  }

  if (normalizedKeyword.length < minimumKeywordLength) {
    return (
      <FeedbackState
        variant='empty'
        title='Keep typing'
        description={`Type at least ${minimumKeywordLength} character${
          minimumKeywordLength > 1 ? 's' : ''
        }.`}
        className={cn(feedbackClassName, className)}
      />
    );
  }

  if (isLoading) {
    return (
      <FeedbackState
        variant='loading'
        title='Searching users'
        description='Please wait while we look for matching users.'
        className={cn(feedbackClassName, className)}
      />
    );
  }

  if (isError) {
    return (
      <FeedbackState
        variant='error'
        title='Failed to search users'
        description={errorMessage || 'Something went wrong while searching users.'}
        className={cn(feedbackClassName, className)}
      />
    );
  }

  if (users.length === 0) {
    return (
      <FeedbackState
        variant='empty'
        title='No users found'
        description={emptyMessage}
        className={cn(feedbackClassName, className)}
      />
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
