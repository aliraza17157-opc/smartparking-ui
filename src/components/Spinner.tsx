export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block w-5 h-5 border-2 border-current border-r-transparent rounded-full animate-spin ${className}`}
      aria-label="loading"
    />
  );
}
