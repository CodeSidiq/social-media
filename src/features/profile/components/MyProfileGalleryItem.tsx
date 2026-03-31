// src/features/profile/components/MyProfileGalleryItem.tsx

import Image from 'next/image';

import type { Post } from '@/types/entities/post';

type MyProfileGalleryItemProps = Readonly<{
  post: Post;
}>;

const MyProfileGalleryItem = ({ post }: MyProfileGalleryItemProps) => {
  const altText = post.caption.trim() || `${post.author.name} post image`;

  return (
    <article className='group relative overflow-hidden rounded-2xl border border-border bg-muted/40'>
      <div className='relative aspect-square'>
        <Image
          src={post.imageUrl}
          alt={altText}
          fill
          sizes='(max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw'
          className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
        />
      </div>
    </article>
  );
};

export default MyProfileGalleryItem;
