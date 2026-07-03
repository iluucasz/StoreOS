# Integração Com Meta Ads

A integração da Meta cobre Facebook e Instagram Ads pela Marketing API. Em
produção, tokens e conta de anúncios são dados do usuário, não do `.env`.

## Variáveis Globais Do App

| Variável | Uso |
|---|---|
| `META_APP_ID` | App ID no Meta for Developers |
| `META_APP_SECRET` | App Secret do app |
| `META_REDIRECT_URI` | Callback público, ex.: `https://app.seudominio.com/api/meta-ads/callback` |
| `META_API_VERSION` | Opcional. Padrão: `v21.0` |
| `INTEGRATION_ENCRYPTION_KEY` | Chave de 32 bytes para criptografar tokens no banco |

Não coloque `access_token` ou `ad_account_id` no ambiente do servidor.

## Meta For Developers

1. Crie um app em <https://developers.facebook.com/apps/>.
2. Use o tipo **Empresa** e vincule ao Business Manager.
3. Adicione o produto **Marketing API**.
4. Garanta o escopo `ads_read`.
5. Em **Login do Facebook → Configurações**, cadastre:

```txt
http://localhost:3000/api/meta-ads/callback
```

Em produção, cadastre também:

```txt
https://app.seudominio.com/api/meta-ads/callback
```

## Fluxo Do Cliente

1. O cliente acessa **Marketing → Meta Ads → Integração**.
2. Clica em **Entrar com Meta**.
3. O callback troca o código por token de longa duração.
4. O app lista as contas de anúncios autorizadas.
5. A primeira conta é salva como `providerAccountId` em `user_integrations`.

## Próximo Ajuste Recomendado

Se o usuário tiver várias contas de anúncios, exiba um seletor para escolher a
conta ativa. A lista autorizada já fica salva em `metadata.adAccounts`.

## Solução De Problemas

| Mensagem | Causa provável |
|---|---|
| `redirect_uri_mismatch` | Redirect cadastrado na Meta não bate com a URL usada |
| `(#190) access token` | Token expirado, revogado ou inválido |
| `(#200) permission` | Falta permissão `ads_read` ou acesso à conta |
| `Unsupported get request` | Conta de anúncios inválida ou sem permissão |
