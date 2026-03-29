// src/features/comment/components/CommentSurfaceShell.tsx
/**
 * Comment modal surface.
 * Owns the comment lifecycle for a single post, including fetch, create, and delete flows.
 * Feed surfaces may open this UI, but comment domain behavior stays here.
 */

'use client';

import {
 Bookmark,
 Heart,
 MessageCircle,
 MoreHorizontal,
 Send,
 X,
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import {
 DialogClose,
 DialogContent,
 DialogDescription,
 DialogTitle,
} from '@/components/ui/dialog';
import { useAuthToken } from '@/features/auth/hooks/useAuthToken';
import { useMe } from '@/features/auth/hooks/useMe';
import CommentInputShell from '@/features/comment/components/CommentInputShell';
import CommentListShell, {
 type CommentShellItem,
} from '@/features/comment/components/CommentListShell';
import CommentPostPreviewShell from '@/features/comment/components/CommentPostPreviewShell';
import { useCreateComment } from '@/features/comment/hooks/useCreateComment';
import { useDeleteComment } from '@/features/comment/hooks/useDeleteComment';
import { usePostComments } from '@/features/comment/hooks/usePostComments';
import type { CreateCommentFormValues } from '@/features/comment/schemas/comment.schema';
import type { CommentSurfacePost } from '@/features/comment/types/comment.types';

type CommentSurfaceShellProps = Readonly<{
 post: CommentSurfacePost;
 variant?: 'empty' | 'filled';
 showEmojiPicker?: boolean;
 onToggleEmoji?: () => void;
 defaultDraft?: string;
 comments?: readonly CommentShellItem[];
 dataMode?: 'runtime' | 'shell';
}>;

const COMMENTS_PAGE = 1;
const COMMENTS_LIMIT = 10;
const COMMENT_MODAL_CAPTION_TOGGLE_THRESHOLD = 120;

const formatPostDateLabel = (value: string): string => {
 const date = new Date(value);

 if (Number.isNaN(date.getTime())) {
  return value;
 }

 return new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
 }).format(date);
};

const CommentSurfaceShell = ({
 post,
 variant = 'empty',
 showEmojiPicker = false,
 onToggleEmoji,
 defaultDraft = '',
 comments = [],
 dataMode = 'runtime',
}: CommentSurfaceShellProps) => {
 const [surfaceError, setSurfaceError] = useState<string | null>(null);
 const [activeDeletingCommentId, setActiveDeletingCommentId] =
  useState<number | null>(null);
 const [localEmojiPickerOpen, setLocalEmojiPickerOpen] = useState(false);
 const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

 const token = useAuthToken();
 const meQuery = useMe(token);

 const commentsQuery = usePostComments({
  postId: post.id,
  page: COMMENTS_PAGE,
  limit: COMMENTS_LIMIT,
 });

 const createCommentMutation = useCreateComment();
 const deleteCommentMutation = useDeleteComment();

 const me = meQuery.data?.data ?? null;
 const formattedDate = formatPostDateLabel(post.createdAt);
 const isLikedVisual = post.relationship.likedByMe;
 const avatarAlt = `${post.author.name} avatar`;
 const canSubmitComment = Boolean(token);
 const hasCaption = Boolean(post.caption?.trim());
 const shouldShowCaptionToggle =
  (post.caption?.trim().length ?? 0) >
  COMMENT_MODAL_CAPTION_TOGGLE_THRESHOLD;

 const isEmojiPickerOpen = onToggleEmoji
  ? showEmojiPicker
  : localEmojiPickerOpen;

 const baseComments = useMemo(() => {
  if (dataMode === 'shell') {
   return variant === 'empty' ? [] : comments;
  }

  return commentsQuery.data?.items ?? [];
 }, [comments, commentsQuery.data?.items, dataMode, variant]);

 const totalCommentCount =
  commentsQuery.data?.pagination.total ?? post.stats.commentCount;

 const canDeleteComment = (comment: CommentShellItem): boolean => {
  if (!me) {
   return false;
  }

  return comment.authorId === me.id || post.author.id === me.id;
 };

 const handleSubmitComment = async (
  values: CreateCommentFormValues
 ): Promise<void> => {
  setSurfaceError(null);

  if (!token) {
   setSurfaceError('You must be logged in to comment.');
   return;
  }

  try {
   await createCommentMutation.mutateAsync({
    postId: post.id,
    payload: {
     text: values.text,
    },
   });

   if (!onToggleEmoji) {
    setLocalEmojiPickerOpen(false);
   }
  } catch (error) {
   if (error instanceof Error) {
    setSurfaceError(error.message);
    return;
   }

   setSurfaceError('Failed to post comment.');
   throw error;
  }
 };

 const handleDeleteComment = async (commentId: number) => {
  if (activeDeletingCommentId === commentId) {
   return;
  }

  setSurfaceError(null);
  setActiveDeletingCommentId(commentId);

  try {
   await deleteCommentMutation.mutateAsync({
    postId: post.id,
    commentId,
   });
  } catch (error) {
   if (error instanceof Error) {
    setSurfaceError(error.message);
    return;
   }

   setSurfaceError('Failed to delete comment.');
  } finally {
   setActiveDeletingCommentId((currentId) =>
    currentId === commentId ? null : currentId
   );
  }
 };

 const handleToggleEmoji = () => {
  if (onToggleEmoji) {
   onToggleEmoji();
   return;
  }

  setLocalEmojiPickerOpen((currentState) => !currentState);
 };

 const handleCloseEmojiPicker = () => {
  if (onToggleEmoji) {
   if (isEmojiPickerOpen) {
    onToggleEmoji();
   }

   return;
  }

  setLocalEmojiPickerOpen(false);
 };

 const handleDraftChange = () => {
  if (surfaceError) {
   setSurfaceError(null);
  }
 };

 const inputErrorText = surfaceError ?? undefined;
 const inputHelperText = canSubmitComment
  ? undefined
  : 'Log in to add a comment.';

 const shouldCenterEmptyState =
  !commentsQuery.isLoading &&
  !commentsQuery.isFetching &&
  !commentsQuery.isError &&
  baseComments.length === 0;

 const mobileCommentSheetClassName = shouldCenterEmptyState
  ? 'h-[19.0625rem]'
  : 'h-auto max-h-[min(33.5rem,calc(100dvh-6rem))]';

 return (
  <DialogContent
   showCloseButton={false}
   overlayClassName='bg-black/40'
   className='fixed inset-0 z-[90] h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 overflow-hidden border-none bg-transparent p-0 shadow-none lg:inset-auto lg:left-1/2 lg:top-1/2 lg:h-auto lg:w-[min(100vw-15rem,75rem)] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2'
  >
   <DialogTitle className='sr-only'>Comment Surface</DialogTitle>

   <DialogDescription className='sr-only'>
    Comment modal aligned to the approved desktop design.
   </DialogDescription>

   <div className='relative min-h-[100dvh] w-full'>
    <div className='hidden lg:block'>
     <div className='relative mx-auto mt-24 w-full max-w-[75rem] px-6 xl:px-0'>
      

      <div className='grid h-[min(45rem,calc(100dvh-9rem))] w-full grid-cols-[2fr_1fr] overflow-hidden border border-border bg-shell-background'>
       <div className='relative h-full overflow-hidden border-r border-border'>
        <CommentPostPreviewShell post={post} variant='desktop' />
       </div>

       <section className='flex h-full min-h-0 flex-col bg-shell-background'>
        <div className='shrink-0 border-b border-border px-5 py-5'>
         <div className='flex items-start gap-3'>
          <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted'>
           <Image
            src={
             post.author.avatarUrl ??
             '/assets/avatar/avatar-placeholder.jpg'
            }
            alt={avatarAlt}
            fill
            sizes='40px'
            className='object-cover'
           />
       <DialogClose
       className='absolute -top-10 right-6 z-[90] inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:right-0'
       aria-label='Close dialog'
      >
       <X className='h-6 w-6' />
      </DialogClose>
          </div>

          <div className='min-w-0 flex-1'>
           <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
             <h2 className='truncate text-sm font-semibold leading-5 text-foreground'>
              {post.author.name}
             </h2>

             <p className='mt-1 text-xs leading-4 text-muted-foreground'>
              {formattedDate}
             </p>
            </div>

            <button
             type='button'
             className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
             aria-label='Open more actions'
            >
             <MoreHorizontal className='h-5 w-5' />
            </button>
           </div>

           {hasCaption ? (
            <>
             <p
              className='mt-4 text-sm leading-8 text-foreground'
              style={
               !isCaptionExpanded
                ? {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                 }
                : undefined
              }
             >
              {post.caption}
             </p>

             {shouldShowCaptionToggle ? (
              <button
               type='button'
               onClick={() =>
                setIsCaptionExpanded(
                 (currentState) => !currentState
                )
               }
               className='mt-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              >
               {isCaptionExpanded ? 'Show less' : 'Show more'}
              </button>
             ) : null}
            </>
           ) : null}
          </div>
         </div>
        </div>

        <div className='shrink-0 px-5 pt-5'>
         <h3 className='text-[1.125rem] font-semibold leading-7 text-foreground'>
          Comments
         </h3>
        </div>

        <div className='min-h-0 flex-1 overflow-hidden pt-3'>
         <div className='h-full min-h-0 overflow-y-auto ds-scrollbar'>
          <CommentListShell
           comments={baseComments}
           isLoading={
            commentsQuery.isLoading || commentsQuery.isFetching
           }
           isError={commentsQuery.isError}
           errorMessage={commentsQuery.error?.message}
           deletingCommentId={activeDeletingCommentId}
           onDeleteComment={handleDeleteComment}
           canDeleteComment={canDeleteComment}
          />
         </div>
        </div>

        <div className='shrink-0 border-t border-border px-5 py-4'>
         <div className='flex items-center justify-between'>
          <div className='flex items-center gap-5'>
           <button
            type='button'
            className='inline-flex items-center gap-2 rounded-lg px-2 py-1 text-foreground transition-colors hover:text-primary'
            aria-label='Like post'
           >
            <Heart
             className={`h-5 w-5 ${
              isLikedVisual ? ' text-destructive' : ''
             }`}
            />
            <span className='text-sm leading-5 text-foreground'>
             {post.stats.likeCount}
            </span>
           </button>

           <button
            type='button'
            className='inline-flex items-center gap-2 rounded-lg px-2 py-1 text-foreground transition-colors hover:text-primary'
            aria-label='Open comments'
           >
            <MessageCircle className='h-5 w-5' />
            <span className='text-sm leading-5 text-foreground'>
             {totalCommentCount}
            </span>
           </button>

           <button
            type='button'
            className='inline-flex items-center gap-2 rounded-lg px-2 py-1 text-foreground transition-colors hover:text-primary'
            aria-label='Share post'
           >
            <Send className='h-5 w-5' />
            <span className='text-sm leading-5 text-foreground'>
             20
            </span>
           </button>
          </div>

          <button
           type='button'
           className='inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
           aria-label='Bookmark post'
          >
           <Bookmark className='h-5 w-5' fill='currentColor' />
          </button>
         </div>
        </div>

        <div className='shrink-0 border-t border-border px-5 py-4'>
         <CommentInputShell
          defaultValue={defaultDraft}
          showEmojiPicker={isEmojiPickerOpen}
          onToggleEmoji={handleToggleEmoji}
          onCloseEmojiPicker={handleCloseEmojiPicker}
          onSubmit={handleSubmitComment}
          isSubmitting={createCommentMutation.isPending}
          onDraftChange={handleDraftChange}
          errorText={inputErrorText}
          helperText={inputHelperText}
         />
        </div>
       </section>
      </div>
     </div>
    </div>

    <div className='relative min-h-[100dvh] w-full overflow-x-hidden lg:hidden'>
     <div className='relative min-h-[100dvh] w-full'>
      <div className='absolute inset-x-0 bottom-0 z-[2] w-full'>
       <DialogClose
        className='absolute bottom-[calc(100%+0.5rem)] right-2 z-[4] inline-flex h-6 w-6 items-center justify-center text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        aria-label='Close dialog'
       >
        <X className='h-6 w-6' />
       </DialogClose>

       <section
        className={`flex w-full flex-col overflow-visible border-t border-border bg-shell-background ${mobileCommentSheetClassName}`}
       >
        <div className='shrink-0 border-b border-border px-4 pb-3 pt-5'>
         <h3 className='text-[1.125rem] font-semibold leading-7 text-foreground'>
          Comments
         </h3>
        </div>

        <div
         className={`min-h-0 flex-1 ${
          shouldCenterEmptyState
           ? 'overflow-hidden'
           : 'overflow-y-auto ds-scrollbar'
         }`}
        >
         <div
          className={
           shouldCenterEmptyState
            ? 'flex h-full items-center justify-center'
            : undefined
          }
         >
          <CommentListShell
           comments={baseComments}
           isLoading={
            commentsQuery.isLoading || commentsQuery.isFetching
           }
           isError={commentsQuery.isError}
           errorMessage={commentsQuery.error?.message}
           deletingCommentId={activeDeletingCommentId}
           onDeleteComment={handleDeleteComment}
           canDeleteComment={canDeleteComment}
          />
         </div>
        </div>

        <div className='relative z-10 shrink-0 border-t border-border px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3'>
         <CommentInputShell
          defaultValue={defaultDraft}
          showEmojiPicker={isEmojiPickerOpen}
          onToggleEmoji={handleToggleEmoji}
          onCloseEmojiPicker={handleCloseEmojiPicker}
          onSubmit={handleSubmitComment}
          isSubmitting={createCommentMutation.isPending}
          onDraftChange={handleDraftChange}
          errorText={inputErrorText}
          helperText={inputHelperText}
         />
        </div>
       </section>
      </div>
     </div>
    </div>
   </div>
  </DialogContent>
 );
};

export default CommentSurfaceShell;
