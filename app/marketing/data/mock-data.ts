export const mockMarketingData = {
  // Dados de desempenho ao longo do tempo
  performanceData: [
    { date: "01/04", spend: 100, conversions: 5 },
    { date: "02/04", spend: 120, conversions: 6 },
    { date: "03/04", spend: 90, conversions: 4 },
    { date: "04/04", spend: 150, conversions: 8 },
    { date: "05/04", spend: 130, conversions: 7 },
    { date: "06/04", spend: 110, conversions: 5 },
    { date: "07/04", spend: 140, conversions: 7 },
    { date: "08/04", spend: 160, conversions: 9 },
    { date: "09/04", spend: 180, conversions: 10 },
    { date: "10/04", spend: 170, conversions: 9 },
    { date: "11/04", spend: 190, conversions: 11 },
    { date: "12/04", spend: 200, conversions: 12 },
    { date: "13/04", spend: 210, conversions: 13 },
    { date: "14/04", spend: 190, conversions: 11 },
    { date: "15/04", spend: 180, conversions: 10 },
  ],

  // Métricas gerais de campanhas
  campaignMetrics: {
    totalSpend: 2500,
    spendChange: 15,
    conversions: 120,
    conversionChange: 8,
    averageCPA: 20.83,
    cpaChange: -5,
    roas: 4.2,
    roasChange: 12,
  },

  // Distribuição de gastos por plataforma/campanha
  spendByPlatform: [
    { name: "Campanha A", value: 800 },
    { name: "Campanha B", value: 650 },
    { name: "Campanha C", value: 450 },
    { name: "Campanha D", value: 350 },
    { name: "Campanha E", value: 250 },
  ],

  // Dados de conversão
  conversionData: {
    // Funil de conversão
    funnel: [
      { name: "Impressões", value: 50000 },
      { name: "Cliques", value: 5000 },
      { name: "Visualizações de Produto", value: 3000 },
      { name: "Adições ao Carrinho", value: 1000 },
      { name: "Checkouts Iniciados", value: 500 },
      { name: "Compras", value: 120 },
    ],

    // CPA ao longo do tempo
    cpaOverTime: [
      { date: "01/04", value: 22 },
      { date: "02/04", value: 23 },
      { date: "03/04", value: 25 },
      { date: "04/04", value: 24 },
      { date: "05/04", value: 22 },
      { date: "06/04", value: 21 },
      { date: "07/04", value: 20 },
      { date: "08/04", value: 19 },
      { date: "09/04", value: 18 },
      { date: "10/04", value: 19 },
      { date: "11/04", value: 20 },
      { date: "12/04", value: 19 },
      { date: "13/04", value: 18 },
      { date: "14/04", value: 17 },
      { date: "15/04", value: 16 },
    ],

    // ROAS ao longo do tempo
    roasOverTime: [
      { date: "01/04", value: 3.5 },
      { date: "02/04", value: 3.4 },
      { date: "03/04", value: 3.2 },
      { date: "04/04", value: 3.3 },
      { date: "05/04", value: 3.6 },
      { date: "06/04", value: 3.8 },
      { date: "07/04", value: 4.0 },
      { date: "08/04", value: 4.2 },
      { date: "09/04", value: 4.5 },
      { date: "10/04", value: 4.3 },
      { date: "11/04", value: 4.1 },
      { date: "12/04", value: 4.2 },
      { date: "13/04", value: 4.4 },
      { date: "14/04", value: 4.6 },
      { date: "15/04", value: 4.8 },
    ],

    // Tendência de taxa de conversão
    conversionTrend: [
      { date: "01/04", rate: 2.1 },
      { date: "02/04", rate: 2.2 },
      { date: "03/04", rate: 2.0 },
      { date: "04/04", rate: 2.3 },
      { date: "05/04", rate: 2.4 },
      { date: "06/04", rate: 2.5 },
      { date: "07/04", rate: 2.6 },
      { date: "08/04", rate: 2.7 },
      { date: "09/04", rate: 2.8 },
      { date: "10/04", rate: 2.7 },
      { date: "11/04", rate: 2.6 },
      { date: "12/04", rate: 2.8 },
      { date: "13/04", rate: 2.9 },
      { date: "14/04", rate: 3.0 },
      { date: "15/04", rate: 3.1 },
    ],

    // Comparação de plataformas
    platformComparison: [
      { name: "Facebook", conversionRate: 2.8 },
      { name: "Instagram", conversionRate: 3.2 },
      { name: "Google", conversionRate: 2.5 },
      { name: "TikTok", conversionRate: 1.9 },
    ],
  },

  // Lista de campanhas
  campaigns: [
    {
      id: "camp-1",
      name: "Campanha de Conversão - Verão",
      status: "Ativo",
      spend: 800,
      conversions: 40,
      cpa: 20,
      roas: 4.5,
      ctr: 2.8,
    },
    {
      id: "camp-2",
      name: "Remarketing - Carrinho Abandonado",
      status: "Ativo",
      spend: 650,
      conversions: 35,
      cpa: 18.57,
      roas: 5.2,
      ctr: 3.5,
    },
    {
      id: "camp-3",
      name: "Prospecção - Público Semelhante",
      status: "Ativo",
      spend: 450,
      conversions: 20,
      cpa: 22.5,
      roas: 3.8,
      ctr: 2.1,
    },
    {
      id: "camp-4",
      name: "Campanha de Marca",
      status: "Ativo",
      spend: 350,
      conversions: 15,
      cpa: 23.33,
      roas: 3.2,
      ctr: 4.2,
    },
    {
      id: "camp-5",
      name: "Teste A/B - Criativos",
      status: "Pausado",
      spend: 250,
      conversions: 10,
      cpa: 25,
      roas: 2.8,
      ctr: 1.9,
    },
  ],

  // Alocação de orçamento
  budgetAllocation: [
    { id: "alloc-1", name: "Campanha de Conversão - Verão", value: 400 },
    { id: "alloc-2", name: "Remarketing - Carrinho Abandonado", value: 300 },
    { id: "alloc-3", name: "Prospecção - Público Semelhante", value: 200 },
    { id: "alloc-4", name: "Campanha de Marca", value: 100 },
  ],
}
