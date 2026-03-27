// src/features/like/mocks/generateDummyLikes.ts

import type { LikesModalShellProps } from '@/features/like/types/like-shell.types';

type GeneratedLikeUser = LikesModalShellProps['users'][number];

const FIRST_NAMES = [
  'Amelia',
  'Rizki',
  'Syifa',
  'Fajar',
  'Nabilah',
  'Indra',
  'Hanif',
  'Dewi',
  'Zahra',
  'Iqbal',
] as const;

const LAST_NAMES = [
  'Nur',
  'Firmansyah',
  'Akmal',
  'Pratama',
  'Putri',
  'Saputra',
  'Rahman',
  'Mardiana',
  'Nabil',
  'Maulana',
] as const;

export const generateDummyLikes = (count: number): GeneratedLikeUser[] => {
  return Array.from({ length: count }, (_, index) => {
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
    const lastName = LAST_NAMES[index % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const normalizedUsername = `${firstName}.${lastName}`
      .toLowerCase()
      .replace(/\s+/g, '');

    return {
      id: index + 1,
      name,
      username: `${normalizedUsername}${index + 1}`,
      avatarUrl: null,
      isFollowing: index % 3 === 0 || index % 5 === 0,
    };
  });
};
