// src/features/profile/components/MyProfileEmptyState.tsx

import Link from 'next/link';
import { ImagePlus } from 'lucide-react';

const MyProfileEmptyState = () => {
  return (
    <section className='rounded-[1.75rem] border border-border bg-card p-8 md:p-12'>
      <div className='mx-auto flex max-w-xl flex-col items-center justify-center text-center'>
        <div className='inline-flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
          <ImagePlus className='size-7' aria-hidden='true' />
        </div>

        <div className='mt-5 space-y-2'>
          <h2 className='text-xl font-semibold text-card-foreground md:text-2xl'>
            No posts yet
          </h2>
          <p className='text-sm leading-7 text-muted-foreground md:text-base'>
            You have not uploaded any posts yet. Start sharing your first post
            to build your profile gallery.
          </p>
        </div>

        <Link
          href='/posts/create'
          className='mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90'
        >
          Upload My First Post
        </Link>
      </div>
    </section>
  );
};

export default MyProfileEmptyState;
