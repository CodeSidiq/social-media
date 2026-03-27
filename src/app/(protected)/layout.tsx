// src/app/(protected)/layout.tsx
/**
 * Protected route-group layout.
 * Wraps authenticated application surfaces with the protected shell.
 * Global protected layout behavior should be composed here, not inside page files.
 */


import type { ReactNode } from 'react';

import AuthSessionGate from '@/components/auth/AuthSessionGate';
import AppShell from '@/components/layout/AppShell';

type ProtectedLayoutProps = Readonly<{
  children: ReactNode;
}>;

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <AuthSessionGate>
      <AppShell>{children}</AppShell>
    </AuthSessionGate>
  );
};

export default ProtectedLayout;
