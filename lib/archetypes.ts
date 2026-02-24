import { MarketVerdict } from './types';

export function getMarketVerdict(finalPrice: number): MarketVerdict {
  if (finalPrice >= 130) {
    return {
      label: 'STRONG BUY',
      description: 'AI Transformation Champion',
      color: '#00FF88',
      colorClass: 'text-ticker-gain',
    };
  } else if (finalPrice >= 110) {
    return {
      label: 'OUTPERFORM',
      description: 'Solid Strategist',
      color: '#00FF88',
      colorClass: 'text-ticker-gain',
    };
  } else if (finalPrice >= 90) {
    return {
      label: 'HOLD',
      description: 'Cautious Progress',
      color: '#FFB800',
      colorClass: 'text-ticker-volatile',
    };
  } else if (finalPrice >= 70) {
    return {
      label: 'UNDERPERFORM',
      description: 'Missed Opportunities',
      color: '#FF3B3B',
      colorClass: 'text-ticker-loss',
    };
  } else {
    return {
      label: 'SELL',
      description: 'Strategy Collapse',
      color: '#FF3B3B',
      colorClass: 'text-ticker-loss',
    };
  }
}
