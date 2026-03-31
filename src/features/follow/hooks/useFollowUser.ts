// src/features/follow/hooks/useFollowUser.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { followApi, type FollowMutationResponseDto } from '@/features/follow/api/follow.api';
import { invalidateFollowRelatedQueries } from '@/features/follow/lib/invalidate-follow-related-queries';
import type { MyProfileViewModel } from '@/features/profile/types/profile.types';
import type { PublicProfileViewModel } from '@/features/public-profile/types/public-profile.types';
import { queryKeys } from '@/lib/query-keys';

type FollowUserVariables = Readonly<{
  username: string;
  postId: number;
}>;

const getFollowErrorMessage = (error: unknown): string => {
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

  return 'Failed to follow user.';
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, FollowUserVariables>({
    mutationFn: async ({ username }) => {
      try {
        const response = await followApi.followUser(username);

        if (!response.success) {
          throw new Error(response.message || 'Failed to follow user.');
        }
      } catch (error) {
        throw new Error(getFollowErrorMessage(error));
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
              followingCount: currentData.stats.followingCount + 1,
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
              followersCount: currentData.stats.followersCount + 1,
            },
          };
        }
      );

      await invalidateFollowRelatedQueries(queryClient, variables);
    },
  });
};
