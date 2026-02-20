# 🔒 Configurando HTTPS Local - RollPlay

## Por que HTTPS localmente?

O Spotify pode exigir HTTPS mesmo em desenvolvimento local. HTTPS também é necessário para testar recursos PWA completos.

## 🚀 Setup Rápido

### 1. Gerar Certificados SSL

```bash
npm run generate-certs
```

Este comando irá:
- Tentar usar `mkcert` (se instalado)
- Caso contrário, usar `OpenSSL`
- Criar pasta `/certs` com `localhost.key` e `localhost.crt`

### 2. Atualizar Spotify Dashboard

No [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):

1. Vá em **Settings** do seu app
2. Em **Redirect URIs**, adicione:
   ```
   https://localhost:3001/api/auth/callback
   ```
3. Clique em **Save**

### 3. Verificar .env

Certifique-se que seu `.env` ou `.env.local` tem:

```env
SPOTIFY_REDIRECT_URI=https://localhost:3001/api/auth/callback
```

### 4. Rodar com HTTPS

```bash
npm run dev:https
```

O servidor estará disponível em: **https://localhost:3001**

## ⚠️ Primeiro Acesso

Na primeira vez, seu navegador mostrará um aviso de segurança. Isso é **normal** porque o certificado é auto-assinado.

### Como aceitar:

**Chrome:**
1. Clique em "Advanced" (Avançado)
2. Clique em "Proceed to localhost (unsafe)"

**Firefox:**
1. Clique em "Advanced" (Avançado)  
2. Clique em "Accept the Risk and Continue"

**Edge:**
1. Clique em "Advanced"
2. Clique em "Continue to localhost (unsafe)"

## 📱 Testar no Celular (mesma rede Wi-Fi)

1. Descubra seu IP local:
   ```bash
   ipconfig
   ```
   Procure por `IPv4 Address` na seção `Wi-Fi`

2. No Spotify Dashboard, adicione também:
   ```
   https://SEU_IP:3001/api/auth/callback
   ```

3. No `.env`, você pode usar o IP:
   ```env
   SPOTIFY_REDIRECT_URI=https://192.168.1.100:3001/api/auth/callback
   ```

4. No celular, acesse: `https://SEU_IP:3001`
   - Aceite o certificado (mesmo processo do desktop)

## 🔧 Troubleshooting

### "mkcert not found" e "openssl not found"

**Solução 1: Instalar mkcert (Recomendado)**
```bash
# Windows (com Chocolatey)
choco install mkcert

# Ou baixe: https://github.com/FiloSottile/mkcert/releases
```

**Solução 2: Usar OpenSSL**
```bash
# Windows (com Chocolatey)
choco install openssl

# Ou use Git Bash (vem com Git for Windows)
```

**Solução 3: Usar WSL**
```bash
wsl openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj "/CN=localhost" -keyout certs/localhost.key -out certs/localhost.crt -days 365
```

### Certificado expirado (após 365 dias)

Regenere os certificados:
```bash
# Deletar certificados antigos
rm -rf certs

# Gerar novos
npm run generate-certs
```

### Ainda não funciona?

Use o modo HTTP normal temporariamente:
```bash
# .env
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/callback

# Rodar
npm run dev
```

Lembre-se de atualizar o Spotify Dashboard também!

## 📚 Mais Informações

- [mkcert Documentation](https://github.com/FiloSottile/mkcert)
- [Spotify OAuth Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
- [Next.js Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)

## 🔐 Segurança

- Os certificados são apenas para **desenvolvimento local**
- Nunca faça commit dos arquivos em `/certs/`
- Para produção, use certificados válidos (Let's Encrypt via Vercel)
