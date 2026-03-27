// src/features/search/components/SearchPageClient.tsx

'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import SearchResultsPanel from '@/features/search/components/SearchResultsPanel';
import { useDebouncedValue } from '@/features/search/hooks/useDebouncedValue';
import { useSearchUsers } from '@/features/search/hooks/useSearchUsers';

const MINIMUM_SEARCH_KEYWORD_LENGTH = 2;
const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

const SearchPageClient = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = useMemo(
    () => searchParams.get('q') ?? '',
    [searchParams]
  );

  const [keyword, setKeyword] = useState(initialQuery);

  const debouncedKeyword = useDebouncedValue(keyword, 300);
  const normalizedKeyword = keyword.trim();

  const isKeywordReady =
    normalizedKeyword.length >= MINIMUM_SEARCH_KEYWORD_LENGTH;

  const searchQuery = useSearchUsers({
    keyword: debouncedKeyword,
    page: 1,
    limit: 20,
  });

  const users = searchQuery.data?.users ?? [];

  // 🔥 penting: track apakah sebelumnya mobile
  const wasMobileRef = useRef<boolean | null>(null);

  useEffect(() => {
    setKeyword(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const nextQuery = debouncedKeyword.trim();

    if (nextQuery.length === 0) {
      router.replace(pathname);
      return;
    }

    router.replace(`/search?q=${encodeURIComponent(nextQuery)}`);
  }, [debouncedKeyword, pathname, router]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const isDesktop = mediaQuery.matches;

    if (wasMobileRef.current === null) {
      // first mount
      wasMobileRef.current = !isDesktop;
      return;
    }

    const handleChange = (event: MediaQueryListEvent) => {
      const nowDesktop = event.matches;

      // 🔥 hanya redirect jika:
      // sebelumnya mobile → sekarang desktop
      if (wasMobileRef.current === true && nowDesktop) {
        router.replace('/timeline');
      }

      wasMobileRef.current = !nowDesktop;
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [router]);

  return (
    <section className='mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8'>
      <div className='space-y-2'>
        <h1 className='text-xl font-semibold text-foreground'>
          Search users
        </h1>
        <p className='text-sm text-muted-foreground'>
          Search by name or username. No, we are not searching posts here.
        </p>
      </div>

      <div className='relative'>
        <Search
          className='pointer-events-none absolute left-4 top-1/2 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-muted-foreground'
          strokeWidth={2.2}
          aria-hidden='true'
        />

        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder='Search users'
          aria-label='Search users'
          autoFocus
          className='flex h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'
        />
      </div>

      <SearchResultsPanel
        keyword={keyword}
        users={users}
        isLoading={searchQuery.isLoading || searchQuery.isFetching}
        isError={searchQuery.isError}
        errorMessage={searchQuery.error?.message}
        emptyMessage={
          isKeywordReady
            ? `No users found for "${normalizedKeyword}".`
            : 'Type at least 2 characters to search.'
        }
        idleMessage='Start typing to search users.'
      />
    </section>
  );
};

export default SearchPageClient;
