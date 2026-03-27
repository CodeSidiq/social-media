// src/app/not-found.tsx

import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="max-w-xl space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Page not found.
        </h1>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Back to app entry
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
