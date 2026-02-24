import { Scores } from './types';

export interface Archetype {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  colorClass: string;
  diagnosis: string;
  impact: string;
  reality: string;
}

export const ARCHETYPES: Archetype[] = [
  {
    id: 'architect',
    icon: '\u26A1',
    name: 'The Comeback Architect',
    subtitle: 'Exceptional Recovery',
    color: '#1A7A4A',
    colorClass: 'text-green-500',
    diagnosis: 'You rebuilt Valtrex Group better than it was before the crisis. Every major decision balanced speed with trust, automation with human investment, and short-term pressure with long-term resilience.',
    impact: 'You made the patient calls. You invested in people when the board wanted pure cost-cutting. You chose transparency when silence felt safer. You built infrastructure when the market rewarded shortcuts.',
    reality: 'The dollar figure on your screen is compound value created by decisions that aligned AI capability with human readiness. Valtrex is not restored. It is transformed.',
  },
  {
    id: 'velocity',
    icon: '\uD83D\uDE80',
    name: 'The Velocity Maximizer',
    subtitle: 'Solid Comeback \u2014 Fragile Foundation',
    color: '#D97706',
    colorClass: 'text-amber-500',
    diagnosis: 'You moved fast and rebuilt significant value. The market responded. But your OR or TL scores are telling a quieter story \u2014 the machine is running hot.',
    impact: 'You consistently chose execution speed over foundation-building. AI was deployed before it was fully trusted. Automation happened before people were ready.',
    reality: 'The next disruption will stress-test what the turnaround concealed. Without talent depth and operational resilience, the recovery sits on a single point of failure.',
  },
  {
    id: 'guardian',
    icon: '\uD83D\uDEE1\uFE0F',
    name: 'The Trust Guardian',
    subtitle: 'Partial Recovery \u2014 Strong Reputation',
    color: '#2563EB',
    colorClass: 'text-blue-500',
    diagnosis: 'You rebuilt reputation masterfully. Clients believe in the brand again. Regulators respect your governance. But market value recovery fell short.',
    impact: 'Your instinct was always protection \u2014 protect clients, protect data, protect staff. These were not wrong. But they traded commercial velocity for safety margin.',
    reality: 'You built the most important long-term asset: a reputation for doing right by people under pressure. Convert that trust into growth without betraying the foundation.',
  },
  {
    id: 'efficiency',
    icon: '\uD83D\uDCC9',
    name: 'The Efficiency Trap',
    subtitle: 'Solid Numbers \u2014 Hollow Organisation',
    color: '#9333EA',
    colorClass: 'text-purple-500',
    diagnosis: 'The recovery figure looks strong. Market value is back. But Talent is deeply negative \u2014 baked in as a $500M deduction. The P&L does not show the full story yet.',
    impact: 'Every efficiency gain came with a human cost the spreadsheet does not capture. Your best people are quietly looking elsewhere.',
    reality: 'The recovery is real but temporal. Without reinvesting margin gains into the people who run these systems, the next disruption finds a company with no bench.',
  },
  {
    id: 'cautionary',
    icon: '\uD83D\uDC80',
    name: 'The Cautionary Tale',
    subtitle: 'Value Destruction',
    color: '#B22234',
    colorClass: 'text-red-500',
    diagnosis: 'Valtrex Group did not recover meaningful enterprise value. The board is considering strategic alternatives \u2014 boardroom language for a distressed sale.',
    impact: 'One or more metric combinations compounded against each other. OR penalty, TL deduction, or insufficient MV and TR \u2014 or all of the above \u2014 created a gap too wide.',
    reality: 'Other leaders walked this path and rebuilt $3B+. The lesson is in which specific decisions created the compounding gap. That debrief is where the real learning lives.',
  },
];

export function computeEV(scores: Scores): number {
  const OR_excess = Math.max(0, scores.OR - 35);
  const TL_penalty = scores.TL < 0 ? 500 : 0;
  const TL_contrib = scores.TL < 0 ? 0 : scores.TL * 25;
  return (scores.MV * 50) + (scores.TR * 50) + TL_contrib - (OR_excess * 80) - TL_penalty;
}

export function formatEV(millions: number): string {
  if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`;
  if (millions > 0) return `$${millions}M`;
  if (millions === 0) return '$0';
  return `-$${Math.abs(millions)}M`;
}

export function getRecoveryTier(ev: number): { label: string; color: string; colorClass: string } {
  if (ev >= 3500) return { label: 'EXCEPTIONAL RECOVERY', color: '#4ADE80', colorClass: 'text-green-400' };
  if (ev >= 2500) return { label: 'SOLID COMEBACK', color: '#F26522', colorClass: 'text-exl-orange' };
  if (ev >= 1500) return { label: 'PARTIAL RECOVERY', color: '#FB923C', colorClass: 'text-orange-400' };
  return { label: 'VALUE DESTRUCTION', color: '#F87171', colorClass: 'text-red-400' };
}

export function determineArchetype(ev: number, scores: Scores): Archetype {
  if (ev >= 3500 && scores.MV > 40 && scores.TR > 30 && scores.TL > 0) {
    return ARCHETYPES.find(a => a.id === 'architect')!;
  }
  if (ev >= 2500 && scores.MV > 40 && (scores.OR >= 35 || scores.TL <= 0)) {
    return ARCHETYPES.find(a => a.id === 'velocity')!;
  }
  if (scores.TR > 35 && scores.MV <= 40 && ev >= 1500) {
    return ARCHETYPES.find(a => a.id === 'guardian')!;
  }
  if (scores.MV > 40 && scores.TL < 0 && ev >= 2000) {
    return ARCHETYPES.find(a => a.id === 'efficiency')!;
  }
  return ARCHETYPES.find(a => a.id === 'cautionary')!;
}

export function isWinningOutcome(ev: number): boolean {
  return ev >= 3500;
}
