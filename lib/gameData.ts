import { Level, StockState, ChoiceRecord } from './types';

export const INITIAL_STOCK: StockState = {
  price: 100.00,
  history: [100.00],
  change: 0,
  changePercent: 0,
};

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'The Readiness Dilemma',
    month: 'Month 1',
    monthNumber: 1,
    choices: {
      A: {
        label: 'A',
        title: 'Tech Blitz',
        strategicTags: 'High Velocity, Negative Readiness',
        insightRecap: 'Fast rollout, but tools become shelfware.',
        marketReacts: 'The market loves the initial speed but fears the lack of adoption.',
        tickerResult: {
          type: 'volatile',
          label: 'Volatile Bump',
          percent: 1.5,
          analystNote: 'Aggressive spending on AI, but ROI timeline unclear due to training gaps.',
        },
      },
      B: {
        label: 'B',
        title: 'Golden Path',
        strategicTags: 'Low Velocity, Positive Readiness',
        insightRecap: 'Slow start, but building a scalable foundation.',
        marketReacts: 'The market punishes the slow Q1 spend but acknowledges the stability.',
        tickerResult: {
          type: 'loss',
          label: 'Minor Dip',
          percent: -1.0,
          analystNote: 'Q1 capital heavy on training. Street anxious for faster deployment.',
        },
      },
    },
  },
  {
    id: 2,
    title: 'The Domain Crucible',
    month: 'Month 4',
    monthNumber: 4,
    choices: {
      A: {
        label: 'A',
        title: 'Generic & Fast',
        strategicTags: 'High Velocity, High Risk',
        insightRecap: 'Fast deployment, but hallucinations cause compliance fires.',
        marketReacts: 'The initial productivity hype is erased by news of data errors.',
        tickerResult: {
          type: 'loss',
          label: 'Correction',
          percent: -2.5,
          analystNote: 'Reports of AI inaccuracies in claims processing rattling investors.',
        },
      },
      B: {
        label: 'B',
        title: 'DSLM & Slow',
        strategicTags: 'Negative Velocity, Positive Value/Readiness',
        insightRecap: 'Delayed rollout, but the model works perfectly and cuts costs.',
        marketReacts: 'The delay pays off with tangible margin improvement news.',
        tickerResult: {
          type: 'gain',
          label: 'Steady Climb',
          percent: 3.0,
          analystNote: 'Proprietary model creating significant operational moat. Margins improving.',
        },
      },
    },
  },
  {
    id: 3,
    title: 'The Agentic Shift',
    month: 'Month 7',
    monthNumber: 7,
    choices: {
      A: {
        label: 'A',
        title: 'Human Copilot',
        strategicTags: 'Low Risk, Low Turnaround Value',
        insightRecap: 'Safe operations, but failed to hit aggressive growth targets.',
        marketReacts: 'The market sees a missed opportunity for leverage. Growth is stagnant.',
        tickerResult: {
          type: 'loss',
          label: 'Stagnation',
          percent: -4.0,
          analystNote: 'Company falling behind competitors who are adopting autonomous agents. Downgrade.',
        },
      },
      B: {
        label: 'B',
        title: 'Agentic Swarm',
        strategicTags: 'High Risk, Massive Turnaround Value',
        insightRecap: 'Operational leverage explodes. P&L impact is massive despite risks.',
        marketReacts: 'The sheer operational leverage blows analysts away.',
        tickerResult: {
          type: 'gain',
          label: 'Massive Surge',
          percent: 7.0,
          analystNote: 'Unprecedented efficiency gains from multi-agent systems. Strong Buy.',
        },
      },
    },
  },
  {
    id: 4,
    title: 'The Trust & Governance Shield',
    month: 'Month 10',
    monthNumber: 10,
    choices: {
      A: {
        label: 'A',
        title: 'The Red Light',
        strategicTags: 'Massive Negative Velocity, Low Risk',
        insightRecap: 'Zero breaches, but total innovation paralysis. Talent leaves.',
        marketReacts: 'The market interprets the pause as a sign of profound internal failure.',
        tickerResult: {
          type: 'loss',
          label: 'The Crash',
          percent: -12.0,
          analystNote: 'AI program indefinitely paused. Competitors seizing market share. Sell now.',
        },
      },
      B: {
        label: 'B',
        title: 'The AI Firewall',
        strategicTags: 'Positive Velocity, Managed Risk',
        insightRecap: 'Security enables sustained high-speed innovation.',
        marketReacts: 'The removal of the "catastrophic risk" discount boosts confidence.',
        tickerResult: {
          type: 'gain',
          label: 'Confidence Rally',
          percent: 5.0,
          analystNote: 'Best-in-class AI governance driving sustainable growth. Risk discount removed.',
        },
      },
    },
  },
  {
    id: 5,
    title: 'The Operating Model',
    month: 'Month 12',
    monthNumber: 12,
    choices: {
      A: {
        label: 'A',
        title: 'Cost Cutter',
        strategicTags: 'Short-term Value, Destroyed Culture',
        insightRecap: 'Immediate cash bump, but long-term capability is gutted.',
        marketReacts: 'A short-term pop on earnings beat, followed by long-term concern.',
        tickerResult: {
          type: 'volatile',
          label: 'Short Squeeze Pop',
          percent: 4.0,
          analystNote: 'Q4 earnings beat on aggressive headcount reduction. Long-term growth outlook negative.',
        },
      },
      B: {
        label: 'B',
        title: 'Value Creator',
        strategicTags: 'High Value, High Readiness',
        insightRecap: 'Workforce energized, entirely new revenue streams launched.',
        marketReacts: 'The realization that the company has successfully pivoted business models.',
        tickerResult: {
          type: 'gain',
          label: 'The Boom',
          percent: 10.0,
          analystNote: 'Successful pivot to AI-first revenue models. The new industry benchmark.',
        },
      },
    },
  },
];

export function calculateStockState(choiceRecords: ChoiceRecord[]): StockState {
  let price = 100.00;
  const history = [100.00];

  for (const record of choiceRecords) {
    const multiplier = 1 + (record.tickerResult.percent / 100);
    price = price * multiplier;
    history.push(price);
  }

  const change = price - 100;
  const changePercent = ((price - 100) / 100) * 100;

  return {
    price: Math.round(price * 100) / 100,
    history,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  };
}

export function getStockImpact(level: Level, choice: 'A' | 'B', currentPrice: number) {
  const choiceData = level.choices[choice];
  const percentChange = choiceData.tickerResult.percent;
  const newPrice = currentPrice * (1 + percentChange / 100);
  const priceChange = newPrice - currentPrice;

  return {
    newPrice: Math.round(newPrice * 100) / 100,
    change: Math.round(priceChange * 100) / 100,
    changePercent: percentChange,
    type: choiceData.tickerResult.type,
    label: choiceData.tickerResult.label,
    analystNote: choiceData.tickerResult.analystNote,
    insightRecap: choiceData.insightRecap,
    marketReacts: choiceData.marketReacts,
  };
}
