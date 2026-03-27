// src/features/post/hooks/useCreatePost.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postApi } from '@/features/post/api/post.api';
import { queryKeys } from '@/lib/query-keys';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await postApi.createPost(formData);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.feed.all,
      });
    },
  });
};
