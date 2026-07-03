import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { ANALYTICS_SCOPE, clientId, propertyId as envPropertyId } from "@/lib/google-analytics"
import { createOAuthState } from "@/lib/integrations/oauth-state"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const id = clientId()

  if (!id) {
    return NextResponse.json(
      { error: "GOOGLE_ADS_CLIENT_ID ou GOOGLE_ANALYTICS_CLIENT_ID não configurado no ambiente do app." },
      { status: 400 },
    )
  }

  const { searchParams, origin } = new URL(request.url)
  const requestedPropertyId = (searchParams.get("propertyId") || envPropertyId() || "").replace(/\D/g, "")

  if (!requestedPropertyId) {
    return NextResponse.json(
      { error: "Informe o ID numérico da propriedade GA4 antes de conectar." },
      { status: 400 },
    )
  }

  const redirectUri =
    process.env.GOOGLE_ANALYTICS_REDIRECT_URI || `${origin}/api/google-analytics/callback`
  const state = createOAuthState({
    userId: user.id,
    provider: "google_analytics",
    data: { propertyId: requestedPropertyId },
  })

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: id,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: ANALYTICS_SCOPE,
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
      state,
    }).toString()

  return NextResponse.redirect(authUrl)
}
