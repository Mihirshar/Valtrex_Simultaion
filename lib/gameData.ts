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
    scenario: `Gartner data reveals that most AI initiatives fail because organizations treat AI as a plug-and-play technology rather than a cultural shift. You have a $10M budget to kickstart your 12-month turnaround. How do you allocate it?`,
    choiceDescriptions: {
      A: [
        'Invest 90% of the budget in enterprise AI licenses to maximize immediate technological capabilities, leaving 10% for basic software training.',
        'Allocate the vast majority of funds to acquiring cutting-edge AI platforms immediately, with minimal investment in workforce preparation.',
        'Prioritize rapid technology acquisition—pour resources into best-in-class AI tools now and address training gaps later.',
        'Fast-track AI deployment by channeling 90% of capital into enterprise licenses, treating training as a secondary concern.',
        'Maximize technological firepower upfront: secure comprehensive AI licensing while keeping upskilling investment minimal.',
      ],
      B: [
        'Split the budget 50/50—funding AI tools alongside a massive "AI Literacy and Context Engineering" upskilling program.',
        'Balance technology and people equally: invest half in AI platforms and half in building workforce AI fluency.',
        'Pursue a dual-track strategy—equal investment in tools and a comprehensive "AI Readiness" training initiative.',
        'Adopt a human-centered approach: match every dollar spent on AI tools with equivalent investment in employee upskilling.',
        'Build capabilities alongside technology: allocate equal resources to AI platforms and workforce transformation programs.',
      ],
    },
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
    scenario: `Operations wants to deploy Generative AI to handle complex, highly regulated client data (e.g., claims processing, underwriting). Generic models hallucinate; Everest Group emphasizes the need for Domain-Specific Language Models (DSLMs).`,
    choiceDescriptions: {
      A: [
        'Deploy a generic, off-the-shelf LLM wrapper for a fast, cheap rollout to hit immediate quarterly targets.',
        'Launch quickly with a standard large language model—speed to market matters more than customization right now.',
        'Go with a ready-made AI solution to demonstrate rapid progress and satisfy short-term performance expectations.',
        'Opt for immediate deployment using an out-of-the-box LLM to show quick wins and meet this quarter\'s goals.',
        'Prioritize velocity: implement a generic AI model now to capture early mover advantage in the market.',
      ],
      B: [
        'Delay 60 days to fine-tune a Domain-Specific Language Model (DSLM) trained on proprietary enterprise data with robust RAG architecture.',
        'Invest two months in building a customized AI model trained specifically on your industry\'s regulatory requirements and internal data.',
        'Take time to develop a precision-tuned model with retrieval-augmented generation for accurate, compliant outputs.',
        'Accept a short-term delay to create a specialized AI system that truly understands your domain\'s complexity and compliance needs.',
        'Build it right: dedicate 60 days to training a model on proprietary data with enterprise-grade accuracy safeguards.',
      ],
    },
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
    scenario: `You've built capable AI tools, but productivity gains are capped at 10-15%. Gartner's research indicates that true step-change value comes from autonomous AI agents capable of multi-step reasoning without human intervention.`,
    choiceDescriptions: {
      A: [
        'Continue scaling human-supervised Copilots, keeping humans firmly in the loop for every task.',
        'Stay the course with AI assistants that require human approval at each step—safety and control remain paramount.',
        'Expand the current copilot model where employees guide and verify every AI action before execution.',
        'Maintain human oversight: scale AI tools that augment workers but never act independently.',
        'Stick with the proven approach: AI suggests, humans decide and execute on every workflow.',
      ],
      B: [
        'Deploy an autonomous Multiagent System to negotiate and resolve tier-1 and tier-2 B2B disputes completely without human intervention.',
        'Unleash fully autonomous AI agents to handle routine business processes end-to-end without human touchpoints.',
        'Transition to agentic AI: let intelligent systems independently manage and resolve standard operational workflows.',
        'Empower AI agents with full autonomy to process, decide, and execute on lower-complexity business transactions.',
        'Make the leap to autonomous operations: deploy multi-agent systems that work 24/7 without human bottlenecks.',
      ],
    },
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
    scenario: `With autonomous agents running loose, Gartner warns of "death by AI" litigation. A close competitor just suffered a massive data leak due to a prompt injection attack. The board is nervous.`,
    choiceDescriptions: {
      A: [
        'Hit the brakes. Mandate that all AI usage be paused until a multi-year, foolproof governance framework is established.',
        'Full stop on AI deployment—freeze all initiatives until comprehensive policies and safeguards are bulletproof.',
        'Halt everything: no AI moves forward until legal, compliance, and security teams sign off on an airtight framework.',
        'Pump the brakes completely—better to lose momentum than risk catastrophic governance failure.',
        'Shut down AI operations temporarily to build an ironclad governance structure before any further deployment.',
      ],
      B: [
        'Invest aggressively in an AI Security Platform with real-time guardrails to dynamically monitor and quarantine rogue agent actions.',
        'Deploy cutting-edge AI governance tools that provide continuous monitoring and instant threat neutralization.',
        'Implement a "secure by design" approach: embed real-time safeguards that detect and contain risks without stopping innovation.',
        'Build security into the system: invest in dynamic guardrails that protect while preserving deployment velocity.',
        'Adopt an intelligent security layer that monitors AI behavior in real-time and automatically prevents harmful actions.',
      ],
    },
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
    scenario: `You have successfully scaled AI across the enterprise and hit your initial efficiency targets. What is your ultimate strategic maneuver for the final operating model?`,
    choiceDescriptions: {
      A: [
        'The Automation Trap—Use the AI solely to automate legacy business processes, cut headcount, and immediately return cash to the bottom line.',
        'Maximize short-term returns: deploy AI primarily to reduce workforce costs and boost quarterly margins.',
        'Focus on efficiency extraction—automate existing workflows, reduce staff, and deliver immediate shareholder value.',
        'Take the cost-cutting path: leverage AI to streamline operations, minimize headcount, and accelerate profit margins.',
        'Pursue operational efficiency: use AI to automate repetitive tasks, downsize teams, and drive immediate financial results.',
      ],
      B: [
        'The Value Creator—Fundamentally redesign the business model around human-AI orchestration to launch entirely new, high-margin analytics services.',
        'Transform the business: use AI to create new revenue streams and elevate your workforce to higher-value strategic roles.',
        'Reimagine the operating model—combine human creativity with AI power to unlock entirely new service offerings.',
        'Build for the future: redesign operations around human-AI collaboration to capture new market opportunities.',
        'Pursue value creation: leverage AI not just for efficiency, but to launch innovative services that generate premium margins.',
      ],
    },
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

export const TOTAL_LEVELS = LEVELS.length;

export function getRandomVariantIndex(): number {
  return Math.floor(Math.random() * 5);
}

export function getChoiceDescription(level: Level, choice: 'A' | 'B', variantIndex: number): string {
  const variants = level.choiceDescriptions[choice];
  return variants[variantIndex] || variants[0];
}

export function generateVariantIndices(): { A: number; B: number }[] {
  return LEVELS.map(() => ({
    A: getRandomVariantIndex(),
    B: getRandomVariantIndex(),
  }));
}

export function generateDisplayOrder(): ('A' | 'B')[][] {
  return LEVELS.map(() => {
    const shouldSwap = Math.random() < 0.5;
    return shouldSwap ? ['B', 'A'] : ['A', 'B'];
  });
}

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
