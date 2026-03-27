// src/app/dev/comment-shell/_components/DevCommentShellBackground.tsx
import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';

import DevCommentShellHeader from './DevCommentShellHeader';

const DevCommentShellBackground = () => {
  return (
    <div className='relative min-h-screen overflow-hidden bg-shell-background'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(127,81,249,0.18),transparent_42%)]' />
      <div className='absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.42)_100%)]' />

      <div className='relative mx-auto flex min-h-screen w-full max-w-md flex-col border-x border-border/40 bg-shell-background'>
        <DevCommentShellHeader />

        <main className='flex-1 overflow-hidden'>
          <article className='flex h-full flex-col'>
            <div className='relative aspect-[4/5] w-full overflow-hidden border-b border-border/60 bg-black'>
              <Image
                src='/assets/images/image-post-sample.jpg'
                alt='Sample post preview'
                fill
                priority
                sizes='(max-width: 768px) 100vw, 28rem'
                className='object-cover object-center'
              />

              <div className='absolute inset-0 bg-black/18' />

              <div className='absolute left-0 right-0 top-0 z-10 px-4 pt-4'>
                <div className='flex items-start gap-3'>
                  <div className='relative mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full'>
                    <Image
                      src='/assets/avatar/avatar-placeholder.jpg'
                      alt='John Doe avatar'
                      fill
                      sizes='40px'
                      className='object-cover'
                    />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <h2 className='truncate text-[1.125rem] font-semibold leading-6 text-foreground'>
                      John Doe
                    </h2>

                    <p className='mt-0.5 text-[0.8125rem] leading-4 text-foreground/80'>
                      1 Minutes Ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex shrink-0 items-center justify-between border-b border-border/40 px-4 py-2.5'>
              <div className='flex items-center gap-5'>
                <button
                  type='button'
                  className='inline-flex items-center gap-2 text-foreground'
                  aria-label='Like post'
                >
                  <Heart className='h-5 w-5 fill-current text-destructive' />
                  <span className='text-sm leading-5 text-foreground'>20</span>
                </button>

                <button
                  type='button'
                  className='inline-flex items-center gap-2 text-foreground'
                  aria-label='Open comments'
                >
                  <MessageCircle className='h-5 w-5' />
                  <span className='text-sm leading-5 text-foreground'>20</span>
                </button>

                <button
                  type='button'
                  className='inline-flex items-center gap-2 text-foreground'
                  aria-label='Share post'
                >
                  <Send className='h-5 w-5' />
                  <span className='text-sm leading-5 text-foreground'>20</span>
                </button>
              </div>

              <button
                type='button'
                className='inline-flex h-8 w-8 items-center justify-center text-foreground'
                aria-label='Bookmark post'
              >
                <Bookmark className='h-5 w-5 fill-current text-foreground' />
              </button>
            </div>

            <div className='flex-1 px-4 py-4'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='h-4 w-20 rounded bg-muted/40' />
                  <div className='h-3 w-full rounded bg-muted/30' />
                  <div className='h-3 w-[82%] rounded bg-muted/20' />
                </div>

                <div className='space-y-2'>
                  <div className='h-4 w-24 rounded bg-muted/35' />
                  <div className='h-3 w-full rounded bg-muted/25' />
                  <div className='h-3 w-[76%] rounded bg-muted/20' />
                </div>

                <div className='space-y-2'>
                  <div className='h-4 w-18 rounded bg-muted/35' />
                  <div className='h-3 w-full rounded bg-muted/25' />
                  <div className='h-3 w-[70%] rounded bg-muted/20' />
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default DevCommentShellBackground;
