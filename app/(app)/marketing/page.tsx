"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart4, Activity } from "lucide-react"
import { MetaIcon, TikTokIcon } from "@/components/brand-icons"
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MetaIcon className="mr-2 h-5 w-5 text-[#0866FF]" />
                Meta Ads
              </CardTitle>
              <CardDescription>Facebook e Instagram Ads</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Acompanhe campanhas, demografia e conversões dos seus anúncios no Facebook e Instagram.
              </p>
              <Button asChild className="w-full">
                <Link href="/marketing/facebook">Acessar Meta Ads</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TikTokIcon className="mr-2 h-5 w-5" />
                TikTok Ads
              </CardTitle>
              <CardDescription>Gerencie suas campanhas no TikTok</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Acompanhe o desempenho, gasto e conversões dos seus anúncios no TikTok Ads.
              </p>
              <Button asChild className="w-full">
                <Link href="/marketing/tiktok">Acessar TikTok Ads</Link>
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
