// src/app/dev/likes-shell/_components/DevLikesShellBackground.tsx

import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import type { LikesShellPostContext } from '@/features/like/types/like-shell.types';

type DevLikesShellBackgroundProps = Readonly<{
  post: LikesShellPostContext;
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

const DevLikesShellBackground = ({ post }: DevLikesShellBackgroundProps) => {
  const formattedDate = formatPostDate(post.createdAt);

  return (
    <div className='relative min-h-screen overflow-hidden bg-shell-background'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(127,81,249,0.18),transparent_32%),radial-gradient(circle_at_bottom,rgba(217,32,110,0.12),transparent_30%)]' />

      <div className='relative mx-auto flex min-h-screen w-full max-w-md flex-col border-x border-border/40 bg-shell-background'>
        <main className='flex-1 overflow-hidden px-4 py-5'>
          <article className='mx-auto w-full max-w-[26rem]'>
            <header className='flex items-start gap-3'>
              <Avatar
                src={post.author.avatarUrl}
                alt={`${post.author.name} avatar`}
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

            <div className='mt-4 overflow-hidden rounded-[1rem] border border-border/70 bg-card/90'>
              <div className='relative aspect-square w-full overflow-hidden bg-black'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt={post.caption || `Post image by ${post.author.name}`}
                  className='h-full w-full object-cover'
                />
              </div>

              <div className='space-y-4 p-4'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-5 text-foreground'>
                    <div className='inline-flex items-center gap-2'>
                      <Heart
                        className={`size-5 ${
                          post.relationship.likedByMe
                            ? 'fill-current text-destructive'
                            : ''
                        }`}
                        aria-hidden='true'
                      />
                      <span className='text-sm'>{post.stats.likeCount}</span>
                    </div>

                    <div className='inline-flex items-center gap-2'>
                      <MessageCircle className='size-5' aria-hidden='true' />
                      <span className='text-sm'>{post.stats.commentCount}</span>
                    </div>

                    <div className='inline-flex items-center gap-2'>
                      <Send className='size-5' aria-hidden='true' />
                      <span className='text-sm'>0</span>
                    </div>
                  </div>

                  <Bookmark className='size-5 text-foreground' aria-hidden='true' />
                </div>

                <p className='text-sm leading-6 text-foreground'>
                  <span className='font-semibold'>{post.author.name}</span>{' '}
                  {post.caption}
                </p>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default DevLikesShellBackground;
