'use client';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-surface-2"></div>
        <div className="absolute inset-0 rounded-full border-4 border-neon-violet border-t-transparent animate-spin shadow-glow-primary"></div>
      </div>
    </div>
  );
}
