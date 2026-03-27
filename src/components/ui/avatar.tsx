// src/components/ui/avatar.tsx

import Image from 'next/image';

import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

type AvatarProps = Readonly<{
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  size?: AvatarSize;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}>;

const avatarSizeClasses: Record<AvatarSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
};

const getFallbackText = (value?: string) => {
  if (!value) {
    return 'U';
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'U';
  }

  const words = trimmedValue.split(/\s+/).slice(0, 2);
  const initials = words.map((word) => word[0]?.toUpperCase()).join('');

  return initials || 'U';
};

const Avatar = ({
  src,
  alt = 'User avatar',
  fallbackText,
  size = 'md',
  className,
  imageClassName,
  priority = false,
}: AvatarProps) => {
  const resolvedFallback = getFallbackText(fallbackText ?? alt);
  const sizeClassName = avatarSizeClasses[size];

  if (!src) {
    return (
      <div
        aria-label={alt}
        className={cn(
          'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-muted-foreground',
          sizeClassName,
          className
        )}
      >
        <span>{resolvedFallback}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted',
        sizeClassName,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes='(max-width: 768px) 40px, 48px'
        className={cn('object-cover', imageClassName)}
      />
    </div>
  );
};

export { Avatar };
