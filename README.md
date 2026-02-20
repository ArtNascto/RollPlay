# 🎲 RollPlay

**Descoberta musical futurista com Spotify**

RollPlay é uma PWA (Progressive Web App) que oferece formas únicas e divertidas de descobrir novas músicas no Spotify. Role dados 3D, explore países ou escolha seu mood — tudo com uma interface neon futurista otimizada para telas AMOLED.

![RollPlay](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwind-css)

## ✨ Funcionalidades

### 🎲 Dice Roll
- Selecione de 1 a 6 gêneros musicais
- O tipo de dado muda automaticamente (D3, D4, D6, D8, D12, D20)
- Animação 3D realista do dado usando Three.js
- Resultado influencia o "exotismo" da playlist

### 🌍 Descoberta por País
- Explore músicas de mais de 50 países
- Opção de país aleatório
- Busca e filtro de países
- Interface com bandeiras emoji

### 💜 Descoberta por Mood
- 6 moods disponíveis: Energético, Melancólico, Relaxado, Festivo, Focado, Romântico
- Integração opcional com GPT-4 para personalização avançada
- Fallback local quando OpenAI API não está configurada
- Cada mood tem sua cor neon característica

### 🎵 Resultado & Player
- Lista de 30-40 músicas descobertas
- Preview de 30 segundos (quando disponível)
- Remover músicas individualmente
- Re-gerar playlist com novos resultados
- Salvar diretamente no Spotify

## 🚀 Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS com paleta neon customizada
- **3D**: React Three Fiber + Drei + Three.js
- **Autenticação**: Spotify OAuth com iron-session (server-side only)
- **PWA**: @ducanh2912/next-pwa
- **IA (opcional)**: OpenAI GPT-4

## 🎨 Design

Interface dark sci-fi com paleta neon roxa otimizada para AMOLED:
- Background principal: `#0A0A0F` (quase preto puro)
- Roxos neon: `#8B5CF6`, `#A855F7`, `#C084FC`
- Acentos tech: `#22D3EE` (cyan), `#FB7185` (pink), `#A3E635` (lime)
- Efeitos glow em elementos interativos
- Gradientes estratégicos em CTAs

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ e npm
- Conta Spotify Developer
- (Opcional) OpenAI API Key

### Passo a passo

1. **Clone o repositório**
```bash
git clone <repo-url>
cd rollplay
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo de exemplo:
```bash
cp .env.local.example .env.local
```

Edite `.env.local` e preencha:
```env
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/callback
SESSION_PASSWORD=senha_aleatoria_minimo_32_caracteres
OPENAI_API_KEY=sk-sua_chave_opcional
```

4. **Configure o Spotify Dashboard**

- Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Crie um novo app (ou use existente)
- Em "Settings", adicione a Redirect URI:
  - Local: `http://localhost:3001/api/auth/callback`
  - Produção: `https://seu-dominio.vercel.app/api/auth/callback`
- Copie o Client ID e Client Secret

5. **Gere uma senha de sessão segura**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use o resultado como `SESSION_PASSWORD`.

6. **Execute o projeto**

```bash
npm run dev
```

Abra [http://localhost:3001](http://localhost:3001) no navegador.

## 📱 Instalação no Android

1. Abra o app no **Chrome** (Android)
2. Toque no menu (três pontinhos)
3. Selecione **"Adicionar à tela inicial"** ou **"Instalar app"**
4. O RollPlay será instalado como app standalone

## 🚢 Deploy na Vercel

1. **Conecte seu repositório**
```bash
vercel
```

2. **Configure as variáveis de ambiente**

No dashboard da Vercel, adicione todas as env vars (exceto `SPOTIFY_REDIRECT_URI` — ajuste para o domínio de produção):
```
SPOTIFY_REDIRECT_URI=https://seu-projeto.vercel.app/api/auth/callback
```

3. **Atualize o Spotify Dashboard**

Adicione a nova Redirect URI de produção no Spotify Developer Dashboard.

4. **Deploy**
```bash
vercel --prod
```

## 🔒 Segurança

- ✅ Tokens **NUNCA** vão para o client
- ✅ `client_secret` só é usado no servidor
- ✅ Sessão armazenada em cookie HttpOnly criptografado (iron-session)
- ✅ Refresh automático de tokens sem expor credenciais
- ✅ Estado CSRF protegido durante OAuth flow

## 🧪 Checklist de Testes

### Autenticação
- [ ] Login via Spotify funciona
- [ ] Callback redireciona corretamente
- [ ] Token é renovado automaticamente ao expirar
- [ ] Logout limpa a sessão

### Dice Roll
- [ ] 1 gênero → exibe D3
- [ ] 2 gêneros → exibe D4
- [ ] 3 gêneros → exibe D6
- [ ] 4 gêneros → exibe D8
- [ ] 5 gêneros → exibe D12
- [ ] 6 gêneros → exibe D20
- [ ] Animação 3D funciona suavemente
- [ ] Resultado aparece após animação
- [ ] Navega para página de resultado

### País
- [ ] Lista de países carrega
- [ ] Busca filtra países corretamente
- [ ] Botão "Random" seleciona país aleatório
- [ ] Descoberta gera playlist temática

### Mood
- [ ] 6 cards de mood aparecem
- [ ] Seleção ativa perfil de mood
- [ ] Com OPENAI_API_KEY: GPT gera keywords
- [ ] Sem OPENAI_API_KEY: usa fallback local
- [ ] Geração funciona em ambos os casos

### Resultado
- [ ] Exibe 30-40 músicas
- [ ] Preview de 30s funciona (quando disponível)
- [ ] Botão "Abrir no Spotify" aparece quando sem preview
- [ ] Remover música funciona
- [ ] Re-gerar cria nova playlist
- [ ] Salvar no Spotify cria playlist corretamente
- [ ] Link da playlist criada funciona

### PWA
- [ ] Manifest carregado corretamente
- [ ] Instalação no Android funciona
- [ ] App abre como standalone (sem barra de navegador)
- [ ] Ícones aparecem corretamente

### UI/UX
- [ ] Paleta neon roxa aplicada em todo o app
- [ ] Efeitos glow em elementos interativos
- [ ] Gradientes somente em CTAs e headers
- [ ] Transitions suaves (150-200ms)
- [ ] Bottom nav fixo e responsivo
- [ ] Design mobile-first responsivo

### Setup
- [ ] Página /setup mostra env vars corretamente
- [ ] Redirect URI atual é exibida
- [ ] Status ✓/✗ para cada variável

## 📁 Estrutura do Projeto

```
rollplay/
├── app/
│   ├── api/
│   │   ├── auth/          # Login, callback, logout
│   │   ├── spotify/       # Generate, create-playlist
│   │   └── ai/            # Mood profile (GPT)
│   ├── roll/              # Página Dice Roll
│   ├── country/           # Página País
│   ├── mood/              # Página Mood
│   ├── result/            # Página resultado
│   ├── profile/           # Página perfil
│   ├── setup/             # Página configuração
│   ├── login/             # Página login
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Home
│   └── globals.css        # Estilos globais
├── components/
│   ├── Dice3D.tsx         # Componente dado 3D
│   ├── Button.tsx         # Botão reutilizável
│   ├── Card.tsx           # Card reutilizável
│   ├── Loading.tsx        # Spinner
│   └── ErrorMessage.tsx   # Erro
├── lib/
│   ├── session.ts         # iron-session config
│   ├── spotify.ts         # Spotify API wrappers
│   ├── genres.ts          # Lista de gêneros
│   ├── countries.ts       # Lista de países
│   ├── dice.ts            # Lógica dos dados
│   └── moods.ts           # Definições de mood
├── types/
│   └── index.ts           # TypeScript types
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── icon-192.png       # Ícone PWA 192x192
│   └── icon-512.png       # Ícone PWA 512x512
├── .env.local.example     # Exemplo de env vars
├── next.config.js         # Config Next.js + PWA
├── tailwind.config.ts     # Config Tailwind + paleta
└── package.json           # Dependências
```

## 🎯 Roadmap Futuro

- [ ] Histórico de playlists geradas (opcional)
- [ ] Compartilhar playlist gerada (link direto)
- [ ] Mais tipos de dados (D100?)
- [ ] Animações de transição entre páginas
- [ ] Dark/Light mode toggle
- [ ] Suporte a outros idiomas

## 🐛 Problemas Conhecidos

- **Preview limitado**: Nem todas as músicas do Spotify têm preview de 30s disponível
- **Search API limit**: Spotify limita buscas a 10 resultados por query (2026) — usamos múltiplas queries para compensar
- **Token expiry**: Se o refresh token expirar (>1h inativo), usuário precisa fazer login novamente

## 📄 Licença

MIT

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças grandes, abra uma issue primeiro para discutir o que você gostaria de mudar.

---

**Feito com 💜 usando Next.js, Three.js e Spotify API**
