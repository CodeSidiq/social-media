// src/app/error.tsx

'use client';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="max-w-xl space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-destructive">
          Application error
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Something went wrong.
        </h1>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          {error.message || 'An unexpected error occurred while rendering the application.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
};

export default GlobalError;
