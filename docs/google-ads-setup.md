# Integração com o Google Ads — guia de configuração

Esta integração usa a **Google Ads API (REST)** com credenciais em `.env.local`,
seguindo o mesmo padrão da integração Shopify. Nenhum SDK extra é necessário.

Você já tem uma conta Google Ads. Faltam 3 coisas: um **projeto OAuth** no Google
Cloud, um **developer token** aprovado e um **refresh token**. Siga os passos abaixo.

---

## Variáveis de ambiente

No `.env.local` (já adicionadas, basta preencher):

| Variável | O que é |
|---|---|
| `GOOGLE_ADS_CLIENT_ID` | Client ID do OAuth (passo 1) |
| `GOOGLE_ADS_CLIENT_SECRET` | Client Secret do OAuth (passo 1) |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Developer token do Google Ads (passo 2) |
| `GOOGLE_ADS_REFRESH_TOKEN` | Gerado pelo fluxo OAuth (passo 4) |
| `GOOGLE_ADS_CUSTOMER_ID` | ID da conta de anúncios, 10 dígitos **sem traços** (passo 3) |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | *(opcional)* ID da conta gerenciadora **MCC**, sem traços |
| `GOOGLE_ADS_API_VERSION` | *(opcional)* versão da API, padrão `v20` |

Reinicie o servidor (`npm run dev`) após qualquer alteração no `.env.local`.

---

## Passo 1 — Criar credenciais OAuth no Google Cloud

1. Acesse <https://console.cloud.google.com/> e crie (ou selecione) um projeto.
2. Ative a **Google Ads API**: *APIs e serviços → Biblioteca → Google Ads API → Ativar*.
3. Configure a **Tela de consentimento OAuth** (tipo "Externo"); adicione seu e-mail
   em *usuários de teste*.
4. Em *APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth*:
   - Tipo de aplicativo: **Aplicativo da Web**.
   - Em **URIs de redirecionamento autorizados**, adicione exatamente:
     ```
     http://localhost:3000/api/google-ads/callback
     ```
     (Se rodar em outra porta/domínio, registre o equivalente: `<origem>/api/google-ads/callback`.)
5. Copie o **Client ID** e o **Client Secret** para o `.env.local`.

## Passo 2 — Obter o Developer Token

1. Acesse o Google Ads com uma conta **gerenciadora (MCC)** — se não tiver, crie em
   <https://ads.google.com/home/tools/manager-accounts/>.
2. Vá em *Ferramentas → Configuração → Central de API* (API Center).
3. Copie o **Developer token** para `GOOGLE_ADS_DEVELOPER_TOKEN`.
   - Com **acesso de teste**, o token só consulta *contas de teste*.
   - Para consultar sua conta real, solicite **Basic Access** no mesmo painel
     (a aprovação do Google pode levar de algumas horas a alguns dias).

## Passo 3 — Descobrir o Customer ID

- É o número no topo direito da interface do Google Ads, no formato `123-456-7890`.
- Coloque **apenas os dígitos** em `GOOGLE_ADS_CUSTOMER_ID` (ex.: `1234567890`).
- Se a conta for acessada via MCC, coloque o ID do MCC (sem traços) em
  `GOOGLE_ADS_LOGIN_CUSTOMER_ID`.

## Passo 4 — Gerar o Refresh Token

1. Com `GOOGLE_ADS_CLIENT_ID` e `GOOGLE_ADS_CLIENT_SECRET` já preenchidos, reinicie o servidor.
2. Abra no navegador (ou use o botão na aba **Integração → Conectar com Google**):
   ```
   http://localhost:3000/api/google-ads/auth
   ```
3. Faça login com a conta Google dona dos anúncios e aceite as permissões.
4. A tela mostrará um `refresh_token`. Copie-o para `GOOGLE_ADS_REFRESH_TOKEN`.
5. Reinicie o servidor.

> Se aparecer "Não veio refresh_token", revogue o acesso do app em
> <https://myaccount.google.com/permissions> e refaça o passo 4 (o fluxo força
> `prompt=consent` + `access_type=offline` para sempre emitir um novo token).

---

## Testar

- Abra **Marketing → Google Ads**. A página chama `/api/google-ads/test` e mostra
  "Conectado" quando tudo estiver certo.
- As abas Dashboard, Campanhas, Palavras-chave e Conversões passam a exibir dados
  reais da conta (janelas de 7 e 30 dias).

## Solução de problemas

| Mensagem | Causa provável |
|---|---|
| `Credenciais do Google Ads não configuradas` | Falta alguma variável obrigatória no `.env.local` |
| `Falha ao renovar o access token OAuth` | Client ID/Secret ou refresh token inválidos |
| `DEVELOPER_TOKEN_NOT_APPROVED` / erro de permissão | Token só tem acesso de teste; peça Basic Access |
| `USER_PERMISSION_DENIED` | A conta do refresh token não tem acesso ao Customer ID, ou falta `GOOGLE_ADS_LOGIN_CUSTOMER_ID` |
| Erro citando versão da API | Defina `GOOGLE_ADS_API_VERSION` para uma versão suportada (ex.: `v19`, `v20`, `v21`) |

## Endpoints criados

- `GET /api/google-ads/auth` — inicia o OAuth (gera refresh token)
- `GET /api/google-ads/callback` — recebe o código e exibe o refresh token
- `GET /api/google-ads/test` — status da conexão
- `GET /api/google-ads/dashboard` — métricas-resumo + séries (7 dias)
- `GET /api/google-ads/campaigns` — campanhas (30 dias)
- `GET /api/google-ads/keywords` — palavras-chave (30 dias)
- `GET /api/google-ads/conversions` — conversões + ações (30 dias)
