# StoreOS — Google Ads API Tool Design Document

## 1. Overview

**Tool name:** StoreOS — Internal E-commerce Management Dashboard
**Company:** Lia Eluan (fashion / apparel e-commerce store)
**Website:** https://liaeluan.com.br
**Purpose:** StoreOS is an internal web dashboard used by our own team to monitor
the performance of **our own** Google Ads account. It is a **read-only reporting
tool** — it does not create, edit, or remove any campaign, ad, keyword, budget, or
conversion. It does not manage third-party accounts and does not resell data.

## 2. Access level & users

- **Users:** Internal employees only (store owner / staff).
- **Number of accounts managed:** A single Google Ads account (our own store).
- **Operations type:** Read-only (reporting). No mutate operations are performed.
- **Estimated volume:** Very low — a few requests per page load, well under
  Basic Access limits (≤ 15,000 operations/day).

## 3. Architecture & data flow

1. **Authentication (OAuth 2.0):** The tool authenticates with a Google account
   that owns the Google Ads account, using the OAuth 2.0 "Web application" flow
   with `access_type=offline` to obtain a refresh token (scope
   `https://www.googleapis.com/auth/adwords`).
2. **Access token:** The backend exchanges the refresh token for a short-lived
   access token at `https://oauth2.googleapis.com/token`.
3. **API request:** The backend calls the Google Ads API REST endpoint
   `GoogleAdsService.SearchStream`
   (`POST /vNN/customers/{customerId}/googleAds:searchStream`) with the
   `developer-token` header and a GAQL query.
4. **Display:** The JSON response is parsed and rendered as charts and tables in
   the dashboard. No data is stored long-term or shared externally; it is only
   displayed to internal users.

```
Browser (internal user)
   → StoreOS backend (Next.js API route)
      → OAuth token endpoint (refresh → access token)
      → Google Ads API (googleAds:searchStream, read-only GAQL)
   ← metrics rendered as charts/tables
```

## 4. Google Ads API services & resources used

Only **GoogleAdsService.SearchStream** is used, with read-only GAQL queries over
the following resources:

| Screen | Resource (FROM) | Fields read |
|---|---|---|
| Dashboard (totals + 7-day trend) | `customer` | `segments.date`, `metrics.cost_micros`, `metrics.impressions`, `metrics.clicks`, `metrics.conversions`, `metrics.conversions_value` |
| Campaigns | `campaign` | `campaign.id/name/status`, `campaign_budget.amount_micros`, `metrics.*` |
| Keywords | `keyword_view` | `ad_group_criterion.keyword.text/match_type`, `metrics.*` |
| Conversions | `campaign` (segmented) + `conversion_action` | `segments.conversion_action_name/category`, `conversion_action.*`, `metrics.conversions`, `metrics.conversions_value` |

## 5. Example query (GAQL)

```sql
SELECT campaign.id, campaign.name, campaign.status,
       metrics.cost_micros, metrics.clicks, metrics.impressions,
       metrics.conversions, metrics.conversions_value
FROM campaign
WHERE segments.date DURING LAST_30_DAYS
ORDER BY metrics.cost_micros DESC
```

## 6. User interface (screens)

The dashboard has four read-only tabs:

1. **Dashboard** — summary metrics (total spend, conversions, CPA, ROAS) and
   7-day line/bar charts of spend, clicks, impressions and conversions.
2. **Campaigns** — table of campaigns with status, daily budget, spend, clicks,
   impressions, CTR, conversions and ROAS (last 30 days).
3. **Keywords** — table of keywords with match type, clicks, impressions, CTR,
   average CPC and conversions (last 30 days).
4. **Conversions** — conversion performance by action and the configured
   conversion actions.

## 7. Data usage & privacy

- The tool reads metrics from **our own** Google Ads account only.
- Data is used **internally** to monitor advertising performance.
- No Google Ads data is sold, sublicensed, or shared with third parties.
- No App Conversion Tracking / Remarketing API features are used.

## 8. Compliance

The tool complies with the Google Ads API Terms of Service and Required Minimum
Functionality. It performs reporting only and applies no automated changes to the
account.
