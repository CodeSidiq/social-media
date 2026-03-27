// src/components/ui/ToastMessage.tsx
'use client';

import { X } from 'lucide-react';

type ToastMessageVariant = 'success';

type ToastMessageProps = Readonly<{
  message: string;
  variant?: ToastMessageVariant;
  onClose?: () => void;
  className?: string;
}>;

const variantClassNameMap: Record<ToastMessageVariant, string> = {
  success: 'bg-success text-success-foreground',
};

const ToastMessage = ({
  message,
  variant = 'success',
  onClose,
  className = '',
}: ToastMessageProps) => {
  const wrapperClassName = `${variantClassNameMap[variant]} flex min-h-10 w-[18.1875rem] items-center justify-between gap-3 rounded-md px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.18)] ${className}`.trim();

  return (
    <div
      className={wrapperClassName}
      role='status'
      aria-live='polite'
      aria-atomic='true'
    >
      <p className='truncate text-sm font-medium leading-5'>{message}</p>

      <button
        type='button'
        onClick={onClose}
        aria-label='Close notification'
        className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-success-foreground/90 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-foreground/70 focus-visible:ring-offset-2 focus-visible:ring-offset-success'
      >
        <X className='h-3.5 w-3.5' strokeWidth={2.25} />
      </button>
    </div>
  );
};

export default ToastMessage;
