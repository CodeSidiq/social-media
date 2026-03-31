// src/features/profile/components/MyProfileGalleryGrid.tsx

import MyProfileGalleryItem from '@/features/profile/components/MyProfileGalleryItem';
import type { Post } from '@/types/entities/post';

type MyProfileGalleryGridProps = Readonly<{
  posts: Post[];
}>;

const MyProfileGalleryGrid = ({ posts }: MyProfileGalleryGridProps) => {
  return (
    <section
      aria-label='My posts gallery'
      className='grid grid-cols-3 gap-3 md:gap-4'
    >
      {posts.map((post) => (
        <MyProfileGalleryItem key={post.id} post={post} />
      ))}
    </section>
  );
};

export default MyProfileGalleryGrid;
