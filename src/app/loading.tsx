// src/app/loading.tsx

const GlobalLoading = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-muted-foreground">Loading application</p>
        <p className="text-base font-semibold">Please wait...</p>
      </div>
    </main>
  );
};

export default GlobalLoading;
