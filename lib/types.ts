export interface Choice {
  label: string;
  title: string;
  strategicTags: string;
  insightRecap: string;
  marketReacts: string;
  tickerResult: {
    type: 'gain' | 'loss' | 'volatile';
    label: string;
    percent: number;
    analystNote: string;
  };
}

export interface Level {
  id: number;
  title: string;
  month: string;
  monthNumber: number;
  choices: {
    A: Choice;
    B: Choice;
  };
}

export interface StockState {
  price: number;
  history: number[];
  change: number;
  changePercent: number;
}

export interface ChoiceRecord {
  level: number;
  choice: 'A' | 'B';
  choiceLabel: string;
  tickerResult: Choice['tickerResult'];
  priceAfter: number;
}

export type MarketVerdict = {
  label: string;
  description: string;
  color: string;
  colorClass: string;
};
