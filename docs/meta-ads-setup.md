# Integração com a Meta — Facebook + Instagram Ads

Usa a **Meta Marketing API** (Graph API). Facebook e Instagram Ads vêm da mesma
conta de anúncios — a aba "Dashboard" mostra o split por plataforma.

## Variáveis (.env.local)

| Variável | O que é |
|---|---|
| `META_APP_ID` | App ID do app no Meta for Developers |
| `META_APP_SECRET` | App Secret do app |
| `META_ACCESS_TOKEN` | Token de longa duração (gerado no passo 3) |
| `META_AD_ACCOUNT_ID` | ID da conta de anúncios (`act_123...` ou só os dígitos) |
| `META_API_VERSION` | (opcional) versão da Graph API, padrão `v21.0` |

Reinicie o servidor (`npm run dev`) após alterar o `.env.local`.

---

## Passo 1 — Criar o app no Meta for Developers

1. Acesse <https://developers.facebook.com/apps/> e clique em **Criar app**.
2. Tipo de app: **Empresa (Business)**. Vincule ao seu Business Manager.
3. No painel do app, adicione o produto **Marketing API**.
4. Em **Configurações → Básico**, copie o **App ID** e o **Chave Secreta do App**
   para `META_APP_ID` e `META_APP_SECRET`.
5. Em **Casos de uso / Permissões**, garanta que o app pede **`ads_read`**
   (e `business_management`). Para ler a **sua própria** conta de anúncios, o
   modo de desenvolvimento já funciona (você é admin) — não precisa de App Review.

### Redirect OAuth
Em **Login do Facebook → Configurações**, adicione em "URIs de redirecionamento
OAuth válidos":
```
http://localhost:3000/api/meta-ads/callback
```

## Passo 2 — Descobrir o Ad Account ID

- No **Gerenciador de Anúncios**, o ID aparece no seletor de conta como
  `123456789012345`. Use `act_123456789012345` (ou só os dígitos) em
  `META_AD_ACCOUNT_ID`. O fluxo do passo 3 também lista suas contas.

## Passo 3 — Gerar o token de acesso

1. Com App ID e App Secret preenchidos e o servidor reiniciado, abra:
   ```
   http://localhost:3000/api/meta-ads/auth
   ```
   (ou o botão em **Marketing → Meta Ads → Integração**)
2. Faça login e aceite as permissões.
3. A tela mostrará um `access_token` (longa duração, ~60 dias) e a lista de
   contas (`act_...`). Copie o token para `META_ACCESS_TOKEN` e o id da conta
   desejada para `META_AD_ACCOUNT_ID`.
4. Reinicie o servidor.

> Para um token que **não expira**, crie um **System User** no Business Manager,
> atribua a conta de anúncios e gere um token com `ads_read`.

---

## Testar

Abra **Marketing → Meta Ads**. Deve mostrar **🟢 Conectado** e as abas Dashboard,
Campanhas, Demografia e Conversões com dados reais (7/30 dias).

## Solução de problemas

| Mensagem | Causa provável |
|---|---|
| `Credenciais da Meta não configuradas` | Falta `META_ACCESS_TOKEN` ou `META_AD_ACCOUNT_ID` |
| `(#190) ... access token` | Token expirado/inválido — gere outro (passo 3) |
| `(#200) ... permission` | Falta `ads_read`, ou o usuário não tem acesso à conta |
| `Unsupported get request` | Ad Account ID errado (use `act_` + dígitos) |

## Endpoints criados

- `GET /api/meta-ads/auth` · `callback` — geram o token
- `GET /api/meta-ads/test` — status da conexão
- `GET /api/meta-ads/dashboard` — visão geral + split Facebook/Instagram
- `GET /api/meta-ads/campaigns` — campanhas (30 dias)
- `GET /api/meta-ads/demographics` — idade × gênero (30 dias)
- `GET /api/meta-ads/conversions` — eventos do Pixel (30 dias)
