// src/app/dev/comment-shell/page.tsx

import { Dialog } from '@/components/ui/dialog';
import type { CommentShellItem } from '@/features/comment/components/CommentListShell';
import CommentSurfaceShell from '@/features/comment/components/CommentSurfaceShell';

import DevCommentShellBackground from './_components/DevCommentShellBackground';
import { mockPost } from './_mocks/mockPost';

const mockComments: CommentShellItem[] = [
  {
    id: 1,
    authorId: 201,
    authorUsername: 'alexander',
    authorName: 'Alexander',
    text: 'This is the kind of love everyone dreams about ✨',
    createdAt: '2026-03-25T10:00:00.000Z',
    timeLabel: '1 Minute Ago',
    avatarSrc: '/assets/avatar/avatar-placeholder.jpg',
  },
  {
    id: 2,
    authorId: 202,
    authorUsername: 'sophia',
    authorName: 'Sophia',
    text: 'Beautiful composition and very clean framing.',
    createdAt: '2026-03-25T09:56:00.000Z',
    timeLabel: '4 Minutes Ago',
    avatarSrc: '/assets/avatar/avatar-placeholder.jpg',
  },
  {
    id: 3,
    authorId: 203,
    authorUsername: 'daniel',
    authorName: 'Daniel',
    text: 'The lighting here is excellent. Love the atmosphere.',
    createdAt: '2026-03-25T09:48:00.000Z',
    timeLabel: '12 Minutes Ago',
    avatarSrc: '/assets/avatar/avatar-placeholder.jpg',
  },
];

const CommentShellDevPage = () => {
  return (
    <main className='relative min-h-screen overflow-hidden bg-background'>
      <DevCommentShellBackground />

      <Dialog open>
        <CommentSurfaceShell
          post={mockPost}
          variant='filled'
          comments={mockComments}
        />
      </Dialog>
    </main>
  );
};

export default CommentShellDevPage;
