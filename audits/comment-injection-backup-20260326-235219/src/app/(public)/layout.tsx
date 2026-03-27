// src/app/(public)/layout.tsx

import type { ReactNode } from 'react';

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return <>{children}</>;
};

export default PublicLayout;
