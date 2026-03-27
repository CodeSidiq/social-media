// src/features/post/components/PostFeedCard.tsx
/**
 * Shared post card.
 * Used across timeline, explore, and public feed surfaces.
 * Access behavior must be injected through callbacks instead of hardcoded rules.
 */

'use client';

import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import type { PostPreview } from '@/types/entities/post';

type RestrictedActionType = 'likes-list' | 'like' | 'share' | 'comment';

type PostFeedCardProps = Readonly<{
  post: PostPreview;
  onOpenLikes?: (postId: number) => void;
  onOpenComments?: (postId: number) => void;
  onRestrictedAction?: (action: RestrictedActionType) => void;
}>;

const formatPostDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Tanggal tidak tersedia';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const interactiveClass =
  'cursor-pointer text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const PostFeedCard = ({
  post,
  onOpenLikes,
  onOpenComments,
  onRestrictedAction,
}: PostFeedCardProps) => {
  const captionMeasureRef = useRef<HTMLParagraphElement | null>(null);

  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [isCaptionOverflowing, setIsCaptionOverflowing] = useState(false);

  const avatarAlt = `${post.author.name} avatar`;
  const formattedDate = formatPostDate(post.createdAt);
  const isLikedVisual = post.relationship.likedByMe;
  const imageAlt = post.caption || `Post image by ${post.author.name}`;
  const canOpenLikesModal = typeof onOpenLikes === 'function';
  const hasRestrictedActions = typeof onRestrictedAction === 'function';
  const hasCaption = Boolean(post.caption?.trim());

  useEffect(() => {
    const captionElement = captionMeasureRef.current;

    if (!captionElement || !hasCaption) return;

    const checkOverflow = () => {
      const isOverflowing =
        captionElement.scrollHeight > captionElement.clientHeight + 1;

      setIsCaptionOverflowing((prev) => {
        if (prev !== isOverflowing) return isOverflowing;
        return prev;
      });

      if (!isOverflowing) {
        setIsCaptionExpanded(false);
      }
    };

    // delay sedikit agar DOM benar-benar settle
    const raf = requestAnimationFrame(checkOverflow);

    window.addEventListener('resize', checkOverflow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [hasCaption, post.caption]);

  const handleLikesCountClick = () => {
    if (canOpenLikesModal) {
      onOpenLikes(post.id);
      return;
    }

    if (hasRestrictedActions) {
      onRestrictedAction('likes-list');
    }
  };

  const handleLikeClick = () => {
    if (hasRestrictedActions) {
      onRestrictedAction('like');
    }
  };

  const handleShareClick = () => {
    if (hasRestrictedActions) {
      onRestrictedAction('share');
    }
  };

  const handleCommentClick = () => {
    if (typeof onOpenComments === 'function') {
      onOpenComments(post.id);
      return;
    }

    if (hasRestrictedActions) {
      onRestrictedAction('comment');
    }
  };

  const handleToggleCaption = () => {
    setIsCaptionExpanded((currentState) => !currentState);
  };

  return (
    <article className='mx-auto w-full max-w-[42.75rem]'>
      <header className='flex items-start gap-3'>
        <Avatar
          src={post.author.avatarUrl}
          alt={avatarAlt}
          fallbackText={post.author.name}
          size='md'
        />

        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold text-foreground sm:text-base'>
            {post.author.name}
          </p>

          <p className='mt-0.5 text-xs text-muted-foreground sm:text-sm'>
            {formattedDate}
          </p>
        </div>
      </header>

      <div className='mt-4'>
        <div className='relative aspect-square w-full overflow-hidden rounded-[1rem]'>
          <img
            src={post.imageUrl}
            alt={imageAlt}
            className='h-full w-full object-cover'
            loading='lazy'
          />
        </div>
      </div>

      <div className='mt-4'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-5 sm:gap-6'>
            <div className='inline-flex items-center gap-2'>
              <button onClick={handleLikeClick} className={interactiveClass}>
                <Heart
                  className={`h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem] ${
                    isLikedVisual ? 'fill-current text-destructive' : ''
                  }`}
                />
              </button>

              <button onClick={handleLikesCountClick} className={interactiveClass}>
                <span className='text-sm sm:text-base'>
                  {post.stats.likeCount}
                </span>
              </button>
            </div>

            <div className='inline-flex items-center gap-2'>
              <button onClick={handleCommentClick} className={interactiveClass}>
                <MessageCircle className='h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]' />
              </button>

              <button onClick={handleCommentClick} className={interactiveClass}>
                <span className='text-sm sm:text-base'>
                  {post.stats.commentCount}
                </span>
              </button>
            </div>

            <div className='inline-flex items-center gap-2'>
              <button onClick={handleShareClick} className={interactiveClass}>
                <Send className='h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]' />
              </button>

              <button onClick={handleShareClick} className={interactiveClass}>
                <span className='text-sm sm:text-base'>0</span>
              </button>
            </div>
          </div>

          <Bookmark className='h-5 w-5 text-foreground' />
        </div>

        <div className='mt-4'>
          <p
            ref={captionMeasureRef}
            className={[
              'text-sm leading-6 text-foreground sm:text-base',
              !isCaptionExpanded && hasCaption ? 'line-clamp-2' : '',
            ].join(' ')}
          >
            <span className='font-semibold'>{post.author.name}</span>
            {hasCaption ? ` ${post.caption}` : ''}
          </p>

          {isCaptionOverflowing ? (
            <button
              type='button'
              onClick={handleToggleCaption}
              className='mt-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              {isCaptionExpanded ? 'Show less' : 'Show more'}
            </button>
          ) : null}
        </div>
      </div>

      <div className='mt-6 h-px w-full bg-border/80' />
    </article>
  );
};

export default PostFeedCard;
