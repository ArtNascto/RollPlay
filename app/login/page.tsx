'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'unauthorized':
        return 'Acesso não autorizado. Esta aplicação é de uso privado.';
      case 'access_denied':
        return 'Você negou o acesso. É necessário autorizar para continuar.';
      case 'state_mismatch':
        return 'Erro de segurança. Tente novamente.';
      case 'token_exchange':
        return 'Erro ao autenticar. Tente novamente.';
      case 'no_code':
        return 'Erro na resposta do Spotify. Tente novamente.';
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card variant="surface-2" className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gradient-hero mb-4">
            RollPlay
          </h1>
          <p className="text-text-secondary text-lg">
            Descoberta musical futurista com Spotify
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-error bg-opacity-20 border border-error rounded-lg">
            <p className="text-error text-sm font-medium">
              ⚠️ {errorMessage}
            </p>
          </div>
        )}

        <div className="mb-8">
          <div className="text-7xl mb-6">🎲</div>
          <p className="text-text-secondary mb-2">
            Role o dado e descubra novas músicas
          </p>
          <p className="text-text-muted text-sm">
            Conecte sua conta Spotify para começar
          </p>
        </div>

        <a href="/api/auth/login">
          <Button variant="secondary" className="w-full text-lg py-4">
            <span className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Entrar com Spotify
            </span>
          </Button>
        </a>

        <p className="text-text-muted text-xs mt-6">
          Ao entrar, você concorda em compartilhar informações básicas da sua conta Spotify
        </p>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Carregando...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
