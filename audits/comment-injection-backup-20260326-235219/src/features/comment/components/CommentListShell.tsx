// src/features/comment/components/CommentListShell.tsx

'use client';

import Image from 'next/image';

import CommentEmptyState from '@/features/comment/components/CommentEmptyState';
import type { CommentItem } from '@/features/comment/types/comment.types';
import CommentExpandableText from '@/features/comment/components/CommentExpandableText';

export type CommentShellItem = CommentItem;

type CommentListShellProps = Readonly<{
  comments?: readonly CommentShellItem[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  deletingCommentId?: number | null;
  onDeleteComment?: (commentId: number) => void;
  canDeleteComment?: (comment: CommentShellItem) => boolean;
}>;

const CommentListShell = ({
  comments = [],
  isLoading = false,
  isError = false,
  errorMessage,
  deletingCommentId = null,
  onDeleteComment,
  canDeleteComment,
}: CommentListShellProps) => {
  if (isLoading) {
    return (
      <div className='space-y-4 px-5 py-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`comment-skeleton-${index}`}
            className='flex gap-3 py-1'
            aria-hidden='true'
          >
            <div className='h-10 w-10 rounded-full bg-muted' />
            <div className='min-w-0 flex-1 space-y-2'>
              <div className='h-4 w-28 rounded bg-muted' />
              <div className='h-4 w-full rounded bg-muted' />
              <div className='h-4 w-2/3 rounded bg-muted' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='mx-5 rounded-xl border border-border bg-shell-background px-4 py-5'>
        <p className='text-sm font-medium text-foreground'>Unable to load comments.</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          {errorMessage || 'Something went wrong while loading comments.'}
        </p>
      </div>
    );
  }

  if (comments.length === 0) {
    return <CommentEmptyState />;
  }

  return (
    <div className='flex flex-col px-5'>
      {comments.map((comment, index) => {
        const allowDelete = canDeleteComment?.(comment) ?? false;
        const isDeleting = deletingCommentId === comment.id;

        return (
          <article
            key={comment.id}
            className={`flex gap-3 py-4 ${
              index !== comments.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted'>
              <Image
                src={comment.avatarSrc ?? '/assets/avatar/avatar-placeholder.jpg'}
                alt={`${comment.authorName} avatar`}
                fill
                sizes='40px'
                className='object-cover'
              />
            </div>

            <div className='min-w-0 flex-1'>
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <h4 className='truncate text-sm font-semibold leading-5 text-foreground'>
                    {comment.authorName}
                  </h4>

                  <p className='mt-0.5 text-xs leading-4 text-muted-foreground'>
                    {comment.timeLabel}
                  </p>
                </div>

                {allowDelete ? (
                  <button
                    type='button'
                    onClick={() => onDeleteComment?.(comment.id)}
                    disabled={isDeleting}
                    className='shrink-0 text-sm font-medium text-destructive transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                ) : null}
              </div>

              <CommentExpandableText text={comment.text} className='mt-2 text-sm leading-7 text-foreground' />
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CommentListShell;
