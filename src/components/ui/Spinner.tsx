// src/components/ui/Spinner.tsx

type SpinnerProps = Readonly<{
  className?: string;
}>;

const Spinner = ({ className = '' }: SpinnerProps) => {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`.trim()}>
      <div className='h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground' />
    </div>
  );
};

export default Spinner;
