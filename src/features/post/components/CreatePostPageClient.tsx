// src/features/post/components/CreatePostPageClient.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import CreatePostForm from '@/features/post/components/CreatePostForm';

const CreatePostPageClient = () => {
  return (
    <main className='w-full bg-transparent text-foreground'>
      <div className='mx-auto w-full max-w-[28.25rem] pt-10'>
        <div className='mb-6 flex items-center gap-3'>
          <Link
            href='/timeline'
            aria-label='Back to timeline'
            className='inline-flex h-6 w-6 items-center justify-center text-foreground transition-opacity hover:opacity-80'
          >
            <ArrowLeft className='size-6' strokeWidth={2.2} />
          </Link>

          <h1 className='text-[1.75rem] font-semibold leading-9 tracking-[-0.02em] text-foreground'>
            Add Post
          </h1>
        </div>

        <CreatePostForm />
      </div>
    </main>
  );
};

export default CreatePostPageClient;
