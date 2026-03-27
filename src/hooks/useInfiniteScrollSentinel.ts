// src/hooks/useInfiniteScrollSentinel.ts

'use client';

import { useEffect, useRef } from 'react';

type UseInfiniteScrollSentinelParams = Readonly<{
  enabled: boolean;
  onIntersect: () => void;
  rootMargin?: string;
  threshold?: number;
}>;

export const useInfiniteScrollSentinel = ({
  enabled,
  onIntersect,
  rootMargin = '300px 0px',
  threshold = 0,
}: UseInfiniteScrollSentinelParams) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = sentinelRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting) {
          onIntersect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled, onIntersect, rootMargin, threshold]);

  return sentinelRef;
};
