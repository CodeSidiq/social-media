// src/app/(public)/layout.tsx
/**
 * Public route-group layout.
 * Wraps unauthenticated or public-facing surfaces outside the protected app shell.
 * Public pages should stay visually aligned without leaking protected behavior.
 */


import type { ReactNode } from 'react';

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return <>{children}</>;
};

export default PublicLayout;
