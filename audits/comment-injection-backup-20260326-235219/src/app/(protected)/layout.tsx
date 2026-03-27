// src/app/(protected)/layout.tsx

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
