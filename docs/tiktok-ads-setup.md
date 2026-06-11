# Integração com o TikTok Ads

Usa a **TikTok Marketing API** (Business API).

## Variáveis (.env.local)

| Variável | O que é |
|---|---|
| `TIKTOK_APP_ID` | App ID (TikTok for Business) |
| `TIKTOK_APP_SECRET` | Secret do app |
| `TIKTOK_ACCESS_TOKEN` | Token de acesso (gerado no passo 2) |
| `TIKTOK_ADVERTISER_ID` | ID do anunciante (advertiser_id) |

Reinicie o servidor (`npm run dev`) após alterar o `.env.local`.

---

## Passo 1 — Criar o app no TikTok for Business

1. Acesse <https://business-api.tiktok.com/portal> e entre em **My Apps → Create an App**
   (é necessário ter uma conta TikTok for Business / TikTok Ads).
2. Em **App detail**, copie o **App ID** e o **Secret** para `TIKTOK_APP_ID` e
   `TIKTOK_APP_SECRET`.
3. Em **Scope of permission**, marque **Ad Account Management** e **Reporting**
   (leitura de relatórios).
4. Em **Redirect URL** (Advertiser authorization URL), adicione:
   ```
   http://localhost:3000/api/tiktok-ads/callback
   ```
5. O app precisa ser aprovado pelo TikTok antes de acessar dados de produção —
   acompanhe o status no portal.

## Passo 2 — Autorizar e gerar o token

1. Com App ID e Secret preenchidos e o servidor reiniciado, abra:
   ```
   http://localhost:3000/api/tiktok-ads/auth
   ```
   (ou o botão em **Marketing → TikTok Ads → Integração**)
2. Faça login e autorize o(s) anunciante(s).
3. A tela mostrará o `access_token` e os `advertiser_ids` autorizados. Copie o
   token para `TIKTOK_ACCESS_TOKEN` e um dos ids para `TIKTOK_ADVERTISER_ID`.
4. Reinicie o servidor.

---

## Testar

Abra **Marketing → TikTok Ads**. Deve mostrar **🟢 Conectado** e as abas Dashboard
e Campanhas com dados reais (14/30 dias).

## Solução de problemas

| Mensagem | Causa provável |
|---|---|
| `Credenciais do TikTok não configuradas` | Falta `TIKTOK_ACCESS_TOKEN` ou `TIKTOK_ADVERTISER_ID` |
| `Access token is incorrect or has been revoked` | Token inválido — gere outro (passo 2) |
| `No permission` / `not approved` | App ainda sem aprovação ou sem o escopo Reporting |
| `Advertiser id ... not exist` | advertiser_id errado (use só os dígitos) |

## Endpoints criados

- `GET /api/tiktok-ads/auth` · `callback` — geram o token
- `GET /api/tiktok-ads/test` — status da conexão
- `GET /api/tiktok-ads/dashboard` — visão geral + série (14 dias)
- `GET /api/tiktok-ads/campaigns` — campanhas (30 dias)
