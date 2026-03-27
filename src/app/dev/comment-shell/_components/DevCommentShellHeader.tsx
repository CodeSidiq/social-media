// src/app/dev/comment-shell/_components/DevCommentShellHeader.tsx
import { Search } from 'lucide-react';
import Image from 'next/image';

const DevCommentShellHeader = () => {
  return (
    <header className='border-b border-border/60 bg-shell-background'>
      <div className='mx-auto flex h-14 w-full max-w-md items-center justify-between px-4'>
        <div className='flex items-center gap-3'>
          <Image
            src='/assets/logo/sociality-logo.svg'
            alt='Sociality logo'
            width={20}
            height={20}
            className='h-5 w-5'
            priority
          />

          <span className='text-[1.0625rem] font-semibold leading-6 text-foreground'>
            Sociality
          </span>
        </div>

        <div className='flex items-center gap-4'>
          <Search className='h-[1.0625rem] w-[1.0625rem] text-foreground' />

          <div className='relative h-8 w-8 overflow-hidden rounded-full'>
            <Image
              src='/assets/avatar/avatar-placeholder.jpg'
              alt='Current user avatar'
              fill
              sizes='32px'
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DevCommentShellHeader;
