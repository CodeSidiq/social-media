// src/components/layout/ShellContainer.tsx

import type { ReactNode } from 'react';

type ShellContainerProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

const ShellContainer = ({ children, className = '' }: ShellContainerProps) => {
  const classes = ['mx-auto w-full max-w-[74.125rem] px-4 sm:px-6', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};

export default ShellContainer;
