# 🚀 Deploy na Vercel

## Configuração de Variáveis de Ambiente

Antes de fazer o deploy, configure as variáveis de ambiente na Vercel:

### 1. Acesse as Configurações do Projeto

- Vá para o [Dashboard da Vercel](https://vercel.com/dashboard)
- Selecione seu projeto RollPlay
- Clique em **Settings** → **Environment Variables**

### 2. Adicione as Seguintes Variáveis

```bash
# Spotify Credentials
SPOTIFY_CLIENT_ID=86a04db0b2244346a6e6a9ee764d6a64
SPOTIFY_CLIENT_SECRET=abc160f014d74a1a90bff44e1de79402

# Redirect URI (IMPORTANTE: use o domínio da Vercel)
SPOTIFY_REDIRECT_URI=https://seu-projeto.vercel.app/api/auth/callback

# Session Password (32+ caracteres)
SESSION_PASSWORD=a11849785659c47f6db3662d9fef9bf73719fee76175d510db68db05eb2cd38f

# OpenAI API Key (opcional)
OPENAI_API_KEY=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
```

### 3. Atualize o Spotify Dashboard

**IMPORTANTE:** Adicione a URL de produção no Spotify Developer Dashboard:

1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Selecione sua aplicação
3. Clique em **Edit Settings**
4. Em **Redirect URIs**, adicione:
   ```
   https://seu-projeto.vercel.app/api/auth/callback
   ```
5. Clique em **Save**

### 4. Deploy

Após configurar as variáveis de ambiente e o Redirect URI no Spotify:

```bash
# Commit suas alterações
git add .
git commit -m "fix: add Suspense boundary to result page"

# Push para o repositório
git push origin main
```

A Vercel fará o deploy automaticamente.

### 5. Verificação Pós-Deploy

Após o deploy bem-sucedido:

1. ✅ Acesse `https://seu-projeto.vercel.app`
2. ✅ Teste o login com Spotify
3. ✅ Teste os 3 modos (Dice Roll, Country, Mood)
4. ✅ Verifique se as playlists são criadas corretamente

## Troubleshooting

### Erro: "Invalid redirect_uri"

- Certifique-se de que o `SPOTIFY_REDIRECT_URI` na Vercel corresponde **exatamente** ao URI configurado no Spotify Dashboard
- Ambos devem usar HTTPS: `https://seu-projeto.vercel.app/api/auth/callback`

### Erro: "Missing environment variables"

- Verifique se todas as variáveis obrigatórias estão configuradas na Vercel
- Variáveis obrigatórias: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`, `SESSION_PASSWORD`

### PWA não funciona

- PWA requer HTTPS (Vercel fornece automaticamente)
- Certifique-se de que os ícones estão em `/public`: `icon-192.png` e `icon-512.png`

## Domínio Personalizado (Opcional)

Se você configurou um domínio personalizado:

1. Atualize `SPOTIFY_REDIRECT_URI` na Vercel para: `https://seu-dominio.com/api/auth/callback`
2. Adicione esse URI no Spotify Dashboard
3. Re-deploy o projeto

## Logs e Debugging

Para ver os logs do servidor na Vercel:

1. Vá para o projeto na Vercel
2. Clique na aba **Deployments**
3. Selecione o deployment
4. Clique em **Functions** para ver os logs das API Routes
