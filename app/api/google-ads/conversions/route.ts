import { NextResponse } from "next/server"
import {
  runQuery,
  num,
  translateStatus,
  translateConversionCategory,
  GoogleAdsError,
} from "@/lib/google-ads"
import { getGoogleAdsRequestCredentials } from "@/lib/integrations/google-ads-request"

function translateAttribution(model: string | undefined): string {
  switch (model) {
    case "GOOGLE_ADS_LAST_CLICK":
      return "Último clique"
    case "DATA_DRIVEN":
      return "Baseado em dados"
    case "GOOGLE_SEARCH_ATTRIBUTION_FIRST_CLICK":
      return "Primeiro clique"
    case "GOOGLE_SEARCH_ATTRIBUTION_LINEAR":
      return "Linear"
    case "GOOGLE_SEARCH_ATTRIBUTION_TIME_DECAY":
      return "Decaimento temporal"
    case "GOOGLE_SEARCH_ATTRIBUTION_POSITION_BASED":
      return "Baseado em posição"
    default:
      return model ? model.replace(/_/g, " ") : "-"
  }
}

function translateCounting(type: string | undefined): string {
  if (type === "ONE_PER_CLICK") return "Uma por clique"
  if (type === "MANY_PER_CLICK") return "Todas"
  return type ? type.replace(/_/g, " ") : "-"
}

/** Conversões: desempenho por ação (30 dias) + configuração das ações. */
export async function GET() {
  const credentials = await getGoogleAdsRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false })
  }

  try {
    const [overviewRows, actionRows] = await Promise.all([
      runQuery(
        `SELECT segments.conversion_action_name, segments.conversion_action_category,
                metrics.conversions, metrics.conversions_value
         FROM campaign
         WHERE segments.date DURING LAST_30_DAYS AND metrics.conversions > 0`,
        credentials,
      ),
      runQuery(
        `SELECT conversion_action.name, conversion_action.category, conversion_action.status,
                conversion_action.type, conversion_action.value_settings.default_value,
                conversion_action.counting_type,
                conversion_action.attribution_model_settings.attribution_model
         FROM conversion_action`,
        credentials,
      ),
    ])

    // Agrega métricas por nome de ação de conversão.
    const byAction = new Map<string, { name: string; category: string; count: number; value: number }>()
    for (const r of overviewRows) {
      const name = r.segments.conversionActionName || "Sem nome"
      const entry =
        byAction.get(name) ?? {
          name,
          category: translateConversionCategory(r.segments.conversionActionCategory),
          count: 0,
          value: 0,
        }
      entry.count += num(r.metrics.conversions)
      entry.value += num(r.metrics.conversionsValue)
      byAction.set(name, entry)
    }

    const conversions = [...byAction.values()]
      .map((e) => ({ ...e, valuePerConversion: e.count ? e.value / e.count : 0 }))
      .sort((a, b) => b.count - a.count)

    const actions = actionRows.map((r, i) => {
      const defaultValue = r.conversionAction.valueSettings?.defaultValue
      return {
        id: i,
        name: r.conversionAction.name,
        category: translateConversionCategory(r.conversionAction.category),
        status: translateStatus(r.conversionAction.status),
        trackingType: (r.conversionAction.type || "-").replace(/_/g, " "),
        conversionValue: defaultValue ? `R$ ${Number(defaultValue).toFixed(2)}` : "Dinâmico",
        countingMethod: translateCounting(r.conversionAction.countingType),
        attributionModel: translateAttribution(r.conversionAction.attributionModelSettings?.attributionModel),
      }
    })

    return NextResponse.json({ configured: true, conversions, actions })
  } catch (e) {
    const message = e instanceof GoogleAdsError ? e.message : "Erro ao buscar conversões do Google Ads"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
