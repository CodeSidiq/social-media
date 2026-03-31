// src/features/profile/types/profile.types.ts

export type ProfileTabKey = 'gallery' | 'saved';

export type MyProfileStats = Readonly<{
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
}>;

export type MyProfileViewModel = Readonly<{
  id: number;
  name: string;
  username: string;
  phone: string;
  avatarUrl: string | null;
  bio: string;
  stats: MyProfileStats;
}>;
