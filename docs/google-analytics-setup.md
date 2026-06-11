# Integração com o Google Analytics 4 — guia de configuração

Usa a **Google Analytics Data API (GA4)** com OAuth. Diferente do Google Ads,
**não precisa de developer token nem aprovação** — funciona assim que você
autorizar. Reutiliza o mesmo OAuth client (projeto Google Cloud) do Google Ads.

## Variáveis (.env.local)

| Variável | O que é |
|---|---|
| `GOOGLE_ANALYTICS_PROPERTY_ID` | ID **numérico** da propriedade GA4 (ex.: `123456789`) |
| `GOOGLE_ANALYTICS_REFRESH_TOKEN` | Gerado pelo fluxo OAuth (passo 3) |
| `GOOGLE_ADS_CLIENT_ID` / `GOOGLE_ADS_CLIENT_SECRET` | Reutilizados do Google Ads (já preenchidos) |

Reinicie o servidor (`npm run dev`) após alterar o `.env.local`.

---

## Passo 1 — Ativar a API e o redirect

1. No **Google Cloud Console** (mesmo projeto do Google Ads), vá em
   *APIs e serviços → Biblioteca*, busque **Google Analytics Data API** e clique **Ativar**.
2. Em *APIs e serviços → Credenciais*, abra o seu OAuth client (o mesmo do Google Ads)
   e em **URIs de redirecionamento autorizados** adicione:
   ```
   http://localhost:3000/api/google-analytics/callback
   ```
   Salve.

## Passo 2 — Descobrir o Property ID

1. Abra o **Google Analytics** (analytics.google.com).
2. Canto inferior esquerdo: **Administrador** (engrenagem).
3. Na coluna **Propriedade**, clique em **Configurações da propriedade**.
4. Copie o **ID da propriedade** (número, ex.: `123456789`) para
   `GOOGLE_ANALYTICS_PROPERTY_ID`.
   > ⚠️ Não confunda com o **ID de medição** (`G-XXXXXXX`) — a Data API usa o ID numérico.

## Passo 3 — Gerar o Refresh Token

1. Com o Client ID/Secret preenchidos e o servidor reiniciado, abra:
   ```
   http://localhost:3000/api/google-analytics/auth
   ```
   (ou o botão em **Marketing → Google Analytics → Integração → Conectar com Google**)
2. Faça login com a conta Google que tem acesso à propriedade GA4 e aceite.
3. Copie o `refresh_token` exibido para `GOOGLE_ANALYTICS_REFRESH_TOKEN`.
4. Reinicie o servidor.

---

## Testar

- Pela linha de comando: `node scripts/google-analytics-check.mjs` → deve mostrar
  **✅ CONECTADO** com usuários/sessões/receita dos últimos 7 dias.
- Na interface: **Marketing → Google Analytics** deve mostrar **🟢 Conectado** e as 6
  abas (Dashboard, Aquisição, Engajamento, Conversões, E-commerce, Tempo Real) com dados reais.

## Solução de problemas

| Mensagem | Causa provável |
|---|---|
| `Credenciais do Google Analytics não configuradas` | Falta `PROPERTY_ID` ou `REFRESH_TOKEN` no `.env.local` |
| `Falha ao renovar o access token OAuth` | Client ID/Secret ou refresh token inválidos |
| `User does not have sufficient permissions for this property` | A conta do refresh token não tem acesso à propriedade GA4, ou o Property ID está errado |
| `Google Analytics Data API has not been used in project ...` | Falta ativar a Data API (passo 1) |
| Erro 403 `access_denied` no login | Adicione seu e-mail em *Usuários de teste* na tela de consentimento OAuth |

## Endpoints criados

- `GET /api/google-analytics/auth` — inicia o OAuth (gera refresh token)
- `GET /api/google-analytics/callback` — recebe o código e exibe o refresh token
- `GET /api/google-analytics/test` — status da conexão
- `GET /api/google-analytics/dashboard` — visão geral (7 dias)
- `GET /api/google-analytics/acquisition` — canais, campanhas, referências (30 dias)
- `GET /api/google-analytics/engagement` — páginas e dispositivos (7/30 dias)
- `GET /api/google-analytics/conversions` — conversões por evento (14/30 dias)
- `GET /api/google-analytics/ecommerce` — receita, pedidos, produtos (14/30 dias)
- `GET /api/google-analytics/realtime` — usuários ativos agora (últimos 30 min)
