// src/features/auth/types/auth.dto.ts

import type { ApiResponse } from '@/types/api/common';
import type { UserEntity } from '@/types/entities/user';

export type RegisterRequestDto = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type AuthSuccessData = {
  token: string;
  user: UserEntity;
};

export type MeStatsDto = {
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  likesCount?: number;
  savedCount?: number;
};

export type MeProfilePayloadDto = {
  profile: UserEntity;
  stats: MeStatsDto;
};

export type RegisterResponseDto = ApiResponse<AuthSuccessData>;
export type LoginResponseDto = ApiResponse<AuthSuccessData>;

/**
 * Normalized response shape consumed by the frontend.
 * After normalization, /api/me behaves like ApiResponse<UserEntity>.
 */
export type MeResponseDto = ApiResponse<UserEntity>;

/**
 * Raw backend response shape returned by /api/me.
 * The backend nests the actual user data inside data.profile.
 */
export type MeRawResponseDto = ApiResponse<MeProfilePayloadDto>;
