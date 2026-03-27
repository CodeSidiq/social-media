// src/types/entities/comment.ts

import type { UserEntity } from '@/types/entities/user';

export type CommentEntity = {
  id: number;
  postId: number;
  text: string;
  createdAt: string;
  author: UserEntity;
};
