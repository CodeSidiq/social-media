// src/features/profile/hooks/useUpdateProfile.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { profileApi } from '@/features/profile/api/profile.api';
import { queryKeys } from '@/lib/query-keys';
import { mapMyProfilePayloadToViewModel } from '@/features/profile/mappers/profile.mapper';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await profileApi.updateMyProfile(formData);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update profile.');
      }

      return mapMyProfilePayloadToViewModel(response.data);
    },

    onSuccess: (updatedProfile) => {
      // langsung update cache biar UI instant
      queryClient.setQueryData(queryKeys.profile.me, updatedProfile);

      // fallback revalidate (optional safety)
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.me,
      });
    },
  });
};
