// src/components/layout/AppBottomDock.tsx
/**
 * Bottom navigation dock.
 * Reuses the same visual component for public and protected variants.
 * This dock must have a single clear owner and should not be duplicated at page level.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, User } from 'lucide-react';

import { cn } from '@/lib/utils';

type AppBottomDockProps = Readonly<{
  variant?: 'protected' | 'public';
}>;

type DockItem = Readonly<{
  href: string;
  label: string;
  icon: typeof Home;
  isPrimary?: boolean;
}>;

const PROTECTED_ITEMS: DockItem[] = [
  { href: '/timeline', label: 'Home', icon: Home },
  { href: '/posts/create', label: 'Create', icon: Plus, isPrimary: true },
  { href: '/profile', label: 'Profile', icon: User },
];

const PUBLIC_ITEMS: DockItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/auth/login', label: 'Login', icon: Plus, isPrimary: true },
  { href: '/auth/login', label: 'Profile', icon: User },
];

const AppBottomDock = ({
  variant = 'protected',
}: AppBottomDockProps) => {
  const pathname = usePathname();

  if (pathname === '/posts/create') {
    return null;
  }

  const items = variant === 'public' ? PUBLIC_ITEMS : PROTECTED_ITEMS;

  return (
    <div className='fixed inset-x-0 bottom-6 z-40 flex justify-center'>
      <nav className='w-[27.5rem] max-w-[calc(100vw-2rem)] rounded-full border border-border/80 bg-card/95 px-6 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.28)] backdrop-blur'>
        <ul className='grid grid-cols-3 items-center'>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/timeline'
                ? pathname === '/timeline'
                : pathname === item.href;

            if (item.isPrimary) {
              return (
                <li key={item.href} className='flex justify-center'>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className='inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(127,81,249,0.45)] transition-transform hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Icon className='size-7' strokeWidth={2.2} />
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.href} className='flex justify-center'>
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex min-w-[5.5rem] flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className='size-5' strokeWidth={2.1} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AppBottomDock;
