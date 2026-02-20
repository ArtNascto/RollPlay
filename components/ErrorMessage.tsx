'use client';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-surface-2 border border-error rounded-xl p-6 text-center">
      <div className="text-error text-5xl mb-4">⚠️</div>
      <h3 className="text-text-primary text-lg font-semibold mb-2">
        Oops! Algo deu errado
      </h3>
      <p className="text-text-secondary mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gradient-tech rounded-lg text-text-primary font-medium hover:shadow-glow-cyan transition-all"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
