// src/features/post/components/PostFeedCard.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import type { PostPreview } from '@/types/entities/post';

type RestrictedActionType = 'likes-list' | 'like' | 'share' | 'comment';

type PostFeedCardProps = Readonly<{
  post: PostPreview;
  onOpenLikes?: (postId: number) => void;
  onOpenComments?: (postId: number) => void;
  onRestrictedAction?: (action: RestrictedActionType) => void;
  onToggleLike?: (post: PostPreview) => void;
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
  onToggleLike,
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
  const hasToggleLike = typeof onToggleLike === 'function';
  const hasCaption = Boolean(post.caption?.trim());

  const profileHref = `/users/${post.author.username}`;

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
    if (hasToggleLike) {
      onToggleLike(post);
      return;
    }

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
        <Link href={profileHref}>
          <Avatar
            src={post.author.avatarUrl}
            alt={avatarAlt}
            fallbackText={post.author.name}
            size='md'
          />
        </Link>

        <div className='min-w-0 flex-1'>
          <Link href={profileHref}>
            <p className='truncate text-sm font-semibold text-foreground hover:underline sm:text-base'>
              {post.author.name}
            </p>
          </Link>

          <p className='mt-0.5 text-xs text-muted-foreground sm:text-sm'>
            {formattedDate}
          </p>
        </div>
      </header>

      <div className='mt-4'>
        <div className='relative aspect-square w-full overflow-hidden rounded-[1rem]'>
          <Image
            src={post.imageUrl}
            alt={imageAlt}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1280px) 600px, 684px'
            className='object-cover'
          />
        </div>
      </div>

      <div className='mt-4'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-5 sm:gap-6'>
            <div className='inline-flex items-center gap-2'>
              <button type='button' onClick={handleLikeClick} className={interactiveClass}>
                <Heart
                  className={`h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem] ${
                    isLikedVisual ? 'fill-current text-destructive' : ''
                  }`}
                />
              </button>

              <button
                type='button'
                onClick={handleLikesCountClick}
                className={interactiveClass}
              >
                <span className='text-sm sm:text-base'>
                  {post.stats.likeCount}
                </span>
              </button>
            </div>

            <div className='inline-flex items-center gap-2'>
              <button type='button' onClick={handleCommentClick} className={interactiveClass}>
                <MessageCircle className='h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]' />
              </button>

              <button
                type='button'
                onClick={handleCommentClick}
                className={interactiveClass}
              >
                <span className='text-sm sm:text-base'>
                  {post.stats.commentCount}
                </span>
              </button>
            </div>

            <div className='inline-flex items-center gap-2'>
              <button type='button' onClick={handleShareClick} className={interactiveClass}>
                <Send className='h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]' />
              </button>

              <button
                type='button'
                onClick={handleShareClick}
                className={interactiveClass}
              >
                
              </button>
            </div>
          </div>

          
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
              className='mt-2 text-sm font-medium text-muted-foreground hover:text-foreground'
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
