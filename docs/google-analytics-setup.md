# Integração com Google Analytics 4

O Google Analytics usa OAuth por usuário. Em produção, o cliente final não copia
refresh token nem edita `.env`: ele informa o ID numérico da propriedade GA4 e
clica em **Entrar com Google**.

## Variáveis globais do app

Estas variáveis pertencem ao produto, não ao cliente:

| Variável | Uso |
|---|---|
| `GOOGLE_ADS_CLIENT_ID` ou `GOOGLE_ANALYTICS_CLIENT_ID` | OAuth Client ID do app no Google Cloud |
| `GOOGLE_ADS_CLIENT_SECRET` ou `GOOGLE_ANALYTICS_CLIENT_SECRET` | OAuth Client Secret do app |
| `GOOGLE_ANALYTICS_REDIRECT_URI` | Callback público, ex.: `https://app.seudominio.com/api/google-analytics/callback` |
| `INTEGRATION_ENCRYPTION_KEY` | Chave de 32 bytes para criptografar tokens salvos no banco |

Não use Property ID ou refresh token no ambiente do servidor. Esses dados são
salvos por usuário em `user_integrations`.

## Google Cloud

1. Ative a **Google Analytics Data API** no projeto.
2. No OAuth Client, cadastre o redirect exato:

```txt
http://localhost:3000/api/google-analytics/callback
```

Em produção, cadastre também o domínio real:

```txt
https://app.seudominio.com/api/google-analytics/callback
```

## Fluxo do cliente

1. O cliente acessa **Marketing → Google Analytics → Integração**.
2. Informa o ID numérico da propriedade GA4.
3. Clica em **Entrar com Google**.
4. O callback salva a integração em `user_integrations`, ligada ao `userId`.
5. Os endpoints de Analytics passam a ler o token criptografado do usuário.

## Banco

A tabela `user_integrations` guarda o status, conta conectada e tokens
criptografados por usuário. Rode as migrations antes de usar em outro ambiente:

```bash
npm run db:migrate
```

## Solução de problemas

| Mensagem | Causa provável |
|---|---|
| `redirect_uri_mismatch` | Redirect cadastrado no Google Cloud não bate exatamente com a URL usada pelo app |
| `invalid_grant` | Refresh token expirou, foi revogado ou o app OAuth está em modo de teste |
| `User does not have sufficient permissions` | A conta Google não tem acesso à propriedade GA4 |
| `Google Analytics Data API has not been used` | A Data API não foi ativada no projeto |
