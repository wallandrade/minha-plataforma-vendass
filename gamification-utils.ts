// Utilitários para cálculo de pontos de gamificação

interface AggregatedSalesRange {
  minValue: number; // Valor mínimo em centavos
  maxValue: number; // Valor máximo em centavos
  points: number;   // Pontos por item nesta faixa
}

export function calculateAggregatedSalesPoints(
  additionalItemsCount: number,
  additionalItemsValue: number,
  store: any
): number {
  if (!additionalItemsCount || additionalItemsCount === 0) {
    return 0;
  }

  const mode = store.aggregatedSalesPointsMode || 'fixed';
  
  if (mode === 'fixed') {
    // Modo fixo: pontos fixos por item
    const pointsPerItem = store.aggregatedSalesFixedPoints || 5;
    return additionalItemsCount * pointsPerItem;
  }
  
  if (mode === 'range' && store.aggregatedSalesRanges) {
    // Modo por faixa: pontos baseados no valor dos itens
    try {
      const ranges: AggregatedSalesRange[] = JSON.parse(store.aggregatedSalesRanges);
      
      // Calcular valor médio por item
      const avgValuePerItem = additionalItemsValue / additionalItemsCount;
      
      // Encontrar a faixa adequada
      const range = ranges.find(r => 
        avgValuePerItem >= r.minValue && avgValuePerItem <= r.maxValue
      );
      
      if (range) {
        return additionalItemsCount * range.points;
      }
      
      // Se não encontrar faixa, usar pontos fixos como fallback
      const pointsPerItem = store.aggregatedSalesFixedPoints || 5;
      return additionalItemsCount * pointsPerItem;
      
    } catch (error) {
      // Se houver erro no JSON, usar modo fixo
      const pointsPerItem = store.aggregatedSalesFixedPoints || 5;
      return additionalItemsCount * pointsPerItem;
    }
  }
  
  // Fallback para modo fixo
  const pointsPerItem = store.aggregatedSalesFixedPoints || 5;
  return additionalItemsCount * pointsPerItem;
}

export function getDefaultAggregatedSalesRanges(): AggregatedSalesRange[] {
  return [
    { minValue: 0, maxValue: 2000, points: 3 },       // R$ 0 - R$ 20: 3 pontos
    { minValue: 2001, maxValue: 5000, points: 5 },    // R$ 20,01 - R$ 50: 5 pontos
    { minValue: 5001, maxValue: 10000, points: 8 },   // R$ 50,01 - R$ 100: 8 pontos
    { minValue: 10001, maxValue: 99999999, points: 12 } // R$ 100,01+: 12 pontos
  ];
}