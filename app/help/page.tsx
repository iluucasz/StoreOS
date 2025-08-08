import { HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuideContent } from "./components/guide-content"
import { FAQContent } from "./components/faq-content"
import { ResourcesContent } from "./components/resources-content"

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Central de Ajuda</h1>
      </div>

      <Tabs defaultValue="guia" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guia">Guia de Uso</TabsTrigger>
          <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
        </TabsList>

        {/* GUIA DE USO */}
        <TabsContent value="guia">
          <GuideContent />
        </TabsContent>

        {/* PERGUNTAS FREQUENTES */}
        <TabsContent value="faq">
          <FAQContent />
        </TabsContent>

        {/* RECURSOS */}
        <TabsContent value="recursos">
          <ResourcesContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
