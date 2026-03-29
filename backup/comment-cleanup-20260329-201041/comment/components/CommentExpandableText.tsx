// src/features/comment/components/CommentExpandableText.tsx
/**
 * Expandable text utility for comments.
 * Uses DOM measurement to detect real overflow.
 * This avoids character-length assumptions and keeps expansion logic reusable.
 */


'use client';

import { useEffect, useRef, useState } from 'react';

type CommentExpandableTextProps = Readonly<{
  text: string;
  className?: string;
  collapsedClassName?: string;
  buttonClassName?: string;
}>;

const CommentExpandableText = ({
  text,
  className = 'text-sm leading-6 text-foreground',
  collapsedClassName = 'line-clamp-2',
  buttonClassName = 'mt-1 text-xs font-medium leading-5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
}: CommentExpandableTextProps) => {
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflowWhenCollapsed = () => {
      const textElement = textRef.current;

      if (!textElement || !text.trim()) {
        setIsOverflowing((previousState) =>
          previousState !== false ? false : previousState
        );
        setIsExpanded((previousState) =>
          previousState !== false ? false : previousState
        );
        return;
      }

      if (isExpanded) {
        return;
      }

      const overflowDetected =
        textElement.scrollHeight > textElement.clientHeight + 1;

      setIsOverflowing((previousState) =>
        previousState !== overflowDetected ? overflowDetected : previousState
      );
    };

    const animationFrameId = window.requestAnimationFrame(
      checkOverflowWhenCollapsed
    );

    window.addEventListener('resize', checkOverflowWhenCollapsed);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', checkOverflowWhenCollapsed);
    };
  }, [text, isExpanded]);

  return (
    <div className='min-w-0'>
      <p
        ref={textRef}
        className={[className, !isExpanded ? collapsedClassName : ''].join(' ')}
      >
        {text}
      </p>

      {isOverflowing ? (
        <button
          type='button'
          onClick={() => {
            setIsExpanded((currentState) => !currentState);
          }}
          className={buttonClassName}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      ) : null}
    </div>
  );
};

export default CommentExpandableText;
