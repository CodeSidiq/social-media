// src/features/comment/components/CommentPostPreviewShell.tsx

import Image from 'next/image';

import type { CommentSurfacePost } from '@/features/comment/types/comment.types';

type CommentPostPreviewShellProps = Readonly<{
  post: CommentSurfacePost;
  variant?: 'desktop' | 'mobile';
}>;

const CommentPostPreviewShell = ({
  post,
  variant = 'desktop',
}: CommentPostPreviewShellProps) => {
  if (variant === 'mobile') {
    return (
      <div className='relative h-full min-h-0 overflow-hidden bg-shell-background'>
        <Image
          src={post.imageUrl}
          alt={post.caption || `Post image by ${post.author.name}`}
          fill
          priority
          sizes='100vw'
          className='object-cover object-center opacity-55'
        />
        <div className='absolute inset-0 bg-black/50' aria-hidden='true' />
      </div>
    );
  }

  return (
    <div className='relative h-full min-h-0 overflow-hidden bg-shell-background'>
      <Image
        src={post.imageUrl}
        alt={post.caption || `Post image by ${post.author.name}`}
        fill
        priority
        sizes='(max-width: 1279px) 60vw, 760px'
        className='object-cover object-center'
      />
    </div>
  );
};

export default CommentPostPreviewShell;
