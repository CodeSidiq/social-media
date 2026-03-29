// src/features/comment/lib/comment-emoji-usage.ts

import {
  COMMENT_EMOJIS,
  COMMENT_EMOJI_INITIAL_VISIBLE_COUNT,
} from '@/features/comment/constants/comment-emojis';

const COMMENT_EMOJI_USAGE_STORAGE_KEY = 'comment-emoji-usage';

type CommentEmojiUsageMap = Record<string, number>;

const COMMENT_EMOJI_SET = new Set<string>(COMMENT_EMOJIS);

const isBrowser = (): boolean => typeof window !== 'undefined';

const shuffleArray = <T>(items: readonly T[]): T[] => {
  const nextItems = [...items];

  for (let currentIndex = nextItems.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [nextItems[currentIndex], nextItems[randomIndex]] = [
      nextItems[randomIndex],
      nextItems[currentIndex],
    ];
  }

  return nextItems;
};

const safeParseUsageMap = (value: string | null): CommentEmojiUsageMap => {
  if (!value) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(value);

    if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
      return {};
    }

    return Object.entries(parsedValue).reduce<CommentEmojiUsageMap>(
      (accumulator, [emoji, count]) => {
        if (typeof emoji !== 'string') {
          return accumulator;
        }

        if (typeof count !== 'number' || !Number.isFinite(count) || count <= 0) {
          return accumulator;
        }

        accumulator[emoji] = count;
        return accumulator;
      },
      {}
    );
  } catch {
    return {};
  }
};

export const getCommentEmojiUsageMap = (): CommentEmojiUsageMap => {
  if (!isBrowser()) {
    return {};
  }

  return safeParseUsageMap(
    window.localStorage.getItem(COMMENT_EMOJI_USAGE_STORAGE_KEY)
  );
};

const setCommentEmojiUsageMap = (usageMap: CommentEmojiUsageMap): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    COMMENT_EMOJI_USAGE_STORAGE_KEY,
    JSON.stringify(usageMap)
  );
};

export const incrementCommentEmojiUsage = (emoji: string): void => {
  const usageMap = getCommentEmojiUsageMap();

  usageMap[emoji] = (usageMap[emoji] ?? 0) + 1;

  setCommentEmojiUsageMap(usageMap);
};

export const getRecommendedCommentEmojis = (
  limit = COMMENT_EMOJI_INITIAL_VISIBLE_COUNT
): string[] => {
  const normalizedLimit = Math.max(1, limit);
  const usageMap = getCommentEmojiUsageMap();

  const usedEmojis = Object.entries(usageMap)
    .filter(([emoji]) => COMMENT_EMOJI_SET.has(emoji))
    .sort((leftEntry, rightEntry) => {
      return rightEntry[1] - leftEntry[1];
    })
    .map(([emoji]) => emoji);

  const usedEmojiSet = new Set<string>(usedEmojis);

  const unusedEmojis = COMMENT_EMOJIS.filter((emoji) => !usedEmojiSet.has(emoji));
  const randomizedUnusedEmojis = shuffleArray(unusedEmojis);

  return [...usedEmojis, ...randomizedUnusedEmojis].slice(0, normalizedLimit);
};
