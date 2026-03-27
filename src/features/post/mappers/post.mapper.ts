// src/features/post/mappers/post.mapper.ts
/**
 * Post data mapper.
 * Transforms explore or public post DTOs into the shared post model.
 * This keeps UI components independent from raw API response shapes.
 */


import type { PostDto } from '@/features/post/types/post.dto';
import type {
  Post,
  PostPreview,
  PostPreviewSurface,
} from '@/types/entities/post';

export const mapPostDtoToPost = (postDto: PostDto): Post => {
  return {
    id: postDto.id,
    imageUrl: postDto.imageUrl,
    caption: postDto.caption ?? '',
    createdAt: postDto.createdAt,
    author: {
      id: postDto.author.id,
      username: postDto.author.username,
      name: postDto.author.name,
      avatarUrl: postDto.author.avatarUrl,
    },
    stats: {
      likeCount: postDto.likeCount,
      commentCount: postDto.commentCount,
    },
    relationship: {
      /**
       * Session 3D partial rule:
       * likedByMe is allowed only as verified visual metadata on Explore.
       *
       * Even though current /api/posts sample shows likedByMe is present,
       * keep the mapper defensive to protect UI stability if backend behavior
       * differs across auth context or future response changes.
       */
      likedByMe: Boolean(postDto.likedByMe),
    },
  };
};

export const mapPostDtosToPosts = (postDtos: readonly PostDto[]): Post[] => {
  return postDtos.map(mapPostDtoToPost);
};

export const mapPostToPreview = (
  post: Post,
  surface: PostPreviewSurface
): PostPreview => {
  return {
    ...post,
    surface,
  };
};

export const mapPostDtosToPreviews = (
  postDtos: readonly PostDto[],
  surface: PostPreviewSurface
): PostPreview[] => {
  return mapPostDtosToPosts(postDtos).map((post) =>
    mapPostToPreview(post, surface)
  );
};
