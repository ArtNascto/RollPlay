import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';

async function handleLogout() {
  'use server';
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/auth/logout`, {
    method: 'POST',
  });
  redirect('/login');
}

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session.accessToken) {
    redirect('/login');
  }

  return (
    <div className="min-h-full px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-hero mb-2">
            Perfil
          </h1>
          <p className="text-text-secondary">
            Informações da sua conta
          </p>
        </div>

        {/* User Info */}
        <Card variant="surface-2" className="mb-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
              👤
            </div>
            {session.user && (
              <>
                <h2 className="text-2xl font-bold text-text-primary mb-1">
                  {session.user.displayName}
                </h2>
                <p className="text-text-secondary text-sm mb-4">
                  {session.user.email}
                </p>
                <p className="text-text-muted text-xs">
                  ID: {session.user.id}
                </p>
              </>
            )}
          </div>
        </Card>

        {/* App Info */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Sobre o RollPlay
          </h3>
          <div className="space-y-3 text-text-secondary text-sm">
            <p>
              🎲 <strong>Dice Roll:</strong> Role dados de D3 a D20 baseados nos gêneros selecionados
            </p>
            <p>
              🌍 <strong>País:</strong> Explore músicas de diferentes culturas ao redor do mundo
            </p>
            <p>
              💜 <strong>Mood:</strong> Descubra músicas baseadas no seu humor com auxílio de IA
            </p>
          </div>
        </Card>

        {/* Setup Link */}
        <a href="/setup">
          <Card hover className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Configuração
                </h3>
                <p className="text-text-muted text-sm">
                  Ver variáveis de ambiente e setup
                </p>
              </div>
              <span className="text-neon-violet text-2xl">→</span>
            </div>
          </Card>
        </a>

        {/* Logout Button */}
        <form action={handleLogout}>
          <Button
            variant="outline"
            type="submit"
            className="w-full border-error text-error hover:bg-error hover:text-white"
          >
            Sair da conta
          </Button>
        </form>
      </div>
    </div>
  );
}
