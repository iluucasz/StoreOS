# Integração Com Shopify

A Shopify agora usa OAuth por usuário. O cliente final informa o domínio da loja,
clica em **Entrar com Shopify** e o access token é salvo criptografado em
`user_integrations`.

## Variáveis Globais Do App

| Variável | Uso |
|---|---|
| `SHOPIFY_CLIENT_ID` | Client ID do app Shopify |
| `SHOPIFY_CLIENT_SECRET` | Client Secret do app Shopify |
| `SHOPIFY_REDIRECT_URI` | Callback público, ex.: `https://app.seudominio.com/api/shopify/callback` |
| `SHOPIFY_API_VERSION` | Opcional. Padrão: `2025-01` |
| `INTEGRATION_ENCRYPTION_KEY` | Chave de 32 bytes para criptografar tokens no banco |

Não coloque domínio da loja nem access token no ambiente do servidor.

## App Shopify

No app criado no painel de parceiros/admin da Shopify, cadastre o callback:

```txt
http://localhost:3000/api/shopify/callback
```

Em produção, cadastre também:

```txt
https://app.seudominio.com/api/shopify/callback
```

Escopos usados:

```txt
read_customers,read_inventory,read_orders,read_products
```

## Fluxo Do Cliente

1. O cliente acessa **Integrações → Shopify → Configuração**.
2. Informa o domínio `minha-loja.myshopify.com`.
3. Clica em **Entrar com Shopify**.
4. O callback valida HMAC, troca o código por access token e salva a loja em
   `user_integrations`.
5. Pedidos, produtos, estoque e contexto da OSIA passam a consultar a loja desse
   usuário.

## Solução De Problemas

| Mensagem | Causa provável |
|---|---|
| `Informe o domínio da loja Shopify` | O domínio não foi enviado para iniciar o OAuth |
| `Sessão de conexão inválida ou expirada` | State OAuth expirou; tente conectar novamente |
| `Assinatura da Shopify inválida` | HMAC inválido ou client secret incorreto |
| `Shopify retornou erro 401` | Token revogado ou app removido da loja |
