"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Facebook, BarChart4, Activity } from "lucide-react"
import { MarketingHeader } from "./components/marketing-header"
import { MarketingDashboard } from "./components/marketing-dashboard"
import Link from "next/link"
import { useState } from "react"

export default function MarketingPage() {
  const [integrations, setIntegrations] = useState({
    facebook: false,
    googleAds: false,
    googleAnalytics: false,
  })

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <MarketingHeader integrations={integrations} />

      <div className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Facebook className="mr-2 h-5 w-5 text-[#4267B2]" />
                Facebook Ads
              </CardTitle>
              <CardDescription>Gerencie suas campanhas no Facebook</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Crie e gerencie campanhas, públicos e acompanhe o desempenho dos seus anúncios no Facebook.
              </p>
              <Button asChild className="w-full">
                <Link href="/marketing/facebook">Acessar Facebook Ads</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart4 className="mr-2 h-5 w-5 text-[#DB4437]" />
                Google Ads
              </CardTitle>
              <CardDescription>Gerencie suas campanhas no Google</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Crie e gerencie campanhas de pesquisa, display e vídeo no Google Ads.
              </p>
              <Button asChild className="w-full">
                <Link href="/marketing/google/ads">Acessar Google Ads</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-[#F4B400]" />
                Google Analytics
              </CardTitle>
              <CardDescription>Analise o desempenho do seu site</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Acompanhe o tráfego, comportamento dos usuários e conversões do seu site com o Google Analytics.
              </p>
              <Button asChild className="w-full">
                <Link href="/marketing/google/analytics">Acessar Google Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <MarketingDashboard integrations={integrations} />
      </div>
    </div>
  )
}
