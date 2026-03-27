// src/features/comment/components/CommentInputShell.tsx

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Smile } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  createCommentSchema,
  type CreateCommentFormValues,
} from '@/features/comment/schemas/comment.schema';

type CommentInputShellProps = Readonly<{
  defaultValue?: string;
  showEmojiPicker?: boolean;
  onToggleEmoji?: () => void;
  onSubmit?: (values: CreateCommentFormValues) => Promise<void>;
  isSubmitting?: boolean;
  disabled?: boolean;
  helperText?: string;
  submitLabel?: string;
}>;

const DESKTOP_EMOJIS = ['😀', '😍', '😂', '🔥', '❤️', '👏', '🙌', '✨'];

const CommentInputShell = ({
  defaultValue = '',
  showEmojiPicker = false,
  onToggleEmoji,
  onSubmit,
  isSubmitting = false,
  disabled = false,
  helperText,
  submitLabel = 'Post',
}: CommentInputShellProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      text: defaultValue,
    },
  });

  const desktopEmojiLabel = useMemo(() => {
    return showEmojiPicker ? 'Close emoji picker' : 'Open emoji picker';
  }, [showEmojiPicker]);

  const handleValidSubmit = async (values: CreateCommentFormValues) => {
    if (!onSubmit || disabled) {
      return;
    }

    await onSubmit(values);

    reset({
      text: '',
    });
  };

  const handleInsertEmoji = (emoji: string) => {
    const currentValue = getValues('text') ?? '';
    const nextValue = `${currentValue}${emoji}`;

    setValue('text', nextValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className='space-y-2'>
      <div className='relative flex items-center gap-3'>
        <button
          type='button'
          onClick={onToggleEmoji}
          disabled={disabled}
          className='inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-shell-background text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60'
          aria-label={desktopEmojiLabel}
          aria-pressed={showEmojiPicker}
        >
          <Smile className='h-5 w-5' />
        </button>

        <div className='flex min-w-0 flex-1 items-center rounded-xl border border-border bg-shell-background'>
          <input
            type='text'
            placeholder={disabled ? 'Log in to add a comment.' : 'Add Comment'}
            aria-label='Post comment shell'
            disabled={disabled || isSubmitting}
            className='h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60'
            {...register('text')}
          />

          <button
            type='submit'
            disabled={disabled || isSubmitting}
            className='inline-flex h-11 shrink-0 items-center justify-center px-4 text-sm font-semibold text-primary transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isSubmitting ? 'Posting...' : submitLabel}
          </button>
        </div>

        {showEmojiPicker ? (
          <div className='absolute bottom-[calc(100%+0.75rem)] left-0 z-20 hidden w-[14rem] rounded-2xl border border-border bg-shell-background p-3 shadow-2xl md:block'>
            <div className='grid grid-cols-4 gap-2'>
              {DESKTOP_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type='button'
                  onClick={() => handleInsertEmoji(emoji)}
                  className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-transparent text-xl transition-colors hover:bg-muted/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  aria-label={`Insert ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {errors.text ? (
        <p className='text-sm text-destructive'>{errors.text.message}</p>
      ) : helperText ? (
        <p className='text-sm text-muted-foreground'>{helperText}</p>
      ) : null}
    </form>
  );
};

export default CommentInputShell;
