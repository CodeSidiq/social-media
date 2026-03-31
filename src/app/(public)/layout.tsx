// src/app/(public)/layout.tsx

import type { ReactNode } from 'react';

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className='min-h-screen bg-shell-background text-foreground'>
      {children}
    </div>
  );
};

export default PublicLayout;
