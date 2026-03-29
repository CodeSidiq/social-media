// src/features/comment/components/CommentInputShell.tsx

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Smile } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  COMMENT_EMOJIS,
  COMMENT_EMOJI_INITIAL_VISIBLE_COUNT,
} from '@/features/comment/constants/comment-emojis';
import {
  getRecommendedCommentEmojis,
  incrementCommentEmojiUsage,
} from '@/features/comment/lib/comment-emoji-usage';
import {
  createCommentSchema,
  type CreateCommentFormValues,
} from '@/features/comment/schemas/comment.schema';

type CommentInputShellProps = Readonly<{
  defaultValue?: string;
  showEmojiPicker?: boolean;
  onToggleEmoji?: () => void;
  onCloseEmojiPicker?: () => void;
  onSubmit?: (values: CreateCommentFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onDraftChange?: (value: string) => void;
  disabled?: boolean;
  errorText?: string;
  helperText?: string;
  submitLabel?: string;
  enableEmojiPickerPopover?: boolean;
}>;

const CommentInputShell = ({
  defaultValue = '',
  showEmojiPicker = false,
  onToggleEmoji,
  onCloseEmojiPicker,
  onSubmit,
  isSubmitting = false,
  onDraftChange,
  disabled = false,
  errorText,
  helperText,
  submitLabel = 'Post',
  enableEmojiPickerPopover = true,
}: CommentInputShellProps) => {
  const [isShowingAllEmojis, setIsShowingAllEmojis] = useState(false);
  const [recommendedEmojis, setRecommendedEmojis] = useState<string[]>(() =>
    getRecommendedCommentEmojis(COMMENT_EMOJI_INITIAL_VISIBLE_COUNT)
  );

  const pickerContainerRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const skipNextOutsideCloseRef = useRef(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      text: defaultValue,
    },
  });

  const currentText = useWatch({
    control,
    name: 'text',
    defaultValue,
  }) ?? '';

  const isPopoverOpen = enableEmojiPickerPopover && showEmojiPicker;

  useEffect(() => {
    if (!isPopoverOpen || !onCloseEmojiPicker) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (skipNextOutsideCloseRef.current) {
        skipNextOutsideCloseRef.current = false;
        return;
      }

      const eventTarget = event.target;

      if (!(eventTarget instanceof Node)) {
        return;
      }

      const isInsidePicker =
        pickerContainerRef.current?.contains(eventTarget) ?? false;
      const isToggleButton =
        toggleButtonRef.current?.contains(eventTarget) ?? false;

      if (isInsidePicker || isToggleButton) {
        return;
      }

      onCloseEmojiPicker();
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isPopoverOpen, onCloseEmojiPicker]);

  const isInputDisabled = disabled || isSubmitting;
  const isSubmitDisabled = isInputDisabled || currentText.trim().length === 0;

  const visibleEmojis = isShowingAllEmojis ? COMMENT_EMOJIS : recommendedEmojis;

  const canShowMoreEmojis =
    COMMENT_EMOJIS.length > COMMENT_EMOJI_INITIAL_VISIBLE_COUNT;

  const desktopEmojiLabel = useMemo(() => {
    if (!enableEmojiPickerPopover) {
      return 'Emoji picker unavailable on this layout';
    }

    return isPopoverOpen ? 'Close emoji picker' : 'Open emoji picker';
  }, [enableEmojiPickerPopover, isPopoverOpen]);

  const handleValidSubmit = async (values: CreateCommentFormValues) => {
    if (!onSubmit || disabled || isSubmitting) {
      return;
    }

    const trimmedText = values.text.trim();

    if (trimmedText.length === 0) {
      return;
    }

    await onSubmit({
      ...values,
      text: trimmedText,
    });

    reset({
      text: '',
    });
  };

  const handleInsertEmoji = (emoji: string) => {
    const nextValue = `${currentText}${emoji}`;

    setValue('text', nextValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    incrementCommentEmojiUsage(emoji);
    setRecommendedEmojis(
      getRecommendedCommentEmojis(COMMENT_EMOJI_INITIAL_VISIBLE_COUNT)
    );

    onDraftChange?.(nextValue);
  };

  const handleToggleShowMore = () => {
    setIsShowingAllEmojis((currentState) => !currentState);
  };

  return (
    <form
      onSubmit={handleSubmit(handleValidSubmit)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          const target = event.target;
          if (target instanceof HTMLTextAreaElement) {
            return; // allow newline
          }
        }
      }} className='space-y-2'>
      <div className='relative flex items-center gap-3'>
        <button
          ref={toggleButtonRef}
          type='button'
          onPointerDown={(event) => {
            event.stopPropagation();
            skipNextOutsideCloseRef.current = true;
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!enableEmojiPickerPopover) {
              return;
            }

            onToggleEmoji?.();
          }}
          disabled={disabled}
          className='inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-shell-background text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60'
          aria-label={desktopEmojiLabel}
          aria-pressed={isPopoverOpen}
        >
          <Smile className='h-5 w-5' />
        </button>

        <div className='flex min-w-0 flex-1 items-center rounded-xl border border-border bg-shell-background'>
          <textarea
            placeholder={disabled ? 'Log in to add a comment.' : 'Add Comment'}
            aria-label='Post comment shell'
            disabled={isInputDisabled}
            rows={1}
            className='ds-scrollbar min-h-[44px] max-h-[120px] min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-4 py-3 pr-3 text-sm text-foreground outline-none [scrollbar-gutter:stable] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60'
            {...register('text', {
              onChange: (event) => {
                onDraftChange?.(event.target.value);
              },
            })}
          />

          <button
            type='submit'
            disabled={isSubmitDisabled}
            className='inline-flex h-11 shrink-0 items-center justify-center px-4 text-sm font-semibold text-primary transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isSubmitting ? 'Posting...' : submitLabel}
          </button>
        </div>

        {isPopoverOpen ? (
          <div
            ref={pickerContainerRef}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
            className='absolute bottom-[calc(100%+0.75rem)] left-0 z-20 w-[14rem] rounded-2xl border border-border bg-shell-background p-3 shadow-2xl'
          >
            <div className='flex max-h-[20rem] flex-col'>
              <div className='overflow-y-auto pr-1 ds-scrollbar'>
                <div className='grid grid-cols-4 gap-2'>
                  {visibleEmojis.map((emoji, index) => (
                    <button
                      key={`${emoji}-${index}`}
                      type='button'
                      onPointerDown={(event) => {
                        event.stopPropagation();
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleInsertEmoji(emoji);
                      }}
                      className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-transparent text-xl transition-colors hover:bg-muted/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      aria-label={`Insert ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {canShowMoreEmojis ? (
                <button
                  type='button'
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleToggleShowMore();
                  }}
                  className='mt-3 inline-flex w-full items-center justify-center rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                >
                  {isShowingAllEmojis ? 'Show less' : 'Show more'}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {errors.text ? (
        <p className='text-sm text-destructive'>{errors.text.message}</p>
      ) : errorText ? (
        <p className='text-sm text-destructive'>{errorText}</p>
      ) : helperText ? (
        <p className='text-sm text-muted-foreground'>{helperText}</p>
      ) : null}
    </form>
  );
};

export default CommentInputShell;
