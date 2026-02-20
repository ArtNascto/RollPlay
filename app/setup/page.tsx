import Card from '@/components/Card';

export default function SetupPage() {
  const envVars = [
    {
      name: 'SPOTIFY_CLIENT_ID',
      value: process.env.SPOTIFY_CLIENT_ID,
      required: true,
    },
    {
      name: 'SPOTIFY_CLIENT_SECRET',
      value: process.env.SPOTIFY_CLIENT_SECRET,
      required: true,
    },
    {
      name: 'SPOTIFY_REDIRECT_URI',
      value: process.env.SPOTIFY_REDIRECT_URI,
      required: true,
    },
    {
      name: 'SESSION_PASSWORD',
      value: process.env.SESSION_PASSWORD,
      required: true,
    },
    {
      name: 'OPENAI_API_KEY',
      value: process.env.OPENAI_API_KEY,
      required: false,
    },
  ];

  const currentRedirectUri = process.env.SPOTIFY_REDIRECT_URI || 'Not configured';

  return (
    <div className="min-h-full px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-tech mb-2">
            Configuração
          </h1>
          <p className="text-text-secondary">
            Status das variáveis de ambiente
          </p>
        </div>

        {/* Redirect URI */}
        <Card variant="surface-2" className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Redirect URI Atual
          </h3>
          <div className="bg-surface-1 rounded-lg p-4 mb-3">
            <code className="text-cyan-tech text-sm break-all font-mono">
              {currentRedirectUri}
            </code>
          </div>
          <p className="text-text-muted text-sm">
            Certifique-se de adicionar esta URI no Spotify Dashboard em{' '}
            <a
              href="https://developer.spotify.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-tech hover:underline"
            >
              developer.spotify.com/dashboard
            </a>
          </p>
        </Card>

        {/* Environment Variables */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Variáveis de Ambiente
          </h3>
          <div className="space-y-3">
            {envVars.map((envVar) => {
              const isConfigured = Boolean(envVar.value);
              const statusColor = isConfigured ? 'lime-neon' : envVar.required ? 'error' : 'amber';
              const statusIcon = isConfigured ? '✓' : envVar.required ? '✗' : '○';

              return (
                <div
                  key={envVar.name}
                  className="flex items-center justify-between bg-surface-2 rounded-lg p-4"
                >
                  <div>
                    <code className="text-text-primary font-mono text-sm">
                      {envVar.name}
                    </code>
                    {!envVar.required && (
                      <span className="ml-2 text-text-muted text-xs">(opcional)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-${statusColor} font-bold text-lg`}>
                      {statusIcon}
                    </span>
                    <span className={`text-${statusColor} text-sm font-medium`}>
                      {isConfigured ? 'Configurado' : 'Não configurado'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Instructions */}
        <Card variant="surface-2">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Como Configurar
          </h3>
          <ol className="space-y-2 text-text-secondary text-sm list-decimal list-inside">
            <li>Crie um arquivo <code className="text-cyan-tech">.env.local</code> na raiz do projeto</li>
            <li>Copie o conteúdo de <code className="text-cyan-tech">.env.local.example</code></li>
            <li>Preencha as variáveis com seus valores reais</li>
            <li>
              Obtenha credenciais do Spotify em{' '}
              <a
                href="https://developer.spotify.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-tech hover:underline"
              >
                developer.spotify.com
              </a>
            </li>
            <li>Reinicie o servidor de desenvolvimento</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
