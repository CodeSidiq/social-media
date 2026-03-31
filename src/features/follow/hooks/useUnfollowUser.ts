// src/features/follow/hooks/useUnfollowUser.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { followApi, type FollowMutationResponseDto } from '@/features/follow/api/follow.api';
import { invalidateFollowRelatedQueries } from '@/features/follow/lib/invalidate-follow-related-queries';
import type { MyProfileViewModel } from '@/features/profile/types/profile.types';
import type { PublicProfileViewModel } from '@/features/public-profile/types/public-profile.types';
import { queryKeys } from '@/lib/query-keys';

type UnfollowUserVariables = Readonly<{
  username: string;
  postId: number;
}>;

const getUnfollowErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<FollowMutationResponseDto>(error)) {
    const apiMessage = error.response?.data?.message;

    if (apiMessage) {
      return apiMessage;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Failed to unfollow user.';
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UnfollowUserVariables>({
    mutationFn: async ({ username }) => {
      try {
        const response = await followApi.unfollowUser(username);

        if (!response.success) {
          throw new Error(response.message || 'Failed to unfollow user.');
        }
      } catch (error) {
        throw new Error(getUnfollowErrorMessage(error));
      }
    },
    onSuccess: async (_, variables) => {
      queryClient.setQueryData<MyProfileViewModel | undefined>(
        queryKeys.profile.me,
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            stats: {
              ...currentData.stats,
              followingCount: Math.max(0, currentData.stats.followingCount - 1),
            },
          };
        }
      );

      queryClient.setQueryData<PublicProfileViewModel | undefined>(
        queryKeys.users.publicProfile(variables.username),
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            stats: {
              ...currentData.stats,
              followersCount: Math.max(0, currentData.stats.followersCount - 1),
            },
          };
        }
      );

      await invalidateFollowRelatedQueries(queryClient, variables);
    },
  });
};
