import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Card from '@/components/Card';

export default async function Home() {
  const session = await getSession();
  
  if (!session.accessToken) {
    redirect('/login');
  }

  return (
    <div className="min-h-full px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-gradient-hero mb-4">
            RollPlay
          </h1>
          <p className="text-text-secondary text-lg">
            Descubra músicas de formas únicas e futuristas
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dice Roll Mode */}
          <Link href="/roll">
            <Card hover className="h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🎲</div>
                <h3 className="text-2xl font-bold text-gradient-hero mb-2">
                  Dice Roll
                </h3>
                <p className="text-text-secondary text-sm">
                  Role o dado (D3-D20) e deixe a sorte guiar sua descoberta musical
                </p>
              </div>
            </Card>
          </Link>

          {/* Country Mode */}
          <Link href="/country">
            <Card hover className="h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold text-gradient-tech mb-2">
                  País
                </h3>
                <p className="text-text-secondary text-sm">
                  Explore músicas de diferentes países e culturas
                </p>
              </div>
            </Card>
          </Link>

          {/* Mood Mode */}
          <Link href="/mood">
            <Card hover className="h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">💜</div>
                <h3 className="text-2xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #A855F7 0%, #C084FC 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Mood
                </h3>
                <p className="text-text-secondary text-sm">
                  Descubra músicas baseadas no seu humor atual
                </p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Welcome Message */}
        {session.user && (
          <div className="mt-8 text-center">
            <p className="text-text-muted">
              Bem-vindo, <span className="text-neon-violet font-medium">{session.user.displayName}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
