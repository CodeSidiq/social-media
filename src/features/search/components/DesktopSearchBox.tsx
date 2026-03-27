// src/features/search/components/DesktopSearchBox.tsx

'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import SearchResultsPanel from '@/features/search/components/SearchResultsPanel';
import { useDebouncedValue } from '@/features/search/hooks/useDebouncedValue';
import { useSearchUsers } from '@/features/search/hooks/useSearchUsers';
import type { SearchUserItem } from '@/features/search/types/search.types';

const DESKTOP_MINIMUM_SEARCH_KEYWORD_LENGTH = 1;
const DESKTOP_MAX_DROPDOWN_RESULTS = 8;

const normalizeSearchText = (value: string): string => {
  return value.trim().toLowerCase();
};

const splitIntoSearchTokens = (value: string): string[] => {
  return normalizeSearchText(value)
    .split(/[\s._-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
};

const hasTokenInitialMatch = (value: string, normalizedKeyword: string): boolean => {
  const tokens = splitIntoSearchTokens(value);
  return tokens.some((token) => token.startsWith(normalizedKeyword));
};

const rankSearchUser = (
  user: SearchUserItem,
  normalizedKeyword: string
): number => {
  if (hasTokenInitialMatch(user.name, normalizedKeyword)) {
    return 0;
  }

  if (hasTokenInitialMatch(user.username, normalizedKeyword)) {
    return 1;
  }

  return 99;
};

const DesktopSearchBox = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const debouncedKeyword = useDebouncedValue(keyword, 300);
  const normalizedKeyword = keyword.trim();

  const searchQuery = useSearchUsers({
    keyword: debouncedKeyword,
    page: 1,
    limit: 20,
  });

  const rankedUsers = useMemo(() => {
    const normalizedDebouncedKeyword = normalizeSearchText(debouncedKeyword);

    if (!normalizedDebouncedKeyword) {
      return [];
    }

    return (searchQuery.data?.users ?? [])
      .map((user) => ({
        user,
        rank: rankSearchUser(user, normalizedDebouncedKeyword),
      }))
      .filter((entry) => entry.rank < 99)
      .sort((left, right) => {
        if (left.rank !== right.rank) {
          return left.rank - right.rank;
        }

        return left.user.name.localeCompare(right.user.name);
      })
      .slice(0, DESKTOP_MAX_DROPDOWN_RESULTS)
      .map((entry) => entry.user);
  }, [debouncedKeyword, searchQuery.data?.users]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const shouldShowDropdown = isOpen && normalizedKeyword.length > 0;

  return (
    <div ref={containerRef} className='relative w-full max-w-[32rem]'>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
        role='search'
        className='relative'
      >
        <Search
          className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
          strokeWidth={2.2}
          aria-hidden='true'
        />

        <input
          ref={inputRef}
          type='text'
          value={keyword}
          onFocus={() => {
            if (normalizedKeyword.length > 0) {
              setIsOpen(true);
            }
          }}
          onChange={(event) => {
            const nextKeyword = event.target.value;
            setKeyword(nextKeyword);
            setIsOpen(nextKeyword.trim().length > 0);
          }}
          placeholder='Search'
          aria-label='Search users'
          className={[
            'h-11 w-full rounded-full border border-border',
            'bg-card text-foreground',
            'pl-11 pr-4',
            'text-sm outline-none transition-colors',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
          ].join(' ')}
        />
      </form>

      {shouldShowDropdown ? (
        <div className='absolute left-0 right-0 top-[calc(100%+0.75rem)] z-[80]'>
          <SearchResultsPanel
            keyword={keyword}
            users={rankedUsers}
            isLoading={searchQuery.isLoading || searchQuery.isFetching}
            isError={searchQuery.isError}
            errorMessage={searchQuery.error?.message}
            minimumKeywordLength={DESKTOP_MINIMUM_SEARCH_KEYWORD_LENGTH}
            idleMessage=''
            emptyMessage={`No users found for initial "${normalizedKeyword}".`}
            onSelectItem={() => {
              setIsOpen(false);
              setKeyword('');
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DesktopSearchBox;
