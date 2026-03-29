// src/features/comment/components/CommentEmptyState.tsx

const CommentEmptyState = () => {
  return (
    <div className='flex h-full min-h-0 flex-col items-center justify-center px-5 text-center'>
      <h3 className='text-base font-semibold leading-6 text-foreground'>
        No Comments yet
      </h3>

      <p className='mt-1 text-sm leading-5 text-muted-foreground'>
        Start the conversation
      </p>
    </div>
  );
};

export default CommentEmptyState;
