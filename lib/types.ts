export type ScoreKey = 'MV' | 'TR' | 'OR' | 'TL';

export interface Scores {
  MV: number;
  TR: number;
  OR: number;
  TL: number;
}

export interface ScoreChange {
  MV: number;
  TR: number;
  OR: number;
  TL: number;
}

export interface Insight {
  first: string;
  second: string;
}

export interface Level {
  id: number;
  title: string;
  month: string;
  scenario: string;
  choices: {
    A: string;
    B: string;
  };
  scoring: {
    A: ScoreChange;
    B: ScoreChange;
  };
  insights: {
    A: Insight;
    B: Insight;
  };
}

export type IndustryKey = 'financial' | 'healthcare' | 'retail' | 'tech';
export type CrisisKey = 'competitor' | 'breach' | 'market' | 'product';

export interface IndustryMeta {
  name: string;
  icon: string;
}

export interface CrisisMeta {
  name: string;
  icon: string;
  desc: string;
}

export const SCORE_METRICS: { key: ScoreKey; name: string; description: string; target: string; isLimit?: boolean }[] = [
  { key: 'MV', name: 'Market Value Recovery', description: 'Rebuilding enterprise valuation', target: '> +40' },
  { key: 'TR', name: 'Trust Restoration', description: 'Stakeholder and market confidence', target: '> +30' },
  { key: 'OR', name: 'Operational Risk', description: 'Systemic fragility ceiling', target: '< +35', isLimit: true },
  { key: 'TL', name: 'Talent & Culture', description: 'Organizational health floor', target: '> 0' },
];

export const INITIAL_SCORES: Scores = { MV: 0, TR: 0, OR: 0, TL: 0 };

export const INDUSTRIES_META: Record<IndustryKey, IndustryMeta> = {
  financial: { name: 'Financial Services', icon: '\uD83D\uDCBC' },
  healthcare: { name: 'Healthcare', icon: '\uD83C\uDFE5' },
  retail: { name: 'Retail', icon: '\uD83D\uDECD\uFE0F' },
  tech: { name: 'Tech / SaaS', icon: '\uD83D\uDCBB' },
};

export const CRISES_META: Record<CrisisKey, CrisisMeta> = {
  competitor: { name: 'Disrupted by AI-Native Competitor', icon: '\u2694\uFE0F', desc: 'A new AI-first entrant is capturing your market at unprecedented speed.' },
  breach: { name: 'Data Breach & Trust Collapse', icon: '\uD83D\uDD13', desc: 'A catastrophic breach has exposed millions of records and shattered stakeholder trust.' },
  market: { name: 'Market Crash & Cost Crisis', icon: '\uD83D\uDCC9', desc: 'A severe market downturn has decimated revenue and forced existential cost decisions.' },
  product: { name: 'Product Failure & Reputation Collapse', icon: '\uD83D\uDCA5', desc: 'A critical product failure has gone public, triggering client exodus and media scrutiny.' },
};
