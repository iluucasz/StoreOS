# Integração Com TikTok Ads

O TikTok Ads usa a TikTok Marketing API. App ID e secret são globais do produto;
access token e advertiser ID pertencem ao usuário conectado.

## Variáveis Globais Do App

| Variável | Uso |
|---|---|
| `TIKTOK_APP_ID` | App ID no TikTok for Business |
| `TIKTOK_APP_SECRET` | Secret do app |
| `TIKTOK_REDIRECT_URI` | Callback público, ex.: `https://app.seudominio.com/api/tiktok-ads/callback` |
| `INTEGRATION_ENCRYPTION_KEY` | Chave de 32 bytes para criptografar tokens no banco |

Não coloque access token ou advertiser ID no ambiente do servidor.

## TikTok For Business

1. Acesse <https://business-api.tiktok.com/portal>.
2. Crie um app e copie App ID e Secret para as variáveis globais.
3. Em **Scope of permission**, habilite permissões de leitura de anúncios e
   relatórios.
4. Em **Redirect URL**, cadastre:

```txt
http://localhost:3000/api/tiktok-ads/callback
```

Em produção, cadastre também:

```txt
https://app.seudominio.com/api/tiktok-ads/callback
```

## Fluxo Do Cliente

1. O cliente acessa **Marketing → TikTok Ads → Integração**.
2. Clica em **Entrar com TikTok**.
3. Autoriza os anunciantes disponíveis.
4. O callback salva o access token criptografado.
5. O primeiro advertiser autorizado é salvo como `providerAccountId`.

## Próximo Ajuste Recomendado

Se o usuário autorizar vários advertisers, exiba um seletor para escolher a conta
ativa. Hoje a integração salva o primeiro advertiser e mantém a lista em
`metadata.advertiserIds`.

## Solução De Problemas

| Mensagem | Causa provável |
|---|---|
| `redirect_uri_mismatch` | Redirect cadastrado no TikTok não bate com a URL usada |
| `Access token is incorrect or has been revoked` | Token expirado ou revogado |
| `No permission` | App sem aprovação ou escopo insuficiente |
| `Advertiser id ... not exist` | Advertiser removido ou sem permissão para o usuário |
