// src/features/public-profile/hooks/usePublicUserLikes.ts

import { useQuery } from '@tanstack/react-query';
import { publicProfileApi } from '@/features/public-profile/api/public-profile.api';
import { queryKeys } from '@/lib/query-keys';
import { mapPublicUserPostsPayloadToQueryData } from '@/features/public-profile/mappers/public-profile.mapper';

type Params = {
  username: string;
  page?: number;
  limit?: number;
};

export const usePublicUserLikes = ({
  username,
  page = 1,
  limit = 20,
}: Params) => {
  const normalizedUsername = username.trim();

  return useQuery({
    queryKey: queryKeys.users.publicLikes(normalizedUsername, page, limit),
    queryFn: async () => {
      const response = await publicProfileApi.getPublicUserLikes({
        username: normalizedUsername,
        page,
        limit,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load public user likes.');
      }

      return mapPublicUserPostsPayloadToQueryData(response.data);
    },
    enabled: Boolean(normalizedUsername),
  });
};
