# Integração com Google Ads

O Google Ads usa OAuth por usuário. Em produção, o cliente final não edita `.env`
nem copia refresh token: ele clica em **Entrar com Google** e a conexão é salva em
`user_integrations`, vinculada ao `userId`.

## Variáveis Globais Do App

Estas variáveis pertencem ao produto:

| Variável | Uso |
|---|---|
| `GOOGLE_ADS_CLIENT_ID` | OAuth Client ID do app no Google Cloud |
| `GOOGLE_ADS_CLIENT_SECRET` | OAuth Client Secret do app |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Developer token aprovado no Google Ads API Center |
| `GOOGLE_ADS_REDIRECT_URI` | Callback público, ex.: `https://app.seudominio.com/api/google-ads/callback` |
| `GOOGLE_ADS_API_VERSION` | Opcional. Padrão: `v20` |
| `INTEGRATION_ENCRYPTION_KEY` | Chave de 32 bytes para criptografar tokens no banco |

Não use variáveis por cliente, como refresh token ou Customer ID, no ambiente do
servidor.

## Google Cloud

1. Ative a **Google Ads API** no projeto.
2. Configure a tela de consentimento OAuth.
3. No OAuth Client do tipo **Aplicativo da Web**, cadastre:

```txt
http://localhost:3000/api/google-ads/callback
```

Em produção, cadastre também o domínio real:

```txt
https://app.seudominio.com/api/google-ads/callback
```

## Developer Token

No Google Ads, acesse **Ferramentas → Configuração → Central de API** e copie o
developer token para `GOOGLE_ADS_DEVELOPER_TOKEN`.

Com acesso de teste, a API só consulta contas de teste. Para contas reais,
solicite **Basic Access** ou superior.

## Fluxo Do Cliente

1. O cliente acessa **Marketing → Google Ads → Integração**.
2. Clica em **Entrar com Google**.
3. O app solicita o escopo `https://www.googleapis.com/auth/adwords`.
4. O callback salva o refresh token criptografado e lista as contas acessíveis.
5. A primeira conta acessível é selecionada como `providerAccountId`.

## Próximo Ajuste Recomendado

Quando houver várias contas acessíveis, exiba um seletor para o usuário escolher
qual Customer ID deve ficar ativo. Hoje a integração salva a primeira conta e
mantém a lista completa em `metadata.accessibleCustomers`.

## Solução De Problemas

| Mensagem | Causa provável |
|---|---|
| `redirect_uri_mismatch` | Redirect cadastrado no Google Cloud não bate exatamente com a URL usada |
| `DEVELOPER_TOKEN_NOT_APPROVED` | Token ainda sem acesso aprovado para a conta real |
| `USER_PERMISSION_DENIED` | Usuário Google não tem acesso à conta de anúncios |
| `A conta selecionada é uma conta administradora` | A conta escolhida é MCC; escolha uma conta cliente |
