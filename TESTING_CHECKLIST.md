# 🧪 RollPlay - Checklist de Testes

Use este checklist para validar que todas as funcionalidades estão funcionando corretamente.

## ✅ Pré-requisitos

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env.local` configurado com todas as variáveis
- [ ] Spotify App criado com Redirect URI configurada
- [ ] Servidor rodando (`npm run dev`)

---

## 🔐 Autenticação Spotify

### Login
- [ ] **Acesso à página /login**
  - Exibe logo "RollPlay" com gradiente
  - Botão "Entrar com Spotify" visível com gradiente cyan-tech
  - Ícone do Spotify aparece no botão

- [ ] **Clique no botão de login**
  - Redireciona para `accounts.spotify.com/authorize`
  - Mostra tela de permissões do Spotify
  - Solicita permissões corretas (playlist-modify-public, playlist-modify-private, user-read-email)

- [ ] **Após aprovar no Spotify**
  - Redireciona de volta para a aplicação
  - Redireciona para home (/)
  - Mostra nome do usuário na home

### Sessão
- [ ] **Token refresh automático**
  - Aguarde 1 hora (ou force expiração no código)
  - Faça uma ação que requer API (gerar playlist)
  - Token deve ser renovado automaticamente sem pedir novo login

- [ ] **Logout**
  - Vá para /profile
  - Clique em "Sair da conta"
  - Sessão é destruída
  - Redireciona para /login

---

## 🎲 Modo Dice Roll

### Seleção de Gêneros
- [ ] **Nenhum gênero selecionado**
  - Mostra "Selecione gêneros para começar"
  - Contador mostra "0 gêneros selecionados"
  - Botão "Rolar" está desabilitado
  - Dado mostra D3 (padrão)

- [ ] **1 gênero selecionado**
  - Contador atualiza para "1 gênero selecionado"
  - Dado muda para D3
  - Texto mostra "Dado atual: D3"
  - Botão "Rolar D3" habilitado

- [ ] **2 gêneros selecionados**
  - Dado muda para D4
  - Texto mostra "Dado atual: D4"

- [ ] **3 gêneros selecionados**
  - Dado muda para D6

- [ ] **4 gêneros selecionados**
  - Dado muda para D8

- [ ] **5 gêneros selecionados**
  - Dado muda para D12

- [ ] **6 gêneros selecionados**
  - Dado muda para D20
  - Texto mostra "Dado atual: D20"
  - Não permite selecionar mais gêneros (outros ficam disabled)

- [ ] **Desselecionar gêneros**
  - Clique em gênero selecionado para desselecionar
  - Contador e tipo de dado atualizam corretamente

### Animação 3D do Dado
- [ ] **Renderização 3D**
  - Dado renderiza com Three.js (geometria 3D visível)
  - Cor neon violet (#8B5CF6) com brilho emissivo
  - Iluminação roxo e cyan visível

- [ ] **Animação de rolagem**
  - Clique em "Rolar D{X}"
  - Dado rota suavemente por ~2.5 segundos
  - Animação tem easing (desacelera no final)
  - Múltiplos eixos de rotação (X, Y, Z)

- [ ] **Resultado**
  - Após animação, valor numérico aparece sobreposto
  - Resultado está entre 1 e número de faces do dado
  - Card com resultado tem borda neon-violet e glow
  - Após 1.5s, navega automaticamente para /result

### Página de Resultado
- [ ] **Navegação automática**
  - Após rolagem, redireciona para /result
  - URL contém parâmetros: mode=roll, genres, rollValue, diceFaces
  - Página carrega automaticamente a geração

---

## 🌍 Modo País

### Interface
- [ ] **Página /country carrega**
  - Título "Descoberta por País" com gradiente cyan-tech
  - Card "País Aleatório" visível no topo
  - Campo de busca presente
  - Grid de países aparece (2 colunas mobile, 3 desktop)

### País Aleatório
- [ ] **Botão "Sortear"**
  - Clique em "🎲 Sortear"
  - País aleatório é selecionado
  - Bandeira emoji e nome aparecem no card
  - Botão muda para estilo "primary" (selecionado)
  - Grid de países desaparece

- [ ] **Re-sortear**
  - Clique novamente em "Sortear"
  - Novo país aleatório é exibido
  - Pode repetir o mesmo país (comportamento esperado)

### Busca Manual
- [ ] **Campo de busca**
  - Digite nome de país (ex: "Brazil")
  - Lista filtra em tempo real
  - Busca é case-insensitive
  - Mostra países que contêm o termo

- [ ] **Seleção manual**
  - Clique em um país da lista
  - País fica destacado (background neon-violet + glow)
  - Modo aleatório desativa
  - Grid permanece visível

### Descoberta
- [ ] **Botão "Descobrir"**
  - Desabilitado quando nenhum país selecionado
  - Habilitado após seleção
  - Texto mostra "Descobrir Músicas de [País]"
  - Clique navega para /result com mode=country

---

## 💜 Modo Mood

### Interface
- [ ] **Página /mood carrega**
  - Título "Descoberta por Mood" com gradiente hero
  - Grid 2x3 de mood cards (mobile: 1 coluna, desktop: 3 colunas)
  - 6 moods: Energético, Melancólico, Relaxado, Festivo, Focado, Romântico
  - Cada card com emoji, nome e descrição

### Seleção de Mood
- [ ] **Clique em mood card**
  - Card fica destacado com borda da cor característica
  - Energético: pink-neon (#FB7185)
  - Melancólico: neon-violet (#8B5CF6)
  - Relaxado: cyan-tech (#22D3EE)
  - Festivo: neon-magenta (#A855F7)
  - Focado: cyan-tech (#22D3EE)
  - Romântico: neon-highlight (#C084FC)

- [ ] **Loading do perfil**
  - Após seleção, mostra spinner com glow
  - Texto "Gerando perfil musical..."
  - Dura 1-3 segundos

### Com OpenAI API Key
- [ ] **GPT-4 gerando perfil**
  - Após loading, card "Perfil Musical" aparece
  - Mostra: playlistName, playlistDescription
  - Keywords aparecem como badges cyan-tech
  - Conteúdo é criativo e relevante ao mood

### Sem OpenAI API Key
- [ ] **Fallback local**
  - Após loading, card "Perfil Musical" aparece
  - Usa templates hardcoded do lib/moods.ts
  - Keywords são as fallbackKeywords do mood
  - Nome e descrição são genéricos mas funcionais
  - **Não deve dar erro ou quebrar**

### Geração
- [ ] **Botão "Gerar Playlist"**
  - Desabilitado sem mood selecionado
  - Habilitado após seleção (com ou sem perfil carregado)
  - Clique navega para /result com mode=mood

---

## 🎵 Página de Resultado

### Carregamento
- [ ] **Estado de loading**
  - Spinner com glow aparece
  - Texto "Gerando sua playlist..."
  - Card surface-2 centralizado

### Geração de Playlist
- [ ] **Sucesso**
  - Exibe playlistName com gradiente hero
  - Mostra playlistDescription
  - Contador de músicas (30-40 tracks)
  - Lista de músicas aparece

- [ ] **30-40 músicas geradas**
  - Total entre 30 e 40 tracks
  - Todas únicas (sem duplicatas)
  - Vêm de múltiplas queries (ver seedInfo)

### Lista de Músicas
- [ ] **Cada track mostra**
  - Album art (ou ícone 🎵 se não houver)
  - Título da música (text-primary)
  - Artista (text-secondary)
  - Álbum (text-muted, truncado)

- [ ] **Remover música**
  - Botão ✕ em vermelho (error color)
  - Clique remove a música da lista
  - Contador atualiza
  - Música não volta (estado local)

### Preview de Áudio
- [ ] **Músicas COM preview**
  - Botão "▶️ Preview" visível
  - Clique abre player de áudio fixo no bottom
  - Player mostra título da música
  - Audio toca preview de 30s
  - Controles nativos HTML5 (play/pause/volume/seek)
  - Botão ✕ fecha o player

- [ ] **Músicas SEM preview**
  - Botão "Spotify" com cor cyan-tech
  - Clique abre música no Spotify (nova aba)
  - Link funciona corretamente

### Re-gerar
- [ ] **Botão "🔄 Re-gerar"**
  - Visível na barra de ações inferior
  - Clique refaz a chamada /api/spotify/generate
  - Usa os mesmos parâmetros (genres, country, mood, etc.)
  - Nova lista de 30-40 músicas aparece
  - Músicas são diferentes (nova busca)

### Salvar no Spotify
- [ ] **Botão "💾 Salvar no Spotify"**
  - Inicialmente habilitado
  - Clique chama /api/spotify/create-playlist
  - Texto muda para "💾 Salvando..."
  - Após sucesso: "✓ Salvo!"
  - Botão fica disabled
  - Link verde (lime-neon) aparece: "✓ Playlist criada! Abrir no Spotify →"

- [ ] **Link da playlist**
  - Clique abre playlist no Spotify (nova aba)
  - Playlist contém todas as músicas (exceto removidas)
  - Nome e descrição correspondem ao gerado
  - Playlist é pública

---

## 👤 Perfil & Setup

### Página /profile
- [ ] **Informações do usuário**
  - Avatar placeholder (emoji 👤)
  - Nome do usuário (displayName)
  - Email
  - ID do Spotify (text-muted)

- [ ] **Card "Sobre o RollPlay"**
  - Descrição dos 3 modos
  - Emojis e formatação corretos

- [ ] **Link para /setup**
  - Card hover com seta →
  - Clique navega para /setup

- [ ] **Botão "Sair da conta"**
  - Borda e texto vermelho (error)
  - Hover muda para background error
  - Clique faz logout e redireciona para /login

### Página /setup
- [ ] **Redirect URI atual**
  - Mostra URL configurada em cyan-tech monospace
  - Inclui link para Spotify Dashboard

- [ ] **Checklist de env vars**
  - 5 variáveis listadas:
    - SPOTIFY_CLIENT_ID (obrigatória)
    - SPOTIFY_CLIENT_SECRET (obrigatória)
    - SPOTIFY_REDIRECT_URI (obrigatória)
    - SESSION_PASSWORD (obrigatória)
    - OPENAI_API_KEY (opcional)
  
- [ ] **Status de cada variável**
  - ✓ verde (lime-neon) para configurado
  - ✗ vermelho (error) para obrigatória não configurada
  - ○ amarelo (amber) para opcional não configurada
  - Texto "Configurado" ou "Não configurado"

- [ ] **Instruções de setup**
  - Lista numerada de passos
  - Links funcionais
  - Formatação legível

---

## 📱 PWA (Progressive Web App)

### Manifest
- [ ] **Arquivo /public/manifest.json existe**
  - name: "RollPlay"
  - theme_color: "#8B5CF6"
  - background_color: "#0A0A0F"
  - display: "standalone"
  - Ícones 192x192 e 512x512 referenciados

### Meta Tags
- [ ] **Layout raiz (/app/layout.tsx)**
  - viewport com width=device-width
  - theme-color: #8B5CF6
  - apple-mobile-web-app-capable
  - Link para manifest.json

### Instalação (Android Chrome)
- [ ] **Banner de instalação aparece**
  - Abra no Chrome Android
  - Banner "Adicionar à tela inicial" ou "Instalar" aparece
  - (Pode demorar alguns segundos ou não aparecer se já instalado)

- [ ] **Instalação manual**
  - Menu do Chrome (três pontinhos)
  - Opção "Adicionar à tela inicial" ou "Instalar app"
  - Clique instala o app

- [ ] **Após instalação**
  - Ícone aparece na home screen do Android
  - Clique abre app sem barra de navegador (standalone)
  - Status bar tem cor #8B5CF6

---

## 🎨 UI/UX & Design

### Paleta de Cores
- [ ] **Background principal**
  - #0A0A0F (quase preto puro, AMOLED friendly)
  - Radial gradients sutis (roxo + cyan)

- [ ] **Cards**
  - surface-1: #141022
  - surface-2: #1B1430
  - Bordas: #2A2142

- [ ] **Texto**
  - Primário: #F3F1FF (quase branco)
  - Secundário: #B9B1D6 (cinza claro)
  - Muted: #7E769C (cinza escuro)

- [ ] **Neon accents**
  - Roxo: #8B5CF6, #A855F7, #C084FC
  - Cyan: #22D3EE
  - Pink: #FB7185
  - Lime: #A3E635

### Gradientes
- [ ] **Apenas em CTAs e headers**
  - Títulos principais usam gradient-hero ou gradient-tech
  - Botões primários têm gradientes
  - Cards normais NÃO têm gradientes (apenas cor sólida)

### Efeitos Glow
- [ ] **Elementos interativos**
  - Botões hover: glow-primary ou glow-cyan
  - Cards selecionados: glow-primary
  - Dado 3D: glow emissivo
  - Moods selecionados: glow da cor característica

- [ ] **Elementos estáticos NÃO têm glow**
  - Cards de informação sem hover
  - Texto normal
  - Backgrounds

### Responsividade
- [ ] **Mobile (< 640px)**
  - Bottom nav fixo e visível
  - Cards empilham verticalmente
  - Texto legível (min 14px)
  - Botões touch-friendly (min 44px altura)
  - Sem scroll horizontal

- [ ] **Tablet (640px - 1024px)**
  - Grid 2 colunas nos mode cards
  - Layout intermediário

- [ ] **Desktop (> 1024px)**
  - Max-width 1024px (conteúdo centralizado)
  - Grid 3 colunas nos moods
  - Hover states visíveis

### Bottom Navigation
- [ ] **Sempre visível**
  - Fixo no bottom
  - Não some ao scrollar
  - Z-index alto (acima do conteúdo)

- [ ] **Itens**
  - Home e Profile
  - Ícones SVG
  - Labels "Home" e "Profile"
  - Cor: text-secondary por padrão
  - Hover/active: neon-violet

### Transições
- [ ] **Suaves (150-200ms)**
  - Hover em cards
  - Mudança de cor em botões
  - Borders animados
  - Não afeta performance em mobile

---

## 🐛 Tratamento de Erros

### Auth errors
- [ ] **Login falha**
  - Mostra mensagem de erro amigável
  - Permite tentar novamente

- [ ] **Token expirado**
  - Refresh automático funciona
  - Ou redireciona para login se refresh falhar

### API errors
- [ ] **Geração falha**
  - Mostra ErrorMessage component
  - Botão "Tentar novamente" presente
  - Não quebra a página

- [ ] **Salvar playlist falha**
  - Alert com mensagem de erro
  - Permite tentar novamente

### Network errors
- [ ] **Sem internet**
  - Mensagens apropriadas
  - Não trava a aplicação

---

## ⚡ Performance

- [ ] **First Load < 3s**
  - Página inicial carrega rápido
  - Fontes e estilos não bloqueiam

- [ ] **Animações suaves**
  - Dado 3D a 60fps
  - Transições sem jank
  - Scroll suave

- [ ] **Images otimizadas**
  - Next.js Image component usado
  - Album arts carregam progressivamente

---

## 🔒 Segurança

- [ ] **Tokens no server**
  - Nenhum access_token aparece em requests do cliente
  - Client secret nunca exposto
  - Console do browser não mostra tokens

- [ ] **Cookies HttpOnly**
  - SessionCookie com httpOnly: true
  - Secure em produção
  - SameSite configurado

- [ ] **State CSRF**
  - Login usa state parameter
  - Callback verifica state
  - Previne ataques CSRF

---

## 📊 Funcionalidades Específicas do Spotify

### Search API
- [ ] **Limit máximo 10**
  - Cada query usa limit=10
  - Múltiplos offsets (0, 10, 20, 30)
  - Total 30-40 resultados combinados

### Playlist Creation
- [ ] **Usa /items endpoint**
  - POST /v1/playlists/{id}/items
  - Não usa /tracks (deprecated)
  - Batches de até 100 URIs

### Token Management
- [ ] **Expiração respeitada**
  - expiresAt armazenado em sessão
  - Refresh antes de expirar
  - Retry em caso de 401

---

## 🎯 Casos de Borda

- [ ] **Playlist com 0 músicas após remover tudo**
  - Botão "Salvar" desabilitado
  - Não quebra ao tentar salvar

- [ ] **Mood sem OPENAI_KEY**
  - Fallback local funciona
  - Não mostra erros de API

- [ ] **País/gênero sem resultados**
  - Mostra mensagem apropriada
  - Permite re-gerar

- [ ] **Preview audio durante navegação**
  - Player fecha ao mudar de página
  - Não continua tocando em background

---

## ✅ Finalização

Se todos os itens acima estão ✓, o RollPlay está **100% funcional** e pronto para:
- ✅ Uso local
- ✅ Deploy na Vercel
- ✅ Instalação como PWA no Android
- ✅ Demonstração para usuários

**Parabéns! 🎉**
