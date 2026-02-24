import {
  Level, Scores, ScoreKey, ScoreChange,
  IndustryKey, CrisisKey,
  INITIAL_SCORES, SCORE_METRICS,
} from './types';

export type { Level, Scores, ScoreKey, ScoreChange, IndustryKey, CrisisKey };
export type { Insight } from './types';
export { INITIAL_SCORES, SCORE_METRICS };

export type ScoreStatus = 'met' | 'target' | 'missed';

export const MONTH_MARKERS = [1, 3, 6, 9, 12, 15] as const;
export const TOTAL_MONTHS = 18;

export function calculateScores(choices: ('A' | 'B')[], levels: Level[]): Scores {
  const scores = { ...INITIAL_SCORES };
  choices.forEach((choice, i) => {
    if (levels[i]) {
      const delta = levels[i].scoring[choice];
      scores.MV += delta.MV;
      scores.TR += delta.TR;
      scores.OR += delta.OR;
      scores.TL += delta.TL;
    }
  });
  return scores;
}

export function getScoreTarget(key: ScoreKey): number {
  switch (key) {
    case 'MV': return 40;
    case 'TR': return 30;
    case 'OR': return 35;
    case 'TL': return 0;
  }
}

export function getScoreRange(key: ScoreKey): { min: number; max: number } {
  switch (key) {
    case 'MV': return { min: -20, max: 80 };
    case 'TR': return { min: -20, max: 60 };
    case 'OR': return { min: 0, max: 70 };
    case 'TL': return { min: -30, max: 40 };
  }
}

export function getScoreStatus(key: ScoreKey, value: number): ScoreStatus {
  const target = getScoreTarget(key);
  const isRisk = key === 'OR';
  if (isRisk) {
    if (value < target) return 'met';
    if (value === target) return 'target';
    return 'missed';
  }
  if (key === 'TL') {
    if (value > 0) return 'met';
    if (value === 0) return 'target';
    return 'missed';
  }
  if (value >= target) return 'met';
  if (value >= target - 10) return 'target';
  return 'missed';
}

export function isScorePassing(key: ScoreKey, value: number): boolean {
  return getScoreStatus(key, value) === 'met';
}

// ──────────────────────────────────────────────────
// LEVELS DATA: 4 industries × 4 crises × 6 levels
// ──────────────────────────────────────────────────

export const LEVELS: Record<IndustryKey, Record<CrisisKey, Level[]>> = {
  financial: {
    competitor: [
      {
        id: 1, title: 'Competitive Intelligence', month: 'Month 1',
        scenario: 'An AI-native fintech has launched a fully automated wealth-management platform. In 90 days it has captured 8% of your addressable market and is growing 15% month-over-month. Your legacy onboarding process takes 5x longer. The board wants a response plan by Friday.',
        choices: {
          A: 'License a white-label robo-advisor to close the product gap in 60 days. Fast but dependent on third-party IP with limited customization.',
          B: 'Fund a 6-month internal build of a proprietary AI advisory engine using your 20 years of client data as competitive moat.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 8, TL: -3 }, B: { MV: 5, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Quick market response stabilizes client attrition. Analysts upgrade outlook.', second: 'Vendor dependency creates single-point-of-failure. Customization ceiling limits differentiation within 12 months.' },
          B: { first: 'Slower initial response allows competitor to extend lead. Board patience tested.', second: 'Proprietary data moat creates defensible position. Internal team gains critical AI competency.' },
        },
      },
      {
        id: 2, title: 'Talent War', month: 'Month 3',
        scenario: 'The competitor is poaching your top quantitative analysts with 40% pay increases and equity packages. Three key portfolio managers have resigned this month. Your remaining team is demoralized. HR reports a 35% spike in LinkedIn activity across your data science division.',
        choices: {
          A: 'Match competitor compensation packages across the board and implement retention bonuses tied to 2-year vesting schedules.',
          B: 'Create an internal AI Innovation Lab with equity-like incentives, giving top talent ownership of the products they build.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 5, TL: 3 }, B: { MV: 3, TR: 7, OR: 2, TL: 10 } },
        insights: {
          A: { first: 'Immediate attrition slows. Payroll costs increase 22%.', second: 'Compensation arms race is unsustainable. Does not address underlying mission-and-purpose gap.' },
          B: { first: 'Takes 3 months to launch Lab. Some mid-tier talent still leaves.', second: 'Innovation Lab becomes talent magnet. Internal IP generation accelerates. Culture shifts from cost-center to product-builder mindset.' },
        },
      },
      {
        id: 3, title: 'Client Retention', month: 'Month 6',
        scenario: 'Your largest institutional client ($4.2B AUM) has issued an RFP to evaluate competitors. Three mid-tier clients have already migrated. Industry analysts have published a report questioning your technology roadmap. Client NPS has dropped 18 points in one quarter.',
        choices: {
          A: 'Deploy a dedicated AI-powered client insights dashboard to your top 20 accounts with white-glove onboarding and 24/7 concierge support.',
          B: 'Announce a public technology transformation roadmap with quarterly milestones and invite key clients to co-design the next platform.',
        },
        scoring: { A: { MV: 8, TR: 5, OR: 6, TL: -2 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Top client pauses RFP. Quick win stabilizes revenue.', second: 'Resources concentrated on top 20 leave mid-tier underserved. Two-tier service model creates internal friction.' },
          B: { first: 'Transparency resonates. Client co-design deepens relationships.', second: 'Public roadmap creates accountability. Quarterly milestones become forcing function for delivery. Mid-tier clients regain confidence.' },
        },
      },
      {
        id: 4, title: 'Regulatory Response', month: 'Month 9',
        scenario: 'The SEC has opened a formal inquiry into AI-driven trading algorithms across the industry. Your competitor is under investigation for model bias. Regulators are drafting new AI transparency requirements. Your compliance team says full readiness is 18 months out, but voluntary early compliance could differentiate you.',
        choices: {
          A: 'Hire a Big Four consultancy to fast-track compliance readiness and submit for voluntary early-adopter certification.',
          B: 'Build an internal AI governance framework and publish a transparency report. Offer to collaborate with regulators on industry standards.',
        },
        scoring: { A: { MV: 5, TR: 7, OR: 8, TL: -2 }, B: { MV: 8, TR: 10, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Certification achieved in 6 months. Marketing team leverages it aggressively.', second: 'Consultancy-built framework is expensive to maintain. Internal team does not develop regulatory muscle.' },
          B: { first: 'Regulator collaboration takes longer. Initial uncertainty.', second: 'Positions firm as industry thought leader. Regulatory relationships become strategic asset. Internal expertise compounds.' },
        },
      },
      {
        id: 5, title: 'Market Positioning', month: 'Month 12',
        scenario: 'Your competitor has hit growing pains — their AI model produced a flawed risk assessment that cost a client $200M. Market sentiment is shifting. Your stock is up 12% on the news. Analysts want to know: do you capitalize aggressively or play the long game?',
        choices: {
          A: 'Launch an aggressive acquisition campaign targeting the competitor\'s displaced clients with discounted fee structures and migration support.',
          B: 'Accelerate your own platform launch and position the messaging around "trust-verified AI" — emphasizing your governance and data lineage capabilities.',
        },
        scoring: { A: { MV: 12, TR: 3, OR: 7, TL: -3 }, B: { MV: 8, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Rapid client acquisition. AUM grows 18% in one quarter.', second: 'Discounted fees compress margins. Onboarding surge strains operations. Quality of service dips.' },
          B: { first: 'Slower client migration but higher-quality relationships.', second: '"Trust-verified AI" becomes defining brand attribute. Premium pricing justified. Competitor clients who switch are stickier.' },
        },
      },
      {
        id: 6, title: 'Transformation Endgame', month: 'Month 15',
        scenario: 'Fifteen months in. Your AI platform is live. Competitor has stabilized but lost market leadership. The board is evaluating whether to: (a) double down on organic AI investment, or (b) pursue a strategic acquisition of a smaller AI fintech to leapfrog. Your CTO says option (a) preserves culture; your CFO says option (b) accelerates by 2 years.',
        choices: {
          A: 'Acquire the AI fintech for $800M. Integrate their tech stack and talent. Accept 18 months of integration complexity for a 2-year capability leap.',
          B: 'Double organic R&D investment. Hire 200 additional AI engineers. Launch three new AI-native products from internal IP over the next 12 months.',
        },
        scoring: { A: { MV: 12, TR: 5, OR: 10, TL: -5 }, B: { MV: 8, TR: 8, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Acquisition announced to positive market reaction. Stock up 8%.', second: 'Integration risk is real. Culture clash and tech debt absorb management attention for 18 months. Key acquired talent departs within 12 months.' },
          B: { first: 'Organic growth is slower. Competitor briefly narrows the gap.', second: 'Internal IP compounds. Culture strengthened. Three new products create diversified revenue streams. Talent pipeline becomes self-sustaining.' },
        },
      },
    ],
    breach: [
      {
        id: 1, title: 'Breach Containment', month: 'Month 1',
        scenario: 'A zero-day vulnerability in your client data platform has exposed 12 million customer records including SSNs, account numbers, and transaction histories. The breach was discovered by a security researcher who posted findings on Twitter before notifying you. Regulators, media, and clients are demanding answers simultaneously.',
        choices: {
          A: 'Engage a top-tier incident response firm. Issue a holding statement while forensics assess scope. Notify regulators within 72 hours as required.',
          B: 'Issue an immediate full-disclosure public statement with everything known. Offer free credit monitoring to all affected clients. Appoint a public-facing Chief Trust Officer.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 5, TL: 2 }, B: { MV: 3, TR: 10, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Controlled response reduces legal exposure. Buys time for accurate assessment.', second: 'Delayed transparency fuels speculation. Social media narrative spirals. Trust erodes faster than forensics can work.' },
          B: { first: 'Radical transparency wins early praise from consumer advocates and media.', second: 'Full disclosure before forensics complete carries risk of over-disclosing, but early trust investment pays compound interest.' },
        },
      },
      {
        id: 2, title: 'Client Communication', month: 'Month 3',
        scenario: 'Forensics reveal the breach was wider than initially reported — 18 million records, not 12 million. An internal employee left a backdoor during a system migration 2 years ago. Class-action lawsuits have been filed in three jurisdictions. Your largest corporate client is demanding a personal briefing from the CEO.',
        choices: {
          A: 'CEO conducts a series of private briefings with top 50 clients. Legal team manages class-action quietly. Minimize public updates.',
          B: 'CEO hosts a live-streamed town hall for all stakeholders — clients, employees, investors. Release updated breach findings in full. Announce a $100M security investment.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 7, TL: -3 }, B: { MV: 3, TR: 12, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Top clients reassured. Class-action negotiations proceed quietly.', second: 'Two-tier communication strategy leaks. Mid-tier clients feel deprioritized. Employee morale drops when they learn scope from media, not leadership.' },
          B: { first: 'Town hall goes viral. Media covers it as "unprecedented transparency in financial services."', second: '$100M commitment becomes rallying point for internal teams. Security hiring pipeline explodes with top talent wanting to join the rebuild.' },
        },
      },
      {
        id: 3, title: 'Security Architecture', month: 'Month 6',
        scenario: 'The board has approved a complete security architecture rebuild. You have two paths: adopt a best-of-breed vendor stack (Palo Alto, CrowdStrike, etc.) or build a zero-trust architecture from the ground up with AI-native threat detection. Your CISO favors vendors for speed; your CTO argues that AI-native detection using your proprietary data will be the industry standard in 3 years.',
        choices: {
          A: 'Deploy best-of-breed vendor stack. Operational within 90 days. Annual licensing cost $45M.',
          B: 'Build AI-native zero-trust architecture internally. 9-month timeline. $80M investment but no recurring license fees.',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 8, TL: -3 }, B: { MV: 5, TR: 8, OR: 2, TL: 8 } },
        insights: {
          A: { first: 'Rapid deployment reassures regulators and clients. Compliance boxes checked.', second: 'Vendor stack creates dependency. Configuration complexity becomes new attack surface. Internal security team atrophies.' },
          B: { first: 'Longer deployment window. Board patience tested again.', second: 'AI-native detection catches threats vendors miss. Internal team becomes industry-leading. Zero recurring license costs improve long-term margins.' },
        },
      },
      {
        id: 4, title: 'Regulatory Settlement', month: 'Month 9',
        scenario: 'Regulators have proposed a $350M fine — the largest in financial services history for a data breach. Your legal team believes they can negotiate it down to $180M over 18 months. Consumer groups are lobbying for the full amount. Your stock is down 15% since the breach.',
        choices: {
          A: 'Fight the fine aggressively. Hire top litigation firms. Contest the methodology. Target a $120M settlement.',
          B: 'Accept the $180M negotiated settlement. Publicly commit to exceeding regulatory requirements. Use the moment to announce a client data rights charter.',
        },
        scoring: { A: { MV: 8, TR: -5, OR: 8, TL: -5 }, B: { MV: 3, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Legal fight reduces headline number. CFO pleased with $120M outcome.', second: 'Adversarial stance with regulators poisons relationship. Consumer groups escalate. Trust recovery stalls.' },
          B: { first: 'Settlement accepted. Stock drops 3% on headline number. Then recovers.', second: 'Client data rights charter becomes industry benchmark. Regulators publicly praise cooperation. Trust inflection point.' },
        },
      },
      {
        id: 5, title: 'Trust Rebuild', month: 'Month 12',
        scenario: 'Twelve months post-breach. Security infrastructure is rebuilt. No repeat incidents. But client acquisition is still 30% below pre-breach levels. Your marketing team proposes a major rebrand. Your Chief Trust Officer argues the brand is not the problem — the product experience is. NPS is recovering but not yet positive.',
        choices: {
          A: 'Launch a $50M rebranding campaign with a new visual identity, tagline, and national advertising push focused on "The New Standard in Data Security."',
          B: 'Invest $50M in a client-facing AI transparency dashboard that shows real-time data usage, access logs, and security status for every account.',
        },
        scoring: { A: { MV: 7, TR: 3, OR: 5, TL: -2 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Rebrand gets attention. New client inquiries spike 20% in launch month.', second: 'Cosmetic rebrand without substance change leads to "lipstick on a pig" media narrative. Trust skeptics amplified.' },
          B: { first: 'Dashboard launches quietly. Initial adoption slow.', second: 'Clients who use dashboard have 3x higher retention. Word-of-mouth becomes primary growth channel. Competitors cannot replicate proprietary transparency layer.' },
        },
      },
      {
        id: 6, title: 'Strategic Transformation', month: 'Month 15',
        scenario: 'The breach forced a reckoning that transformed your security capabilities into a genuine competitive advantage. A major competitor now wants to license your security platform. Your board sees a new revenue stream. Your CTO worries about distraction from the core business.',
        choices: {
          A: 'License the security platform as a SaaS product. Create a new business unit. Target $200M ARR within 3 years.',
          B: 'Keep the platform proprietary. Use it as the foundation for premium-tier client offerings with security-as-a-feature pricing power.',
        },
        scoring: { A: { MV: 12, TR: 5, OR: 10, TL: -3 }, B: { MV: 8, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Licensing announcement drives stock up 10%. Analysts see platform optionality.', second: 'New business unit competes for engineering resources. Core product roadmap slows. Licensing clients become demanding support burden.' },
          B: { first: 'Premium tier pricing increases ARPU 25% among enterprise clients.', second: 'Security-as-feature becomes defining brand promise. No distraction from core business. Premium clients become most profitable segment.' },
        },
      },
    ],
    market: [
      {
        id: 1, title: 'Crisis Stabilization', month: 'Month 1',
        scenario: 'A sudden market crash has wiped 40% off your AUM in 6 weeks. Revenue is down 35%. The board is demanding immediate cost reductions of $200M. Your CRO says the sales pipeline has frozen — no new institutional mandates for 90 days. Cash reserves cover 8 months at current burn rate.',
        choices: {
          A: 'Implement immediate 20% workforce reduction across all divisions. Freeze all discretionary spending. Target $200M savings within 60 days.',
          B: 'Selective cost reduction targeting non-revenue operations. Protect client-facing teams. Accelerate AI automation of back-office functions to achieve $200M run-rate savings over 6 months.',
        },
        scoring: { A: { MV: 8, TR: 3, OR: 5, TL: -8 }, B: { MV: 5, TR: 7, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Immediate cost reduction meets board mandate. Analysts approve. Stock stabilizes.', second: 'Indiscriminate cuts remove institutional knowledge. Client-facing quality dips. Recovery capacity diminished.' },
          B: { first: 'Slower cost savings initially. Board questions pace. But operational continuity maintained.', second: 'AI automation creates permanent structural savings, not one-time cuts. Client teams intact for recovery. Best talent stays.' },
        },
      },
      {
        id: 2, title: 'Revenue Strategy', month: 'Month 3',
        scenario: 'The market shows early signs of stabilization but recovery is uneven. Your institutional clients are shifting to lower-fee passive products. Active management fees are under extreme pressure. Your AI team has a prototype for an algorithmic risk-management product that could open a new revenue stream, but it needs 6 months and $30M to productize.',
        choices: {
          A: 'Reduce active management fees by 30% to retain AUM. Accept margin compression. Focus on volume over value.',
          B: 'Invest $30M in the AI risk-management product. Maintain current fee structure for active management. Accept near-term AUM outflows.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 5, TL: -3 }, B: { MV: 3, TR: 7, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Fee reduction slows outflows. AUM stabilizes. But revenue per dollar managed drops 30%.', second: 'Race to the bottom on fees commoditizes the business. No structural advantage over passive providers.' },
          B: { first: 'Near-term AUM decline accelerates. CFO under pressure. Media covers the outflows.', second: 'AI risk product launches to strong institutional demand. New fee category commands premium pricing. Differentiation restored.' },
        },
      },
      {
        id: 3, title: 'Operational Efficiency', month: 'Month 6',
        scenario: 'Six months into the downturn. Your AI automation of back-office has reduced processing costs 40%. The savings are real. But your operations team is anxious — rumors of further automation replacing their roles. Unionization talk has started in two offices. Your CHRO warns of a morale crisis.',
        choices: {
          A: 'Announce the next wave of automation — middle-office functions including trade settlement, compliance reporting, and risk analytics. Project $150M additional savings.',
          B: 'Pause automation expansion. Launch an AI upskilling academy for operations staff. Commit publicly that no roles will be eliminated — they will be transformed.',
        },
        scoring: { A: { MV: 8, TR: 3, OR: 8, TL: -8 }, B: { MV: 3, TR: 8, OR: 3, TL: 10 } },
        insights: {
          A: { first: '$150M savings projection excites investors. Stock up 5%.', second: 'Unionization accelerates. Key operations talent exits. Automation deployed without human oversight creates operational risk.' },
          B: { first: 'Automation savings plateau temporarily. Board questions commitment to efficiency.', second: 'Upskilling academy becomes a cultural inflection point. Transformed operations staff become AI-human hybrid workforce — more effective than pure automation.' },
        },
      },
      {
        id: 4, title: 'Client Strategy', month: 'Month 9',
        scenario: 'The market has recovered 60% of its losses. Your AUM is recovering but client mix has shifted — more passive, less active. Your new AI risk product is gaining traction but cannibalizing your traditional advisory fees. The board wants a unified pricing strategy.',
        choices: {
          A: 'Bundle AI products with traditional advisory at a blended fee rate. Simplify pricing. Accept that margins on traditional advisory will permanently compress.',
          B: 'Create a tiered platform: self-service AI tools for price-sensitive clients, AI-augmented advisory for mid-tier, and bespoke AI-human partnership for ultra-high-net-worth.',
        },
        scoring: { A: { MV: 5, TR: 5, OR: 5, TL: 0 }, B: { MV: 8, TR: 8, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Simplified pricing is easy to sell. Client confusion eliminated.', second: 'Blended pricing undervalues AI products and overcharges for commoditized advisory. Structural margin erosion continues.' },
          B: { first: 'Tiered platform requires more complex operations. Implementation takes 4 months.', second: 'Each tier captures maximum willingness to pay. AI self-service attracts new client segment. UHNW tier margins expand 40%.' },
        },
      },
      {
        id: 5, title: 'Growth Investment', month: 'Month 12',
        scenario: 'Markets have fully recovered. Your stock is approaching pre-crash levels. The board is considering a $500M growth investment — either geographic expansion into Asia-Pacific or a vertical AI platform for alternative investments. Your strategy team is split. Asia-Pacific is a known growth market; alternative AI is unproven but potentially transformative.',
        choices: {
          A: 'Invest $500M in Asia-Pacific expansion. Open offices in Singapore, Hong Kong, and Sydney. Hire 300 local staff. Target $2B in new AUM within 24 months.',
          B: 'Invest $500M in building an AI-native alternative investments platform — covering private credit, real assets, and digital assets. No geographic expansion.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 8, TL: -3 }, B: { MV: 7, TR: 8, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'APAC expansion announced. Market approves of growth ambition. Stock up 7%.', second: 'Geographic expansion dilutes management attention. Regulatory complexity in 3 new jurisdictions. Integration challenges absorb 18 months.' },
          B: { first: 'Alternative AI platform is harder to explain to analysts. Mixed market reaction.', second: 'Platform captures growing institutional appetite for AI-managed alternatives. First-mover advantage in $15T market. No geographic complexity.' },
        },
      },
      {
        id: 6, title: 'New Normal', month: 'Month 15',
        scenario: 'Fifteen months post-crash. The industry has fundamentally shifted. Fee compression, AI automation, and passive investing have permanently altered the landscape. You need a definitive strategic identity for the next decade. Your advisor: "You can be the largest, or the most differentiated. Not both."',
        choices: {
          A: 'Pursue scale through M&A. Acquire two mid-tier competitors to become a top-5 global asset manager. Leverage scale for cost advantages and distribution.',
          B: 'Pursue differentiation through AI specialization. Position as the premier AI-augmented investment firm. Accept smaller AUM but higher margins and brand premium.',
        },
        scoring: { A: { MV: 10, TR: 3, OR: 10, TL: -5 }, B: { MV: 7, TR: 10, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'M&A announcements create market excitement. Scale narrative is compelling.', second: 'Integration of two acquisitions simultaneously is operationally brutal. Culture clashes. Talent attrition at acquired firms. Operational risk spikes.' },
          B: { first: 'Differentiation strategy initially disappoints growth-focused analysts.', second: 'AI specialization creates premium brand. Best talent gravitates to the mission. Client loyalty deepens. Margins expand. Sustainable competitive advantage built.' },
        },
      },
    ],
    product: [
      {
        id: 1, title: 'Damage Control', month: 'Month 1',
        scenario: 'Your flagship AI-powered portfolio optimization tool recommended concentrated positions that lost clients an average of 28% in a single quarter. The algorithm had a training data bias that was not caught in testing. Media coverage is brutal. Three class-action lawsuits have been filed. The product has been pulled from market.',
        choices: {
          A: 'Issue a technical post-mortem, compensate affected clients from reserves, and engage an external AI auditor to certify the fix before relaunch.',
          B: 'CEO takes personal responsibility in a public address. Announce a client-first remediation fund and invite affected clients to participate in redesigning the product\'s risk controls.',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 5, TL: 0 }, B: { MV: 3, TR: 12, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Technical post-mortem praised by industry peers. External audit provides credibility.', second: 'Arm\'s-length approach lacks emotional resonance with affected clients. Compensation feels transactional, not relational.' },
          B: { first: 'CEO address goes viral. "Unprecedented accountability" narrative dominates.', second: 'Client co-design process creates deep loyalty. Redesigned risk controls exceed industry standards. Affected clients become strongest advocates.' },
        },
      },
      {
        id: 2, title: 'Product Rebuild', month: 'Month 3',
        scenario: 'The product is being rebuilt. Your CTO proposes two architectures: (a) a constrained AI model with hard risk limits — it will never produce outsized returns but will never blow up; (b) an advanced model with AI-driven dynamic risk management that can learn and adapt in real-time but has a higher complexity ceiling.',
        choices: {
          A: 'Deploy the constrained model. Hard risk limits. Simpler to audit. Lower ceiling but bulletproof floor. "Safe and sound."',
          B: 'Deploy the advanced adaptive model with AI-driven risk management. Higher capability ceiling. Requires ongoing human oversight. "Intelligent and adaptive."',
        },
        scoring: { A: { MV: 5, TR: 7, OR: 3, TL: 0 }, B: { MV: 8, TR: 3, OR: 7, TL: 5 } },
        insights: {
          A: { first: 'Constrained model passes all compliance reviews. Regulators approve. Clients feel safe.', second: 'Performance ceiling means institutional clients eventually seek more sophisticated solutions elsewhere. Product becomes commoditized.' },
          B: { first: 'Advanced model raises eyebrows with regulators. Additional scrutiny required.', second: 'Adaptive AI learns from market conditions. Performance improves over time. Institutional clients see genuine alpha generation. Human oversight creates trust layer.' },
        },
      },
      {
        id: 3, title: 'Relaunch Strategy', month: 'Month 6',
        scenario: 'The rebuilt product is ready for relaunch. Your CMO proposes a massive launch event — "The Second Act" — with live demonstrations, client testimonials, and media coverage. Your Chief Trust Officer argues for a quiet, phased rollout with existing clients first, building proof points before going public.',
        choices: {
          A: 'Full public relaunch with "The Second Act" event. Maximum visibility. High stakes — if it works, the narrative flips completely.',
          B: 'Quiet phased rollout to existing clients. Build 6 months of performance data. Then go public with proven results.',
        },
        scoring: { A: { MV: 10, TR: 3, OR: 8, TL: -2 }, B: { MV: 5, TR: 8, OR: 2, TL: 5 } },
        insights: {
          A: { first: '"The Second Act" generates massive media coverage. Stock jumps 8% on relaunch day.', second: 'High-visibility relaunch creates enormous pressure to perform immediately. Any early hiccup becomes front-page news.' },
          B: { first: 'Quiet rollout generates no media buzz. Analysts impatient for results.', second: 'Six months of proven performance data becomes most powerful marketing asset. Client testimonials are genuine. Relaunch from strength, not hope.' },
        },
      },
      {
        id: 4, title: 'Competitive Response', month: 'Month 9',
        scenario: 'Two competitors have launched AI portfolio products directly targeting your displaced clients. One offers a loss-guarantee product (capped returns but no downside beyond 5%). The other offers an AI product with full transparency — clients can see every model decision in real-time. Your product is better technically but your brand is still healing.',
        choices: {
          A: 'Match the loss-guarantee with your own "Protected AI Portfolio" product. Accept the margin hit to eliminate the competitive threat.',
          B: 'Out-innovate on transparency. Launch an AI Explainability Layer that not only shows decisions but explains the reasoning in plain language. Position as "the only AI you can actually understand."',
        },
        scoring: { A: { MV: 5, TR: 5, OR: 7, TL: -2 }, B: { MV: 8, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Protected product attracts risk-averse clients. Revenue stabilizes.', second: 'Guarantee creates balance sheet risk. If markets crash again, the guarantee liability could be existential.' },
          B: { first: 'Explainability Layer receives industry awards. Media narrative: "From failure to gold standard."', second: 'Plain-language AI explanations become client acquisition engine. Regulatory bodies cite your approach as model for industry.' },
        },
      },
      {
        id: 5, title: 'Scale Decision', month: 'Month 12',
        scenario: 'Your rebuilt product is outperforming competitors. AUM has recovered to 80% of pre-failure levels. The board wants to accelerate. Two paths: (a) license the AI engine to other financial institutions as a B2B platform, or (b) use the technology advantage to move into adjacent markets — insurance, lending, real estate.',
        choices: {
          A: 'License the AI engine as a B2B platform. Target 15 financial institution partners. Revenue model: SaaS + performance fees.',
          B: 'Expand into adjacent markets using the AI engine. Launch AI-powered products in insurance risk assessment and real estate valuation.',
        },
        scoring: { A: { MV: 10, TR: 3, OR: 8, TL: -3 }, B: { MV: 7, TR: 7, OR: 5, TL: 5 } },
        insights: {
          A: { first: 'B2B licensing creates new revenue stream. 5 institutions sign LOIs within 60 days.', second: 'Licensing your core IP to competitors dilutes competitive advantage. Support burden of 15 B2B clients diverts engineering resources.' },
          B: { first: 'Adjacent market entry is complex. Insurance and real estate require domain expertise.', second: 'AI engine proves transferable. Cross-market data improves all products. Diversified revenue reduces cyclicality. No competitive dilution.' },
        },
      },
      {
        id: 6, title: 'Future Architecture', month: 'Month 15',
        scenario: 'Fifteen months after the product failure. The product that nearly destroyed the company has been rebuilt into its most valuable asset. The board is planning the next three years. Your Chief Strategy Officer presents the final fork: build an AI-first financial super-app, or stay focused as the best-in-class AI portfolio platform.',
        choices: {
          A: 'Build the super-app. Combine portfolio management, banking, insurance, and financial planning into a single AI-powered platform. $1B investment over 3 years.',
          B: 'Stay focused. Deepen AI portfolio capabilities. Build the definitive platform for institutional and HNW portfolio management. Best-in-class, not broadest.',
        },
        scoring: { A: { MV: 12, TR: 3, OR: 12, TL: -5 }, B: { MV: 8, TR: 8, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Super-app vision excites Wall Street. Stock surges on announcement. Massive hiring begins.', second: 'Scope explosion. $1B investment with 3-year payback is existential bet. Execution risk is enormous. Culture diluted by rapid hiring.' },
          B: { first: 'Focus strategy underwhelms growth-hungry analysts. Stock flat on announcement.', second: 'Deep specialization creates unassailable expertise. Institutional clients consolidate with you. Margins expand. Culture strengthened. Sustainable moat built.' },
        },
      },
    ],
  },

  healthcare: {
    competitor: [
      {
        id: 1, title: 'AI Diagnostic Threat', month: 'Month 1',
        scenario: 'An AI-native startup has launched a diagnostic platform that delivers pathology results in 4 hours instead of your 72-hour turnaround. Three hospital systems representing 15% of your revenue have begun pilot programs with the competitor. Your medical director questions the accuracy of their AI model but acknowledges the speed advantage is real.',
        choices: {
          A: 'Partner with the AI startup as a distribution channel — license their speed layer while maintaining your lab\'s quality assurance as the gold standard.',
          B: 'Accelerate internal AI development. Redirect $40M from facility expansion to build a proprietary AI diagnostic engine trained on your 30 years of pathology data.',
        },
        scoring: { A: { MV: 8, TR: 5, OR: 7, TL: -3 }, B: { MV: 5, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Partnership announced within 30 days. Hospital pilots convert to joint offering.', second: 'Dependency on competitor technology limits long-term differentiation. They control the roadmap.' },
          B: { first: 'Internal development slower. Two hospital systems complete competitor pilot in the interim.', second: 'Proprietary AI trained on 30 years of data achieves superior accuracy. Institutional knowledge becomes unassailable moat.' },
        },
      },
      {
        id: 2, title: 'Physician Retention', month: 'Month 3',
        scenario: 'The AI competitor is hiring your senior pathologists at 50% premiums. They are positioning themselves as "the future of diagnostics" and your physicians want to be on the winning side. Four department heads have accepted offers. Remaining staff morale is at an all-time low.',
        choices: {
          A: 'Counter-offer with 35% raises, retention bonuses, and expanded research budgets. Make it expensive for them to leave.',
          B: 'Launch an AI Co-Pilot program where physicians design and train AI models alongside engineers. Publish research papers. Position physicians as AI innovators, not legacy practitioners.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 5, TL: 3 }, B: { MV: 3, TR: 7, OR: 2, TL: 10 } },
        insights: {
          A: { first: 'Retention improves. Budget impact significant but manageable.', second: 'Money solves the symptom but not the cause. Physicians stay for the paycheck, not the mission.' },
          B: { first: 'Co-Pilot program takes 3 months to launch. Some departures continue.', second: 'Published research elevates institutional reputation. Physicians become co-creators. Recruiting advantage shifts — top residents want to join the program.' },
        },
      },
      {
        id: 3, title: 'Hospital System Response', month: 'Month 6',
        scenario: 'Your three largest hospital system clients have completed competitor pilots. Results are mixed — speed is better but accuracy is 3% lower for complex cases. The hospitals want the best of both worlds. They are proposing a "bake-off" — head-to-head comparison over 90 days.',
        choices: {
          A: 'Accept the bake-off. Deploy your best resources. Win on accuracy and depth of insight. Let the data speak.',
          B: 'Propose an alternative — a hybrid model where your AI handles complex cases and the competitor handles routine screenings. Position yourself as the premium tier.',
        },
        scoring: { A: { MV: 8, TR: 7, OR: 5, TL: 3 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Bake-off is risky but competitive. Energizes internal teams.', second: 'Win or lose, the bake-off frames healthcare AI as a commodity race. Even winning does not change the paradigm.' },
          B: { first: 'Hybrid model proposal surprises hospitals. Several find it compelling.', second: 'Premium positioning captures highest-value cases. Margin expansion on complex diagnostics. Competitor handles low-margin volume you did not want.' },
        },
      },
      {
        id: 4, title: 'Regulatory Advantage', month: 'Month 9',
        scenario: 'The FDA is accelerating AI diagnostic regulation. Your competitor\'s model has not been submitted for FDA approval — they have been operating under the "clinical decision support" exemption. The regulatory window is closing. Your medical affairs team says you can be first-to-market with an FDA-cleared AI diagnostic if you fast-track the submission.',
        choices: {
          A: 'Fast-track FDA submission for your AI diagnostic engine. Invest $25M in regulatory affairs. Target clearance in 6 months.',
          B: 'Go beyond FDA minimum. Build a comprehensive AI safety framework that includes explainability, bias auditing, and continuous monitoring. Submit as a flagship program. Target 9 months.',
        },
        scoring: { A: { MV: 8, TR: 7, OR: 5, TL: 0 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'FDA fast-track granted. Market first-mover advantage within reach.', second: 'Minimum-viable compliance leaves gaps. Future regulatory tightening will require rework.' },
          B: { first: 'Comprehensive framework adds 3 months. Competitor may submit first.', second: 'FDA cites your framework as model for industry. Regulatory moat established. Future compliance costs near zero.' },
        },
      },
      {
        id: 5, title: 'Market Expansion', month: 'Month 12',
        scenario: 'FDA clearance secured. Your AI diagnostic platform is the first cleared solution in your category. The competitor is now scrambling for their own clearance. Hospital systems are returning. The board wants to capitalize — expand into telemedicine-integrated diagnostics or deepen the current diagnostic platform with genomics and precision medicine capabilities.',
        choices: {
          A: 'Expand into telemedicine-integrated diagnostics. Partner with three major telehealth platforms. Reach patients who never visit a hospital.',
          B: 'Deepen the platform with genomics and precision medicine AI. Build the definitive diagnostic intelligence platform for complex care.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 7, TL: -2 }, B: { MV: 7, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Telehealth partnerships expand addressable market 5x. Revenue potential enormous.', second: 'Telemedicine integration dilutes clinical reputation. Routine telehealth diagnostics commoditize the AI. Brand confusion.' },
          B: { first: 'Genomics platform takes 9 months to build. Slower revenue growth.', second: 'Precision medicine AI creates highest-value diagnostic capability. Academic medical centers become core clients. Research collaborations generate IP.' },
        },
      },
      {
        id: 6, title: 'Strategic Identity', month: 'Month 15',
        scenario: 'Fifteen months into the competitive battle. You have FDA clearance, a deepening AI platform, and recovering market share. The competitor has pivoted to routine diagnostics — conceding the complex-care market. Your CSO presents the final strategic choice: platform company or clinical excellence company.',
        choices: {
          A: 'Become a platform company. License your FDA-cleared AI to hospitals globally. Build an ecosystem of third-party diagnostic applications on your platform.',
          B: 'Stay clinical. Use AI to become the most trusted name in complex diagnostics. Partner with academic medical centers for research. Win the Nobels, not the market-cap race.',
        },
        scoring: { A: { MV: 12, TR: 5, OR: 10, TL: -5 }, B: { MV: 8, TR: 10, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Platform announcement drives massive market reaction. Analyst upgrades across the board.', second: 'Platform complexity explodes. Regulatory requirements for third-party apps are overwhelming. Clinical focus diluted.' },
          B: { first: 'Clinical excellence story is less exciting to Wall Street. Steady but unspectacular growth.', second: 'Research partnerships produce breakthrough diagnostics. Clinical reputation becomes institutional moat. Best physicians in the world want to work here.' },
        },
      },
    ],
    breach: [
      {
        id: 1, title: 'Patient Data Crisis', month: 'Month 1',
        scenario: 'A ransomware attack has encrypted your electronic health records system. 8 million patient records are inaccessible. Emergency departments at 12 hospitals in your network are operating on paper. The attackers are demanding $15M in Bitcoin. Patient care is being compromised — two adverse events have been reported.',
        choices: {
          A: 'Refuse to pay ransom. Activate disaster recovery. Deploy backup systems. Accept 72-hour recovery timeline. Notify law enforcement.',
          B: 'Pay the ransom to restore immediate access. Simultaneously activate forensics and backup recovery. Prioritize patient safety above all other considerations.',
        },
        scoring: { A: { MV: 5, TR: 7, OR: 5, TL: 3 }, B: { MV: 3, TR: 3, OR: 3, TL: -3 } },
        insights: {
          A: { first: '72-hour recovery period is brutal. More adverse events reported. But precedent is clear: no ransom.', second: 'Refusal to pay establishes organizational integrity. Recovery strengthens infrastructure. FBI cooperation creates security partnership.' },
          B: { first: 'Systems restored in 8 hours. Patient care normalized. But "we paid" becomes the narrative.', second: 'Payment emboldens attackers. Organization becomes known target. Insurance premiums spike. Regulatory criticism of payment decision.' },
        },
      },
      {
        id: 2, title: 'HIPAA Response', month: 'Month 3',
        scenario: 'HHS has opened a HIPAA investigation. Forensics reveal the ransomware entered through a third-party medical device vendor. Your legal team says liability may be shared. However, the public narrative is that your organization failed to protect patients. Patient advocacy groups are organizing protests at your headquarters.',
        choices: {
          A: 'Assert shared liability with the medical device vendor. Engage litigation to recover damages. Protect organizational interests.',
          B: 'Accept full responsibility publicly regardless of vendor liability. Announce a Patient Data Bill of Rights. Launch a free health identity monitoring program for all affected patients.',
        },
        scoring: { A: { MV: 5, TR: -3, OR: 7, TL: -5 }, B: { MV: 3, TR: 12, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Legal position strengthened. Vendor settlement likely. Costs reduced.', second: 'Finger-pointing narrative dominates media. Patients feel abandoned. Trust recovery stalls for years.' },
          B: { first: 'Full responsibility is expensive and risky. But patient advocacy groups become allies overnight.', second: 'Patient Data Bill of Rights becomes industry standard. Organization positioned as patient-first leader. Trust recovery accelerates dramatically.' },
        },
      },
      {
        id: 3, title: 'Infrastructure Rebuild', month: 'Month 6',
        scenario: 'The EHR system needs a complete security overhaul. Two paths: migrate to a major cloud provider\'s healthcare platform (Azure Healthcare, AWS HealthLake) or build a sovereign health data infrastructure with on-premises AI security. Your CISO favors cloud for speed. Your CMO (Chief Medical Officer) worries about patient data leaving the premises.',
        choices: {
          A: 'Migrate to cloud healthcare platform. Faster deployment. Lower initial cost. Industry-standard security. Accept shared infrastructure.',
          B: 'Build sovereign health data infrastructure. On-premises with AI-native security. Higher cost, longer timeline. Complete data sovereignty.',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 7, TL: -2 }, B: { MV: 3, TR: 8, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Cloud migration completed in 4 months. Operations normalized. Cost-effective.', second: 'Shared cloud infrastructure means your security is only as strong as the platform. Patient data sovereignty concerns persist.' },
          B: { first: 'Sovereign infrastructure takes 10 months. Board patience tested severely.', second: 'Complete data sovereignty becomes differentiator. "Your data never leaves our walls" becomes the trust promise. Regulatory gold standard.' },
        },
      },
      {
        id: 4, title: 'Clinical Trust Recovery', month: 'Month 9',
        scenario: 'Your new security infrastructure is operational. No repeat incidents. But physician referral rates are still 25% below pre-breach levels. Physicians are reluctant to trust the EHR with sensitive patient data. A physician survey reveals the issue is not technology — it is communication. They do not understand what changed.',
        choices: {
          A: 'Launch a physician education campaign. Conduct briefings at every major referring hospital. Demonstrate the new security architecture. Provide certification of compliance.',
          B: 'Create a Physician Security Council — give referring physicians real governance authority over data security decisions. Transparent reporting. Shared accountability.',
        },
        scoring: { A: { MV: 5, TR: 5, OR: 5, TL: 0 }, B: { MV: 3, TR: 10, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Education campaign well-received. Referral rates recover partially.', second: 'One-way communication does not build trust — it lectures. Physicians remain passive recipients, not active participants.' },
          B: { first: 'Physician Council takes time to establish. Some skepticism initially.', second: 'Shared governance creates genuine trust. Physicians become ambassadors. Referral rates exceed pre-breach levels. Model replicated at industry conferences.' },
        },
      },
      {
        id: 5, title: 'Innovation From Crisis', month: 'Month 12',
        scenario: 'Twelve months post-breach. Your security infrastructure is now genuinely best-in-class. The breach forced innovations that would never have happened otherwise. Your board sees an opportunity — your health data security platform could be commercialized. Three hospital networks have informally asked if they can license your security stack.',
        choices: {
          A: 'Commercialize the security platform. Create a healthcare cybersecurity business unit. Target $100M in licensing revenue within 2 years.',
          B: 'Share the security framework as open-source for the healthcare industry. Position the organization as the standard-setter. Monetize through consulting and implementation services.',
        },
        scoring: { A: { MV: 10, TR: 3, OR: 8, TL: -3 }, B: { MV: 5, TR: 12, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Commercialization creates new revenue stream. Business unit launched. Early traction strong.', second: 'Selling security after being breached creates narrative dissonance. Core clinical mission diluted by SaaS business.' },
          B: { first: 'Open-source announcement generates massive goodwill. Industry-wide adoption begins.', second: 'Organization becomes the center of gravity for healthcare cybersecurity. Consulting revenue exceeds what licensing would have generated. Trust leadership cemented.' },
        },
      },
      {
        id: 6, title: 'Strategic Transformation', month: 'Month 15',
        scenario: 'The breach that nearly destroyed the organization has catalyzed a transformation into the most trusted healthcare data organization in the country. The final strategic choice: scale the trust advantage horizontally across healthcare, or deepen vertically into clinical AI where trusted data is the foundation.',
        choices: {
          A: 'Scale horizontally. Become the trusted health data infrastructure for the entire healthcare ecosystem — hospitals, insurers, pharma, research institutions.',
          B: 'Deepen vertically. Use trusted data as the foundation for clinical AI. Build diagnostic, treatment planning, and drug discovery AI that only works because the data is trusted.',
        },
        scoring: { A: { MV: 12, TR: 5, OR: 10, TL: -5 }, B: { MV: 8, TR: 10, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Horizontal scaling creates platform economics. Market cap doubles on the vision.', second: 'Complexity of serving hospitals, insurers, pharma, and research simultaneously is staggering. Execution risk is existential.' },
          B: { first: 'Clinical AI deepening is less flashy. Growth is organic but compounding.', second: 'Trusted data + clinical AI creates capabilities no competitor can replicate. Drug discovery partnerships generate unprecedented value. Mission alignment retained.' },
        },
      },
    ],
    market: [
      {
        id: 1, title: 'Reimbursement Crisis', month: 'Month 1',
        scenario: 'A sudden change in Medicare reimbursement rates has cut revenue by 30% overnight. Commercial insurers are following suit. Your hospital network is burning $50M per quarter. The CFO says you have 6 months of runway at current burn. Three rural hospitals in your network are approaching insolvency.',
        choices: {
          A: 'Close the three rural hospitals. Consolidate services at urban centers. Reduce workforce by 2,000. Save $180M annually.',
          B: 'Convert rural hospitals to AI-enabled community health hubs — telemedicine, AI triage, remote monitoring. Reduce cost structure 60% while maintaining access. Save $120M with smaller workforce reductions.',
        },
        scoring: { A: { MV: 8, TR: -3, OR: 5, TL: -8 }, B: { MV: 5, TR: 8, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Immediate cost reduction meets financial targets. Bond rating stabilized.', second: 'Rural closures generate devastating community impact. Political backlash. Media narrative: "Healthcare system abandons the vulnerable."' },
          B: { first: 'Community health hubs take 6 months to deploy. Savings delayed.', second: 'AI-enabled hubs become model for rural healthcare nationally. Political support. Patient outcomes improve. Operating costs permanently lower.' },
        },
      },
      {
        id: 2, title: 'Workforce Strategy', month: 'Month 3',
        scenario: 'The financial pressure is accelerating. Your nurses union is demanding hazard pay. Physician burnout is at critical levels — 40% report considering leaving medicine. AI could automate 30% of clinical documentation but the union sees it as a threat to jobs. The CHRO says you are 6 months from a staffing crisis.',
        choices: {
          A: 'Deploy AI clinical documentation immediately. Reduce administrative staff by 25%. Redirect savings to nurse and physician compensation.',
          B: 'Co-design the AI documentation rollout with the nurses union. Agree that all savings go to frontline worker compensation and no documentation roles are eliminated for 24 months. Slower deployment but workforce buy-in.',
        },
        scoring: { A: { MV: 7, TR: 3, OR: 7, TL: -7 }, B: { MV: 3, TR: 8, OR: 2, TL: 10 } },
        insights: {
          A: { first: 'AI deployment fast. Documentation time reduced 40%. Savings achieved.', second: 'Union grievances filed. Strike threats. Administrative staff departure creates knowledge gaps. Physicians forced to handle tasks they are not trained for.' },
          B: { first: 'Co-design process takes 4 months. Slower savings realization.', second: 'Union becomes AI champion. Documentation staff retrained as AI operators. Workforce stability. Zero grievances. Model partnership replicated nationally.' },
        },
      },
      {
        id: 3, title: 'Revenue Innovation', month: 'Month 6',
        scenario: 'Traditional fee-for-service revenue continues to decline. Your AI team has developed a population health management platform that could shift the business to value-based care contracts. The platform predicts hospital readmissions with 92% accuracy. Three major insurers are interested in risk-sharing contracts based on the AI\'s predictions.',
        choices: {
          A: 'Aggressively pursue value-based contracts. Transition 50% of revenue to risk-sharing within 18 months. Accept volatility for upside potential.',
          B: 'Pilot value-based contracts with one insurer. Maintain fee-for-service for stability. Prove the AI model works before committing the organization.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 10, TL: -3 }, B: { MV: 5, TR: 8, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Aggressive transition excites analysts. Forward-looking revenue model.', second: 'Transitioning 50% of revenue simultaneously is operationally catastrophic. Staff not trained for value-based care. Risk-sharing losses if AI predictions fail in production.' },
          B: { first: 'Pilot approach is conservative. Some analysts question pace.', second: 'Pilot reveals AI needs refinement in real-world conditions. Adjustments made before scaling. When full transition occurs, model is proven and staff is trained.' },
        },
      },
      {
        id: 4, title: 'Technology Investment', month: 'Month 9',
        scenario: 'The pilot is showing strong results. AI-predicted interventions have reduced readmissions 35% in the pilot population. The board approves a $200M technology investment. Two paths: build an AI-powered hospital operating system that optimizes everything from staffing to supply chain, or build a patient-facing AI health platform that keeps patients healthy and out of hospitals.',
        choices: {
          A: 'Build the hospital operating system. Optimize internal operations. Reduce cost-per-patient 25%. Supply chain, staffing, bed management, OR scheduling — all AI-driven.',
          B: 'Build the patient-facing AI health platform. Preventive care, remote monitoring, AI health coaching. Keep patients healthy. Reduce hospital utilization.',
        },
        scoring: { A: { MV: 8, TR: 3, OR: 7, TL: -3 }, B: { MV: 5, TR: 10, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Hospital OS delivers immediate efficiency gains. Cost-per-patient drops dramatically.', second: 'Efficiency-focused AI treats patients as throughput. Physician satisfaction drops. Optimal for the P&L, suboptimal for care quality.' },
          B: { first: 'Patient platform takes longer to show ROI. Preventive care does not generate immediate revenue.', second: 'Healthier patients create value-based care advantage. Hospital utilization drops by design. Patients become loyal advocates. Physician satisfaction soars.' },
        },
      },
      {
        id: 5, title: 'Partnership Decision', month: 'Month 12',
        scenario: 'Your AI health platform is gaining traction. A major tech company (think Google Health or Apple Health) approaches with a partnership offer — integrate your clinical AI into their consumer health ecosystem. Massive distribution (500M users) but significant data-sharing requirements. Your CMO is excited about the reach. Your CISO and ethics board are deeply concerned.',
        choices: {
          A: 'Accept the partnership. Integrate clinical AI into the tech platform. Accept data-sharing requirements. Reach 500M users.',
          B: 'Decline the partnership. Build your own direct-to-patient platform. Slower growth but complete data sovereignty and clinical control.',
        },
        scoring: { A: { MV: 12, TR: -3, OR: 10, TL: -5 }, B: { MV: 5, TR: 10, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Partnership announcement is massive. Market cap surges. User acquisition explodes.', second: 'Tech company controls the patient relationship. Data-sharing creates regulatory exposure. Clinical integrity compromised by consumer UX demands.' },
          B: { first: 'Declining the partnership puzzles analysts. Slower user growth.', second: 'Direct patient relationship creates unmatched trust. Clinical data sovereignty preserved. Regulatory position pristine. Growth slower but sustainable and defensible.' },
        },
      },
      {
        id: 6, title: 'Future of Care', month: 'Month 15',
        scenario: 'Fifteen months after the market crisis. Your AI-powered health system has transformed from a fee-for-service hospital network into a value-based health organization. The final question: do you scale this model nationally through M&A, or do you open-source the model and become the standard-setter for the industry?',
        choices: {
          A: 'Scale through M&A. Acquire 5 regional health systems. Become a top-3 national health organization. Use AI platform as the integration backbone.',
          B: 'Open-source the AI health model. Publish everything — algorithms, protocols, outcomes data. Become the standard. Monetize through training, certification, and consulting.',
        },
        scoring: { A: { MV: 12, TR: 3, OR: 12, TL: -5 }, B: { MV: 7, TR: 12, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'M&A creates national healthcare giant. Scale economics are compelling.', second: 'Integrating 5 health systems simultaneously is historically unprecedented in complexity. Culture clashes. Operational risk is existential.' },
          B: { first: 'Open-source announcement generates global attention. Industry adoption begins.', second: 'Standard-setting position creates permanent influence. Training and consulting revenue is high-margin. Clinical mission preserved. Global health impact.' },
        },
      },
    ],
    product: [
      {
        id: 1, title: 'Patient Safety Crisis', month: 'Month 1',
        scenario: 'Your AI-powered drug interaction checker failed to flag a critical interaction between two commonly prescribed medications. 47 patients experienced adverse reactions. 3 are in critical condition. The FDA has issued an emergency use restriction. Your stock dropped 22% overnight. The media narrative: "AI nearly killed patients."',
        choices: {
          A: 'Immediately pull the AI system. Revert to manual drug interaction checks. Engage a third-party auditor. Communicate through legal counsel.',
          B: 'Pull the system but simultaneously deploy a transparent patient safety dashboard. CEO addresses media directly. Open the AI model for external safety review. Announce a patient compensation fund without waiting for litigation.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 5, TL: 0 }, B: { MV: 3, TR: 12, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Controlled response. Legal exposure minimized. Operations continue with manual checks.', second: 'Defensive posture fuels narrative that the organization cares more about liability than patients. Trust collapse accelerates.' },
          B: { first: 'Radical transparency is unprecedented in healthcare. Media shifts from attack to cautious respect.', second: 'Patient safety dashboard becomes model for industry. External review improves AI. Compensation fund prevents litigation and builds goodwill.' },
        },
      },
      {
        id: 2, title: 'System Redesign', month: 'Month 3',
        scenario: 'The AI system is being redesigned. Your engineering team proposes two approaches: (a) a rule-based system augmented by AI — every AI recommendation passes through a clinical rules engine before reaching the physician; (b) an advanced AI system with explainable reasoning that shows the physician exactly why each recommendation was made, with confidence scores.',
        choices: {
          A: 'Rule-based system with AI augmentation. Deterministic. Auditable. No AI recommendation reaches a physician without passing explicit clinical rules.',
          B: 'Explainable AI with confidence scoring. More powerful but requires physician judgment on borderline cases. "AI as advisor, physician as decider."',
        },
        scoring: { A: { MV: 5, TR: 7, OR: 3, TL: -2 }, B: { MV: 8, TR: 5, OR: 5, TL: 7 } },
        insights: {
          A: { first: 'Rule-based system passes FDA review. Physicians find it reliable but limited.', second: 'Clinical rules engine caps capability. Novel drug interactions outside the rules database are missed. System is safe but not smart.' },
          B: { first: 'Explainable AI requires physician training. Adoption slower initially.', second: 'Physicians who use the system report higher clinical confidence. Novel interactions caught that rules-based system would miss. "AI as advisor" model becomes preferred approach.' },
        },
      },
      {
        id: 3, title: 'Clinical Relaunch', month: 'Month 6',
        scenario: 'The redesigned system is ready. FDA has provided conditional clearance pending real-world monitoring. Your CMO wants a full relaunch at the American Medical Association annual meeting. Your patient safety officer argues for a quiet rollout to 5 pilot hospitals with 6 months of monitoring data before any public announcement.',
        choices: {
          A: 'Relaunch at AMA conference. Maximum visibility. Present redesigned system and clinical data. High-profile physician endorsements.',
          B: 'Quiet rollout to 5 pilot hospitals. Collect 6 months of real-world safety data. Publish peer-reviewed results. Then announce broadly.',
        },
        scoring: { A: { MV: 10, TR: 3, OR: 8, TL: -2 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'AMA relaunch generates attention. Physician endorsements are powerful. Stock recovers 10%.', second: 'Public relaunch without real-world data is risky. Any adverse event during early deployment becomes catastrophic.' },
          B: { first: 'Quiet rollout generates no media coverage. Board impatient for visible recovery.', second: 'Six months of clean safety data becomes most powerful marketing asset. Peer-reviewed publication provides scientific credibility no marketing spend can buy.' },
        },
      },
      {
        id: 4, title: 'Competitive Landscape', month: 'Month 9',
        scenario: 'During your quiet period, two competitors launched AI drug interaction checkers. One is aggressive on marketing, the other is winning on clinical accuracy benchmarks. Your pilot data shows your redesigned system outperforms both on safety metrics but you have not published yet. The market is being defined without you.',
        choices: {
          A: 'Accelerate publication and marketing. Release preliminary pilot data. Launch a competitive comparison campaign. Reclaim the narrative.',
          B: 'Stay the course. Complete the full 6-month pilot. Publish comprehensive results. Let competitors define the market — then redefine it with superior data.',
        },
        scoring: { A: { MV: 8, TR: 3, OR: 7, TL: -2 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Preliminary data release grabs attention. Competitive comparison resonates with hospitals.', second: 'Preliminary data is incomplete. Competitors attack methodology. "Rushing to market again" narrative emerges.' },
          B: { first: 'Competitors continue to gain market share during waiting period.', second: 'Comprehensive publication is definitive. No methodological attacks possible. Hospitals that adopted competitors begin switching. Patience rewarded.' },
        },
      },
      {
        id: 5, title: 'Platform Expansion', month: 'Month 12',
        scenario: 'Your AI drug interaction system has regained market leadership. Hospitals are returning. The platform generates rich clinical data that could power new AI applications — treatment planning, clinical trial matching, adverse event prediction. The board wants to expand. Your chief scientist says the data is the real asset.',
        choices: {
          A: 'Build a clinical AI platform. Drug interactions, treatment planning, trial matching, adverse event prediction — all integrated. Become the clinical AI operating system.',
          B: 'Focus on making the drug interaction system the undisputed best in the world. Deepen accuracy, expand drug coverage, add pharmacogenomics. Win one category completely.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 8, TL: -3 }, B: { MV: 7, TR: 8, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Platform vision excites investors. Multiple revenue streams visible.', second: 'Expanding across 4 clinical domains simultaneously dilutes expertise. Drug interaction quality drops as engineering attention fragments.' },
          B: { first: 'Single-product focus seems limiting. Analysts want broader platform story.', second: 'Drug interaction system becomes undisputed gold standard. Pharmacogenomics integration is transformative. Depth creates unassailable market position.' },
        },
      },
      {
        id: 6, title: 'Legacy Definition', month: 'Month 15',
        scenario: 'The product that nearly killed patients is now saving lives at unprecedented scale. The final decision: monetize aggressively through premium licensing, or make the core safety algorithms available to every healthcare system globally, monetizing through premium features and implementation support.',
        choices: {
          A: 'Premium licensing model. Maximize revenue per hospital. $500K annual licenses for the full platform. Target $300M ARR within 3 years.',
          B: 'Freemium model. Core safety algorithms free for every hospital globally. Premium features and support for enterprise clients. Target global adoption first, monetization second.',
        },
        scoring: { A: { MV: 12, TR: 3, OR: 7, TL: -3 }, B: { MV: 7, TR: 12, OR: 2, TL: 8 } },
        insights: {
          A: { first: 'Premium pricing generates strong revenue from wealthy health systems.', second: 'Safety technology behind a paywall creates ethical narrative problem. Small hospitals and developing nations excluded. "Profiting from safety" attacks begin.' },
          B: { first: 'Free core algorithms adopted by 2,000 hospitals in 12 months. Premium conversion at 15%.', second: 'Global adoption creates data network effects. Premium features powered by the world\'s largest clinical dataset. Ethical positioning is unassailable. Revenue follows mission.' },
        },
      },
    ],
  },

  retail: {
    competitor: [
      {
        id: 1, title: 'AI Commerce Disruption', month: 'Month 1',
        scenario: 'An AI-native e-commerce platform has launched a personalized shopping experience that curates products using computer vision and purchase history. They are converting browsers at 3x your rate. Your online revenue has dropped 12% in 90 days. Your CMO says the customer experience gap is the widest it has ever been.',
        choices: {
          A: 'License an AI personalization engine from a top vendor (Dynamic Yield / Adobe). Deploy across your e-commerce platform within 60 days.',
          B: 'Build a proprietary AI recommendation engine trained on your 15 years of customer purchase data and unique product catalog knowledge.',
        },
        scoring: { A: { MV: 8, TR: 5, OR: 7, TL: -3 }, B: { MV: 5, TR: 7, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Personalization deployed rapidly. Conversion rates improve 20% within 30 days.', second: 'Licensed technology available to every retailer. No differentiation. Vendor controls the roadmap and pricing.' },
          B: { first: 'Internal build takes 6 months. Competitor extends lead in the interim.', second: '15 years of proprietary purchase data creates recommendations competitors cannot match. Customer lifetime value increases 40%.' },
        },
      },
      {
        id: 2, title: 'Store Associate Crisis', month: 'Month 3',
        scenario: 'Your best store associates are leaving for the AI competitor, which pays 25% more and offers technology-forward roles. In-store customer satisfaction has dropped 15 points. Your stores feel dated compared to the competitor\'s AI-enabled showrooms. The CHRO warns that retail associate turnover has hit 45% annually.',
        choices: {
          A: 'Match competitor wages across all stores. Invest $30M in store technology upgrades — digital displays, mobile checkout, AR mirrors.',
          B: 'Create AI-Powered Store Associate program — equip every associate with an AI assistant that provides real-time product knowledge, customer history, and styling recommendations. Transform the role from clerk to consultant.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 5, TL: 3 }, B: { MV: 3, TR: 8, OR: 2, TL: 10 } },
        insights: {
          A: { first: 'Wage increases slow attrition. Store upgrades look modern. Customers notice.', second: 'Wages are an arms race. Store technology without role transformation means expensive stores staffed by the same disengaged associates.' },
          B: { first: 'AI assistant rollout takes 4 months. Training period required.', second: 'Associates become AI-augmented consultants. Job satisfaction soars. Customer interactions are transformative. "Best retail experience in the industry" reviews begin.' },
        },
      },
      {
        id: 3, title: 'Omnichannel Strategy', month: 'Month 6',
        scenario: 'The competitor has launched same-day AI-curated delivery — an algorithm selects items for the customer based on their style profile and upcoming calendar events. It is like a personal shopper that arrives at your door. Your customers are calling it "magic." Your e-commerce and stores operate as separate P&Ls with different technology stacks.',
        choices: {
          A: 'Unify e-commerce and stores under a single technology platform. $50M investment. 9-month integration. Create seamless omnichannel experience.',
          B: 'Leapfrog the competitor. Launch an AI personal styling service that combines online data, in-store interactions, and social media analysis to create hyper-personalized experiences across all channels.',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 7, TL: 0 }, B: { MV: 5, TR: 10, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Platform unification is necessary infrastructure. Operations improve.', second: 'Unification is a catch-up move, not a leap-ahead. By the time it is complete, the competitor has moved further.' },
          B: { first: 'AI styling service launches to strong early adoption. Media buzz.', second: 'Hyper-personalization creates emotional connection with customers. Retention rates increase 50%. The service becomes the brand, not the products.' },
        },
      },
      {
        id: 4, title: 'Supply Chain AI', month: 'Month 9',
        scenario: 'Your AI personalization is improving customer experience, but your supply chain cannot keep up. The competitor uses AI to predict demand with 95% accuracy and has near-zero overstock. Your inventory accuracy is 72%. Markdowns are eating 18% of gross margin. Your supply chain VP says you need a complete overhaul.',
        choices: {
          A: 'Deploy an AI demand forecasting system across the supply chain. Target 90% accuracy. Integrate with vendor management and logistics. $40M investment.',
          B: 'Go further — build an AI-responsive supply chain that not only predicts demand but dynamically adjusts production, routing, and pricing in real-time. "Living supply chain."',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 5, TL: 0 }, B: { MV: 5, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'AI forecasting improves inventory accuracy to 88%. Markdown reduction significant.', second: 'Static forecasting still reacts to trends, does not shape them. Competitor\'s dynamic system continues to outperform.' },
          B: { first: 'Living supply chain takes 8 months to fully deploy. Complex.', second: 'Dynamic system reduces overstock to near-zero. Real-time pricing optimization captures maximum margin. Vendor relationships transform into partnerships.' },
        },
      },
      {
        id: 5, title: 'Brand Positioning', month: 'Month 12',
        scenario: 'Your AI transformation is showing results. Customer metrics are recovering. But brand perception still lags — customers see you as "traditional retail trying to modernize" while the competitor is "born digital." Your CMO says brand perception takes 2x longer to change than operational reality.',
        choices: {
          A: 'Launch a major rebranding campaign: "The New [Brand]." New logo, new store design, national advertising push. $75M budget.',
          B: 'Skip the rebrand. Instead, create AI-powered customer experiences so remarkable that customers rebrand you through word-of-mouth. Invest $75M in AI experience innovation instead of advertising.',
        },
        scoring: { A: { MV: 8, TR: 3, OR: 5, TL: -2 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Rebrand launches with buzz. New visual identity is modern. Awareness spikes.', second: 'Cosmetic rebrand without substance change. Customers quickly see through it. "Same store, new paint" reviews proliferate.' },
          B: { first: 'No rebrand means no awareness spike. Brand perception changes slowly.', second: 'Remarkable experiences create organic virality. "You have to see what [Brand] does now" becomes the customer narrative. Authentic brand evolution.' },
        },
      },
      {
        id: 6, title: 'Retail Evolution', month: 'Month 15',
        scenario: 'Fifteen months in. Your AI-powered retail operation is competitive again. The competitor has hit growth limits. The board is evaluating the next era: become a retail media network (monetize your customer data through advertising) or become the AI personal styling platform (monetize through personalized experiences).',
        choices: {
          A: 'Build a retail media network. Monetize customer data through targeted advertising for brand partners. Follow the Amazon/Walmart model. High-margin revenue.',
          B: 'Build the AI personal styling platform. Subscription-based personal shopping. AI-curated wardrobes. Style as a service. Transform from retailer to personal style company.',
        },
        scoring: { A: { MV: 12, TR: -3, OR: 8, TL: -5 }, B: { MV: 8, TR: 10, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Retail media network generates immediate high-margin revenue. Analysts love it.', second: 'Monetizing customer data erodes the trust you rebuilt. Customers feel surveilled. Privacy backlash. Brand promise violated.' },
          B: { first: 'Style-as-a-service is a novel category. Market needs educating.', second: 'Personal styling creates deepest possible customer relationship. Subscription model provides recurring revenue. Customer lifetime value increases 5x.' },
        },
      },
    ],
    breach: [
      {
        id: 1, title: 'Payment Data Exposure', month: 'Month 1',
        scenario: 'A point-of-sale malware infection has exposed 25 million customer payment cards across your 800 store locations. The breach went undetected for 4 months. Credit card companies are demanding $200M in fraud liability. Customer panic is spreading on social media. Holiday season is 6 weeks away.',
        choices: {
          A: 'Engage forensics quietly. Replace all POS systems. Negotiate with card companies. Issue measured public statement. Prioritize operational continuity for holiday season.',
          B: 'Full public disclosure immediately. Offer free credit monitoring for all customers. Deploy emergency mobile payment option at all stores. CEO addresses customers directly via video.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 7, TL: -3 }, B: { MV: 3, TR: 10, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Holiday operations preserved. Revenue dip limited to 8%.', second: 'Delayed disclosure leaks. "They knew for months and said nothing" narrative destroys trust. Class-action lawsuits multiply.' },
          B: { first: 'Full disclosure causes initial customer panic. Holiday revenue drops 15%.', second: 'Early transparency builds trust recovery foundation. Mobile payment deployment becomes permanent improvement. CEO video gets 10M views — mostly positive.' },
        },
      },
      {
        id: 2, title: 'Customer Communication', month: 'Month 3',
        scenario: 'Three months post-breach. Forensics reveal the malware was injected through a third-party vendor who managed your loyalty program. The vendor had been compromised for 8 months. Your loyalty program data — purchase history, preferences, home addresses for 40 million members — was also exposed. Customer lawsuits are expanding from payment cards to privacy violations.',
        choices: {
          A: 'Terminate the vendor relationship. Bring loyalty program in-house. Engage PR firm for crisis management. Communicate through carefully crafted statements.',
          B: 'Rebuild the loyalty program as a customer-controlled data platform. Customers decide exactly what data to share and can see who accesses it. CEO hosts live Q&A sessions with customers. Full transparency.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 5, TL: -3 }, B: { MV: 3, TR: 12, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Vendor terminated. Program brought in-house. Controlled communications reduce panic.', second: 'PR-managed crisis communications feel corporate and hollow. Customer trust continues to erode.' },
          B: { first: 'Customer-controlled data platform is revolutionary for retail. Media covers it extensively.', second: 'Customers who control their own data become most loyal. Program becomes competitive advantage. Privacy-first retail brand position established.' },
        },
      },
      {
        id: 3, title: 'Security Infrastructure', month: 'Month 6',
        scenario: 'Time to rebuild security infrastructure. Two paths: deploy an enterprise security suite from a major vendor (comprehensive, fast) or build a retail-specific AI security platform that monitors every transaction, device, and vendor connection in real-time. Your CISO favors the vendor for speed. Your CTO argues that retail security needs are unique.',
        choices: {
          A: 'Deploy enterprise security suite. Operational in 90 days. Comprehensive coverage. Industry-standard compliance.',
          B: 'Build retail-specific AI security platform. Real-time transaction monitoring, device fingerprinting, vendor risk scoring. 8-month timeline.',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 7, TL: -2 }, B: { MV: 5, TR: 8, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Fast deployment. Compliance checkboxes completed. Operations secured.', second: 'Generic security suite not optimized for retail. Misses retail-specific attack vectors. Creates false sense of security.' },
          B: { first: 'Longer timeline is painful. Board and customers want immediate security assurance.', second: 'Retail-specific AI detects threats generic systems miss. Real-time vendor risk scoring prevents supply-chain attacks. Permanently ahead of threat landscape.' },
        },
      },
      {
        id: 4, title: 'Customer Win-back', month: 'Month 9',
        scenario: 'New security is operational. No repeat incidents. But foot traffic is still 20% below pre-breach levels. Your customer research reveals the problem: customers trust the payment system now, but they lost the habit of shopping with you. The competitor captured them during your crisis. Getting them back requires more than trust — it requires a reason to return.',
        choices: {
          A: 'Launch a massive win-back campaign — 30% off for returning customers, double loyalty points for 6 months, exclusive access to new collections.',
          B: 'Launch an AI-powered personal shopping experience — customers who return get an AI stylist trained on their complete purchase history. Make the experience of returning feel like coming home.',
        },
        scoring: { A: { MV: 8, TR: 3, OR: 5, TL: -2 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Win-back campaign drives 25% traffic increase. Immediate revenue lift.', second: 'Discount-driven customers are least loyal. They came for the deal, not the brand. When discounts end, traffic drops again.' },
          B: { first: 'AI stylist adoption is slower. Requires customer engagement and setup time.', second: 'Customers who engage with AI stylist have 3x higher lifetime value. The experience is the moat. Competitor cannot replicate proprietary purchase history relationships.' },
        },
      },
      {
        id: 5, title: 'Data Advantage', month: 'Month 12',
        scenario: 'Your customer-controlled data platform and AI security have become genuine competitive advantages. A major retail trade association wants you to lead an industry consortium on retail data security. Your board sees an opportunity to monetize the expertise. Your Chief Privacy Officer warns against "selling" security.',
        choices: {
          A: 'Lead the consortium and simultaneously license your security platform to other retailers. Create a new revenue stream from what was built out of crisis.',
          B: 'Lead the consortium but share the security framework openly. Position your brand as the most trusted retailer in the industry. Monetize trust, not technology.',
        },
        scoring: { A: { MV: 10, TR: 3, OR: 7, TL: -3 }, B: { MV: 5, TR: 12, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Licensing revenue creates new high-margin business line. Board pleased.', second: '"Retailer profits from breach expertise" narrative creates backlash. Trust that was rebuilt is questioned.' },
          B: { first: 'Open sharing does not generate direct revenue. Goodwill is intangible.', second: '"Most Trusted Retailer" brand position drives customer preference. Trust premium on pricing. Customer acquisition cost drops as reputation grows.' },
        },
      },
      {
        id: 6, title: 'Retail Reinvention', month: 'Month 15',
        scenario: 'The breach forced a transformation that made you the most trusted retailer and the most innovative. The final strategic choice: scale the trust advantage through rapid national expansion, or deepen it by creating the definitive privacy-first retail experience.',
        choices: {
          A: 'Rapid national expansion. Open 200 new stores. Acquire two regional chains. Leverage trust brand for geographic expansion.',
          B: 'Deepen the privacy-first retail experience. Build the world\'s most customer-controlled shopping platform. Every data point customer-owned. Every AI interaction transparent. Redefine what retail means.',
        },
        scoring: { A: { MV: 12, TR: 3, OR: 10, TL: -5 }, B: { MV: 7, TR: 10, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Expansion creates growth narrative. Market cap increases significantly.', second: 'Rapid expansion dilutes the very trust and experience that made you special. 200 new stores cannot be staffed with the culture that built the brand.' },
          B: { first: 'Deep experience investment is harder to explain to Wall Street. Growth metrics look modest.', second: 'Privacy-first platform becomes the definition of modern retail. Customer lifetime value is industry-leading. Brand is unassailable. Every competitor is copying you.' },
        },
      },
    ],
    market: [
      {
        id: 1, title: 'Consumer Pullback', month: 'Month 1',
        scenario: 'A consumer spending recession has hit. Same-store sales are down 25%. E-commerce revenue dropped 30%. Inventory is piling up — 40% of current stock is at risk of becoming deadweight. The CFO says cash reserves cover 5 months. The board demands a survival plan within two weeks.',
        choices: {
          A: 'Aggressive clearance — 50-70% markdowns across all categories. Close 30 underperforming stores. Lay off 3,000 associates. Survive first, rebuild later.',
          B: 'Selective markdowns on seasonal inventory only. Convert 30 underperforming stores to AI-powered fulfillment centers. Retrain associates for e-commerce operations. Deploy AI dynamic pricing to optimize margin on remaining inventory.',
        },
        scoring: { A: { MV: 8, TR: -3, OR: 5, TL: -8 }, B: { MV: 5, TR: 7, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Cash preserved. Immediate survival secured. Analysts approve.', second: 'Brand permanently associated with "fire sale." Remaining stores feel like a dying brand. Best associates take severance and never come back.' },
          B: { first: 'Slower cash preservation. Fulfillment conversion takes 3 months. Board anxious.', second: 'Fulfillment centers improve e-commerce delivery to same-day. AI pricing preserves margins. Associates retrained into higher-value roles. Brand dignity maintained.' },
        },
      },
      {
        id: 2, title: 'E-Commerce Acceleration', month: 'Month 3',
        scenario: 'The recession is deepening. Consumers have shifted dramatically online. Your e-commerce platform is handling 3x normal volume but was built for 1.5x. Site crashes, delayed deliveries, and wrong items shipped are damaging customer satisfaction. NPS is down 25 points. You need a technology decision: scale the existing platform or rebuild.',
        choices: {
          A: 'Scale the existing platform. Add servers, patch the worst bugs, hire more warehouse staff. Brute-force the problem. Fast but fragile.',
          B: 'Rebuild on a modern AI-native commerce platform. Accept 6 weeks of degraded performance during migration. Invest $20M in a platform that handles 10x volume with AI-powered inventory management.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 8, TL: -3 }, B: { MV: 3, TR: 7, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Platform stabilized within 2 weeks. Volume handled. Customer complaints decrease.', second: 'Patched platform accumulates technical debt. Next volume spike will cause the same problems. Structural weakness remains.' },
          B: { first: 'Migration period is painful. Some customers lost during the transition.', second: 'New platform handles any volume. AI inventory management reduces errors 90%. Customer experience becomes competitive advantage.' },
        },
      },
      {
        id: 3, title: 'Vendor Relationships', month: 'Month 6',
        scenario: 'Six months into the recession. Vendors are struggling too. Three of your top 10 suppliers are at risk of bankruptcy. Your procurement team says you can negotiate 40% cost reductions by squeezing distressed vendors. Your Chief Sustainability Officer argues that losing key vendors will break your supply chain when the recovery comes.',
        choices: {
          A: 'Negotiate aggressively. Achieve maximum cost reduction from distressed vendors. If they fail, switch to alternatives. Survival of the fittest.',
          B: 'Create a vendor stabilization fund. Provide bridge financing to at-risk vendors in exchange for exclusivity agreements and AI-integrated supply chain visibility.',
        },
        scoring: { A: { MV: 8, TR: -3, OR: 7, TL: -5 }, B: { MV: 3, TR: 10, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Cost reductions achieved. Gross margin improves. Short-term survival strengthened.', second: 'Two key vendors fail. Supply chain disrupted during recovery. Products unavailable when demand returns. Reputation as "vendor that squeezes" spreads.' },
          B: { first: 'Vendor fund costs $15M. Board questions spending during crisis.', second: 'All three vendors survive. Exclusivity agreements lock in supply when competitors face shortages. AI supply chain integration creates permanent efficiency.' },
        },
      },
      {
        id: 4, title: 'Customer Experience Pivot', month: 'Month 9',
        scenario: 'The recession shows signs of easing. Consumer confidence is recovering but spending patterns have permanently changed — more online, more value-conscious, less brand-loyal. Your data shows that customers who remained during the crisis have a completely different profile than pre-recession customers. Your traditional customer base may not fully return.',
        choices: {
          A: 'Win back the traditional customer base. Launch a "Welcome Back" campaign with incentives, exclusive collections, and personalized outreach to lapsed customers.',
          B: 'Embrace the new customer base. Build AI-powered value optimization tools — price comparison, quality scoring, durability predictions. Become the smartest place to shop, not the most aspirational.',
        },
        scoring: { A: { MV: 7, TR: 3, OR: 5, TL: -2 }, B: { MV: 5, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Win-back campaign re-engages 30% of lapsed customers. Revenue lifts.', second: 'Returning customers are less loyal and more price-sensitive. Acquisition cost increased 50%. The relationship is transactional, not emotional.' },
          B: { first: 'Value-focused positioning feels like a step down from the brand aspirational history.', second: 'AI value tools create intense customer loyalty. "Smartest retailer" positioning attracts a larger, more diverse customer base. Revenue per customer increases through trust-based upselling.' },
        },
      },
      {
        id: 5, title: 'Growth Investment', month: 'Month 12',
        scenario: 'Recovery is underway. Revenue is approaching pre-recession levels. Margins are actually better thanks to AI efficiency gains. The board wants to invest for growth. $100M available. Two options: expand the store footprint into new markets, or build an AI-powered marketplace that lets independent brands sell through your platform.',
        choices: {
          A: 'New store expansion — 50 new locations in high-growth markets. Traditional retail growth playbook. Proven but capital-intensive.',
          B: 'Build an AI-powered marketplace. Third-party brands sell through your platform. AI handles curation, pricing, and logistics. Asset-light growth.',
        },
        scoring: { A: { MV: 8, TR: 5, OR: 8, TL: -3 }, B: { MV: 7, TR: 8, OR: 3, TL: 5 } },
        insights: {
          A: { first: '50 new stores create physical presence. Traditional retail analysts approve.', second: 'Capital-intensive expansion in uncertain recovery is risky. Each store requires $2M+ to open and 18 months to break even.' },
          B: { first: 'Marketplace model generates revenue from Day 1. Third-party brands eager to join.', second: 'AI curation maintains brand quality without inventory risk. Marketplace economics compound. Independent brands attract new customer segments.' },
        },
      },
      {
        id: 6, title: 'Retail Renaissance', month: 'Month 15',
        scenario: 'Fifteen months after the recession. Your business has not just recovered — it has transformed. The final strategic question: optimize the current model for maximum profitability, or reinvent the model entirely by becoming a retail-as-a-service platform that powers other retailers\' AI capabilities.',
        choices: {
          A: 'Optimize for profitability. Focus on operational efficiency, margin expansion, and shareholder returns. Proven model, maximum near-term value.',
          B: 'Retail-as-a-service platform. License your AI capabilities — personalization, supply chain, pricing — to other retailers. Become the Shopify of AI-powered retail.',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 5, TL: 0 }, B: { MV: 10, TR: 8, OR: 5, TL: 5 } },
        insights: {
          A: { first: 'Profitability focus generates strong returns. Dividends increase. Stock price stable.', second: 'Optimization without innovation leads to stagnation. Next disruption finds you in the same position as 15 months ago.' },
          B: { first: 'RaaS platform creates new revenue category. Market recognizes platform optionality.', second: 'Platform economics are transformative. Every retailer using your AI makes your models better. Network effects create unassailable position.' },
        },
      },
    ],
    product: [
      {
        id: 1, title: 'Product Recall Crisis', month: 'Month 1',
        scenario: 'Your AI-powered quality control system failed to detect a manufacturing defect in your bestselling product line. 2 million units shipped with a potential safety hazard. 47 customer injuries reported. The CPSC has issued a recall notice. Your stock dropped 18% and your product liability insurance is at its coverage limit.',
        choices: {
          A: 'Execute the CPSC recall. Replace affected units. Issue a public apology. Engage crisis PR firm. Resume production once defect is fixed.',
          B: 'Go beyond the recall — offer full refunds plus a store credit to every affected customer. CEO records a personal video apology. Pause all AI quality control until a complete audit is finished. Invite affected customers to participate in redesigning the quality process.',
        },
        scoring: { A: { MV: 5, TR: 5, OR: 5, TL: 0 }, B: { MV: 3, TR: 12, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Recall executed efficiently. Legal exposure managed. Operations normalized within 60 days.', second: 'Minimum-viable response. Customers feel processed, not valued. Trust recovery is slow and mechanical.' },
          B: { first: 'CEO video gets 15M views. Customer response overwhelmingly positive. Cost is significant.', second: 'Customer co-design of quality process creates deepest possible loyalty. "The retailer that treated us like family" narrative dominates. Affected customers become strongest advocates.' },
        },
      },
      {
        id: 2, title: 'Quality System Rebuild', month: 'Month 3',
        scenario: 'Your AI quality system audit reveals systemic issues — the training data was biased toward visual defects and missed structural integrity problems. Your quality VP proposes two approaches: a hybrid human-AI system with humans reviewing all AI flags, or a next-generation AI with multi-modal sensing (visual + structural + stress testing).',
        choices: {
          A: 'Hybrid human-AI system. Every AI flag reviewed by a human quality inspector. Slower but bulletproof. "Trust but verify."',
          B: 'Next-generation multi-modal AI. Visual, structural, and stress testing. Higher capability ceiling. Requires fewer human reviewers but more AI expertise. "Smarter, not just safer."',
        },
        scoring: { A: { MV: 5, TR: 7, OR: 3, TL: 3 }, B: { MV: 8, TR: 5, OR: 5, TL: 5 } },
        insights: {
          A: { first: 'Hybrid system catches everything. Zero defects in 6 months. Regulators approve.', second: 'Human bottleneck limits throughput. Production capacity reduced 20%. Quality team burnout is a risk.' },
          B: { first: 'Multi-modal AI catches defects humans cannot detect. Capabilities leap forward.', second: 'Advanced AI requires ongoing training and monitoring. Without human judgment layer, edge cases remain a risk. But overall quality improvement is dramatic.' },
        },
      },
      {
        id: 3, title: 'Brand Recovery', month: 'Month 6',
        scenario: 'Quality system rebuilt. Zero defects for 6 months. But sales of the affected product line remain 40% below pre-recall levels. Consumer fear lingers. Your CMO proposes relaunching the line under a new brand name. Your Chief Product Officer argues the original brand name has 20 years of equity that should not be abandoned.',
        choices: {
          A: 'Relaunch under a new brand name. Clean start. Let the old name fade. Invest $40M in building the new brand identity.',
          B: 'Relaunch under the original brand name with "Verified by AI + Human" quality certification on every product. Make transparency the brand\'s new defining attribute.',
        },
        scoring: { A: { MV: 7, TR: 3, OR: 5, TL: -2 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'New brand avoids recall stigma. Initial sales look promising.', second: 'Customers eventually discover same company. "Hiding behind a new name" narrative. 20 years of brand equity wasted.' },
          B: { first: 'Original brand relaunch is risky. Recall association is strong. Slower initial sales.', second: 'Transparency certification becomes defining feature. Customers learn to look for it. Competitors without it seem less trustworthy. Brand stronger than before the recall.' },
        },
      },
      {
        id: 4, title: 'Innovation Strategy', month: 'Month 9',
        scenario: 'Your quality-verified product line is recovering. But the recall exposed a deeper issue — your product innovation pipeline relies heavily on AI-generated designs that prioritize aesthetics over durability. Two new product concepts are in development. Your design team wants to use AI to push creative boundaries. Your quality team wants AI constrained to proven design parameters.',
        choices: {
          A: 'Constrain AI to proven design parameters. Safety first. Innovation within guardrails. "Boring but reliable."',
          B: 'Use AI for creative exploration but add a physical prototyping and stress-testing phase before any design goes to production. "Innovative and verified."',
        },
        scoring: { A: { MV: 5, TR: 7, OR: 3, TL: -2 }, B: { MV: 8, TR: 8, OR: 5, TL: 5 } },
        insights: {
          A: { first: 'Constrained designs are safe. Zero quality issues. But product line looks generic.', second: 'Over-constraining AI kills innovation. Competitors who balance innovation with quality will overtake you.' },
          B: { first: 'Physical prototyping adds 4 weeks to development cycle. Cost per product increases.', second: 'Best of both worlds — AI pushes creative boundaries while physical testing ensures safety. Products are innovative AND reliable. Premium pricing justified.' },
        },
      },
      {
        id: 5, title: 'Market Expansion', month: 'Month 12',
        scenario: 'Your quality-verified product line is outperforming pre-recall levels. Customer trust has fully recovered. The AI + Human quality certification has become your strongest brand attribute. Now the question: expand the product line into new categories, or license the quality certification to other retailers?',
        choices: {
          A: 'Expand into new categories — home goods, electronics, outdoor gear — all carrying the quality certification. Build a diversified product empire.',
          B: 'License the quality certification to other retailers. Become the "Good Housekeeping Seal" of AI-verified quality. Asset-light, high-margin, industry influence.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 8, TL: -3 }, B: { MV: 7, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Category expansion is exciting. Revenue diversification is real.', second: 'Expanding into categories you don\'t know risks quality failures in new areas. The very certification that rebuilds trust could be diluted.' },
          B: { first: 'Licensing model creates instant high-margin revenue. Certification becomes industry currency.', second: 'Standard-setting position creates permanent influence. Every retailer using your certification reinforces your brand. No category risk.' },
        },
      },
      {
        id: 6, title: 'Product Legacy', month: 'Month 15',
        scenario: 'Fifteen months after the product recall. The crisis that nearly destroyed the brand has been transformed into its defining strength. The final question: double down on product quality leadership, or use the trust and technology to pivot toward sustainable and ethical manufacturing — an area where AI quality verification could be transformative.',
        choices: {
          A: 'Double down on quality leadership. Build the most quality-obsessed retail brand in the world. Every product tested, verified, and guaranteed. "Quality is our religion."',
          B: 'Pivot to sustainable + quality. Use AI to verify not just product quality but ethical sourcing, carbon footprint, and labor practices. "Quality for the product. Quality for the planet."',
        },
        scoring: { A: { MV: 7, TR: 7, OR: 3, TL: 3 }, B: { MV: 8, TR: 10, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Quality leadership is clear and defensible. Customers know exactly what you stand for.', second: 'Quality-only positioning is narrow. Misses growing consumer demand for sustainability. Competitors who combine quality with sustainability will capture the next generation.' },
          B: { first: 'Sustainability pivot requires significant supply chain investment.', second: 'AI-verified sustainable quality creates category of one. Next-generation consumers choose you by default. Brand becomes movement. Premium pricing accepted. Supply chain partners transformed.' },
        },
      },
    ],
  },

  tech: {
    competitor: [
      {
        id: 1, title: 'Platform Disruption', month: 'Month 1',
        scenario: 'An AI-native startup has launched a product that does 80% of what your flagship SaaS platform does at 20% of the cost. They built in 18 months what took you a decade. Your annual churn has spiked from 5% to 12%. Your product team says the competitor\'s AI architecture is genuinely superior for common use cases. Your advantage is in complex enterprise configurations that the startup cannot yet handle.',
        choices: {
          A: 'Acquire the startup. $500M offer. Integrate their AI engine into your platform. Eliminate the competitive threat.',
          B: 'Accelerate internal AI rebuild of your platform. Invest $200M over 12 months. Launch an AI-native version that combines your enterprise depth with modern AI architecture.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 10, TL: -5 }, B: { MV: 5, TR: 8, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Acquisition removes immediate threat. Market applauds. Stock up 8%.', second: 'Integration of startup culture into enterprise org is catastrophic. Best startup engineers leave within 6 months. $500M for technology without the team that built it.' },
          B: { first: 'Internal rebuild is slower. Competitor continues to gain market share during development.', second: 'Platform rebuilt by the team that knows enterprise customers. AI-native architecture with decade of domain knowledge. No integration risk. Team energized by building the future.' },
        },
      },
      {
        id: 2, title: 'Customer Migration', month: 'Month 3',
        scenario: 'Despite your response, customer migration to the competitor is accelerating. Your mid-market segment (40% of revenue) is most vulnerable — they need modern AI features but don\'t require complex enterprise configurations. Your sales team is demoralized. Three senior account executives have defected to the competitor.',
        choices: {
          A: 'Launch an emergency "AI Boost" add-on for mid-market customers. Free for 12 months. Requires minimal development — essentially a wrapper around third-party AI APIs. Buys time.',
          B: 'Create a dedicated mid-market AI product team. Build a streamlined version of your platform optimized for mid-market needs. Accept 6 months of continued attrition while building the right solution.',
        },
        scoring: { A: { MV: 7, TR: 3, OR: 7, TL: -3 }, B: { MV: 3, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'AI Boost stops some bleeding. Customers appreciate the gesture. Churn slows.', second: 'Wrapper product has no depth. Customers discover limitations within 3 months. "Lipstick on a pig" reviews. Trust eroded further.' },
          B: { first: 'Continued mid-market attrition during build period. Revenue pressure intensifies.', second: 'Purpose-built mid-market product exceeds competitor on features and reliability. Returning customers are more loyal than before. Sales team energized.' },
        },
      },
      {
        id: 3, title: 'Developer Ecosystem', month: 'Month 6',
        scenario: 'The competitor has launched an open API platform and developer ecosystem. Third-party developers are building integrations and extensions. 500 developers are building on their platform versus 50 on yours. Your platform architect warns that the developer ecosystem is becoming the real competitive moat — not the core product features.',
        choices: {
          A: 'Launch your own open API platform with a $10M developer incentive fund. Match the competitor\'s developer experience. Pay developers to build on your platform.',
          B: 'Open-source your platform\'s integration layer. Create the most developer-friendly API in the industry. Build developer tools and documentation that make your platform the preferred environment for AI development.',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 7, TL: -2 }, B: { MV: 5, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Incentive fund attracts 200 developers quickly. Ecosystem grows.', second: 'Paid developers build low-quality integrations for the bounty. When incentives end, developer activity drops. Ecosystem is artificial.' },
          B: { first: 'Open-source approach takes longer to build momentum. Developer adoption is organic.', second: 'Developer community becomes genuine. High-quality integrations built by developers who chose the platform. Community becomes self-sustaining. True moat.' },
        },
      },
      {
        id: 4, title: 'Enterprise Differentiation', month: 'Month 9',
        scenario: 'The competitor has started moving upmarket. They hired enterprise sales leaders from major SaaS companies and are targeting your Fortune 500 clients. Two enterprise clients have completed POCs with the competitor. Your CRO says enterprise churn could begin within 6 months if you do not act decisively.',
        choices: {
          A: 'Lock in enterprise clients with multi-year discount contracts and dedicated support teams. Reduce pricing 20% for 3-year commitments.',
          B: 'Launch "AI Co-Innovation" partnerships with top 20 enterprise clients. Dedicated engineering teams build custom AI features. Clients get tailored solutions. You get deep product insight.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 5, TL: -3 }, B: { MV: 8, TR: 10, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Discounts lock in revenue. Enterprise churn averted in the short term.', second: 'Discount-locked clients have no loyalty — they are locked in by price, not value. When contracts expire, you are back to the same problem. Margins permanently compressed.' },
          B: { first: 'Co-Innovation requires significant engineering investment. Dedicated teams for 20 clients.', second: 'Custom AI features become platform features. Enterprise clients become product co-developers. Deepest possible integration. Switching costs become infinite. Clients become advocates.' },
        },
      },
      {
        id: 5, title: 'Product Strategy', month: 'Month 12',
        scenario: 'Your AI-rebuilt platform is gaining traction. Mid-market product is competitive. Enterprise co-innovation is working. The competitor has plateaued — their growth rate has dropped from 15% to 5% monthly. The market is consolidating. Your board sees an opportunity to define the next generation of the category.',
        choices: {
          A: 'Build a comprehensive AI platform that absorbs adjacent product categories. Become the "all-in-one" AI-powered business platform. CRM, ERP, analytics, collaboration — all integrated.',
          B: 'Go deep in your core category. Build the most intelligent, most automated, most AI-native version of your product. Be the undisputed best at one thing.',
        },
        scoring: { A: { MV: 10, TR: 3, OR: 10, TL: -5 }, B: { MV: 7, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Platform expansion narrative excites market. TAM story is compelling.', second: 'Expanding into 5 adjacent categories simultaneously dilutes engineering. Core product quality drops. Competitors in each category are formidable.' },
          B: { first: 'Focused strategy seems limiting to growth-focused analysts.', second: 'Deep specialization creates product so good that adjacent tools integrate with you. You become the hub without building the spokes. Best engineers want to work on the hardest problem.' },
        },
      },
      {
        id: 6, title: 'Platform Future', month: 'Month 15',
        scenario: 'Fifteen months in. You have survived the competitive disruption and emerged stronger. The startup competitor has been acquired by a larger company and lost its edge. You are the market leader again. The board wants your 3-year vision. Your VP of AI says the real opportunity is not your current product category — it is the AI development platform underneath it.',
        choices: {
          A: 'Spin out the AI platform as a separate business. Let other companies build products on your AI infrastructure. Compete with AWS, Azure, and GCP in the AI platform space.',
          B: 'Keep the AI platform proprietary. Use it to continuously improve your product faster than anyone else can. The platform is your competitive advantage, not your product.',
        },
        scoring: { A: { MV: 12, TR: 3, OR: 12, TL: -5 }, B: { MV: 8, TR: 8, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'AI platform spinout creates massive market excitement. Valuation doubles on the vision.', second: 'Competing with hyperscalers is existential risk. AWS, Azure, and GCP have 100x your resources. Platform becomes commodity. Core product starved of AI talent.' },
          B: { first: 'Proprietary platform is invisible to investors. No TAM expansion story.', second: 'AI platform creates permanent velocity advantage. Product improves 3x faster than competitors. Best AI talent works on product innovation, not infrastructure. Sustainable compounding advantage.' },
        },
      },
    ],
    breach: [
      {
        id: 1, title: 'Zero-Day Exploitation', month: 'Month 1',
        scenario: 'A sophisticated state-sponsored attack has exploited a zero-day vulnerability in your SaaS platform. 500 enterprise clients have had their data accessed. The attack used AI-generated social engineering to bypass multi-factor authentication. Your security team discovered it because the attackers left a calling card — they wanted you to know.',
        choices: {
          A: 'Activate incident response. Patch the vulnerability. Notify affected clients through account managers. File required regulatory disclosures. Engage law enforcement.',
          B: 'Go fully transparent. Publish a real-time incident blog. Share technical details of the attack vector (after patching). Invite the security community to audit your platform. Convert the breach into a security research moment.',
        },
        scoring: { A: { MV: 5, TR: 5, OR: 5, TL: 0 }, B: { MV: 3, TR: 10, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Controlled response manages immediate crisis. Clients notified. Regulatory requirements met.', second: 'Standard response does not differentiate. Enterprise clients expect more from a technology company. Competitors use the breach in competitive selling.' },
          B: { first: 'Real-time incident blog is unprecedented for SaaS. Security community praises transparency.', second: 'Security audit reveals additional vulnerabilities that would have been exploited later. Community contribution strengthens platform beyond what internal team could achieve alone.' },
        },
      },
      {
        id: 2, title: 'Enterprise Client Exodus', month: 'Month 3',
        scenario: 'Despite your response, 80 enterprise clients have initiated RFPs for competitive alternatives. Your largest client ($50M ARR) says trust must be rebuilt through action, not words. Industry analysts have downgraded your security rating. The competitor from your earlier challenge is using the breach in every sales pitch.',
        choices: {
          A: 'Deploy dedicated security liaisons to all enterprise accounts. Offer free security audits and migration to enhanced security tiers. Price concessions for clients who renew.',
          B: 'Create a Customer Security Board — give enterprise clients governance authority over security decisions. Monthly reporting. Transparent vulnerability disclosure. Shared accountability.',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 5, TL: -3 }, B: { MV: 3, TR: 12, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Security liaisons slow the exodus. 50 of 80 clients pause their RFPs.', second: 'Concessions and free services are expensive and temporary. Clients stay for the deal, not for trust.' },
          B: { first: 'Customer Security Board is radical. Enterprise clients initially skeptical but intrigued.', second: 'Shared governance creates unprecedented trust. Board members become most vocal advocates. Model replicated across the industry.' },
        },
      },
      {
        id: 3, title: 'Platform Security Rebuild', month: 'Month 6',
        scenario: 'The board has approved a complete security architecture rebuild. Your options: adopt a zero-trust architecture with AI-powered threat detection using a leading security vendor\'s platform, or build a proprietary security AI trained on your platform\'s specific threat landscape.',
        choices: {
          A: 'Deploy vendor zero-trust platform. Enterprise-grade. Battle-tested. Operational in 90 days.',
          B: 'Build proprietary security AI. Trained on your specific threat landscape. Understands your platform deeply. 8-month timeline but permanently differentiated.',
        },
        scoring: { A: { MV: 7, TR: 5, OR: 7, TL: -2 }, B: { MV: 5, TR: 8, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'Vendor deployment is fast. Compliance restored. Enterprise clients satisfied with known brand.', second: 'Vendor security is one-size-fits-all. Does not understand your platform\'s specific attack surface. Same vendor used by competitor — no differentiation.' },
          B: { first: 'Proprietary build takes longer. Board patience required.', second: 'Platform-specific security AI catches threats generic solutions miss. Becomes competitive differentiator. "Built-in, not bolted-on" security narrative.' },
        },
      },
      {
        id: 4, title: 'Security Product Opportunity', month: 'Month 9',
        scenario: 'Your proprietary security AI is exceeding expectations. It detected and neutralized 3 attempted breaches that would have been missed by standard solutions. Enterprise clients are noticing — several have asked if they can use your security AI for their own systems, not just your platform.',
        choices: {
          A: 'Productize the security AI. Launch as a standalone cybersecurity product for enterprise clients. New revenue stream. New market.',
          B: 'Keep it platform-exclusive. Make "best-in-class security" the reason enterprises choose your platform over competitors. Bundled value, not separate product.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 8, TL: -3 }, B: { MV: 7, TR: 8, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Security product creates new revenue stream. Enterprise clients excited.', second: 'Standalone security product competes in a market dominated by Palo Alto, CrowdStrike, etc. Distracts from core product. Engineering resources divided.' },
          B: { first: 'Keeping it exclusive seems like leaving money on the table.', second: 'Security-as-bundled-value creates unmatched switching costs. Clients cannot get this security anywhere else. Platform stickiness increases dramatically.' },
        },
      },
      {
        id: 5, title: 'Trust Leadership', month: 'Month 12',
        scenario: 'Twelve months post-breach. Your platform is the most secure in the industry. Client retention has exceeded pre-breach levels. The breach forced investments that created genuine competitive advantage. An industry consortium invites you to chair a new cybersecurity standards committee.',
        choices: {
          A: 'Chair the committee and drive standards that align with your technology. Influence regulations in your favor. Play the political game.',
          B: 'Chair the committee with genuine openness. Share your security learnings freely. Help competitors improve. Raise the bar for the entire industry.',
        },
        scoring: { A: { MV: 8, TR: 3, OR: 7, TL: -3 }, B: { MV: 5, TR: 12, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Standards aligned with your tech create competitive moat. Regulators influenced.', second: 'Industry sees through the self-serving approach. Trust leadership position undermined. "Using security for competitive advantage" criticism.' },
          B: { first: 'Sharing learnings helps competitors. Some board members uncomfortable.', second: 'Genuine openness elevates entire industry. Your position as trust leader is unquestioned. Clients choose you because you clearly care about the ecosystem, not just your market share.' },
        },
      },
      {
        id: 6, title: 'Security-First Future', month: 'Month 15',
        scenario: 'The breach transformed your company into the most trusted technology platform in the industry. The final question: monetize the trust through aggressive growth, or use it to redefine what enterprise technology should look like — security-first, transparency-first, customer-first.',
        choices: {
          A: 'Aggressive growth. Use trust advantage to capture market share rapidly. Acquire competitors. Become the dominant enterprise platform. Scale fast.',
          B: 'Redefine the category. Build the first truly security-first, transparency-first enterprise platform. Open security dashboards, real-time compliance, customer-controlled data. "The platform that never hides."',
        },
        scoring: { A: { MV: 12, TR: 3, OR: 10, TL: -5 }, B: { MV: 8, TR: 10, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Aggressive growth creates impressive metrics. Market share increases rapidly.', second: 'Rapid scaling dilutes the trust and culture that made you special. Acquired companies do not share your security DNA. Trust advantage erodes.' },
          B: { first: 'Category redefinition is slow. Investors want faster growth metrics.', second: 'Security-first platform becomes the standard. Enterprise clients mandate it. Competitors must follow or lose. You defined the category. Permanent advantage.' },
        },
      },
    ],
    market: [
      {
        id: 1, title: 'Revenue Collapse', month: 'Month 1',
        scenario: 'Enterprise IT budgets have been slashed 40% industry-wide. Your ARR is declining for the first time ever — from $800M to a projected $600M. 30% of customers are requesting pricing relief or threatening to churn. Your burn rate at current headcount gives you 12 months of runway. The board wants a survival plan.',
        choices: {
          A: 'Reduce headcount 25%. Cut all non-essential programs. Reduce pricing 20% for customers who commit to annual contracts. Survive the downturn.',
          B: 'Selective reductions — cut 10% (non-critical roles only). Launch an AI-powered "essential" tier at 50% lower cost. Protect engineering and customer success teams. Deploy AI to automate operations and reduce costs organically.',
        },
        scoring: { A: { MV: 8, TR: 3, OR: 5, TL: -8 }, B: { MV: 5, TR: 7, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Immediate cash preservation extends runway to 18 months. Board relieved.', second: 'Losing 25% of headcount removes institutional knowledge. Engineering velocity drops. Customer success degraded. Recovery capacity diminished.' },
          B: { first: 'Smaller reductions mean less immediate savings. Runway extends to 14 months.', second: 'AI automation creates permanent cost reductions. Essential tier retains customers who would have churned. Engineering team intact for recovery. Talent pipeline preserved.' },
        },
      },
      {
        id: 2, title: 'Product Prioritization', month: 'Month 3',
        scenario: 'With limited engineering resources, you cannot develop everything. Your product roadmap has three major initiatives: (a) AI-powered automation features customers are demanding, (b) enterprise security enhancements needed for compliance, and (c) platform performance optimization. You can fully fund one, partially fund another, and defer the third.',
        choices: {
          A: 'Fully fund AI automation (highest customer demand). Partially fund security. Defer performance. "Build what they are asking for."',
          B: 'Fully fund platform performance and security. Partially fund AI automation. "Make the foundation bulletproof, then build on it."',
        },
        scoring: { A: { MV: 8, TR: 5, OR: 8, TL: -2 }, B: { MV: 5, TR: 7, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'AI automation features ship fast. Customer excitement. Retention improves.', second: 'Security and performance debt accumulate. Enterprise clients encounter reliability issues. Foundation crumbles under AI features.' },
          B: { first: 'Foundation investment is invisible to customers. Frustration that AI features are delayed.', second: 'Rock-solid foundation enables rapid AI feature deployment later. Enterprise reliability becomes selling point. Performance advantage is noticeable.' },
        },
      },
      {
        id: 3, title: 'Pricing Strategy', month: 'Month 6',
        scenario: 'Six months in. The market is not recovering. Competitors are engaged in a pricing war — some offering 70% discounts to steal your customers. Your CFO says matching discounts will make the business unprofitable. Your CRO says not matching will accelerate churn.',
        choices: {
          A: 'Match competitive pricing selectively for at-risk accounts. Accept margin compression. Retain revenue. Fight the price war.',
          B: 'Refuse to match. Instead, launch a value calculator that shows customers the ROI of your platform versus cheaper alternatives. Invest in customer success to ensure customers realize the full value.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 7, TL: -3 }, B: { MV: 3, TR: 8, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Selective discounts retain key accounts. Revenue stabilized.', second: 'Discount customers are permanently repriced. When market recovers, raising prices back is nearly impossible. Margin permanently compressed.' },
          B: { first: 'Refusing to match means some customers leave. Revenue dips further.', second: 'Customers who stay understand your value. When market recovers, no price normalization needed. Customer success investment deepens relationships. Higher-quality customer base.' },
        },
      },
      {
        id: 4, title: 'AI Monetization', month: 'Month 9',
        scenario: 'Your AI automation features are the most requested capability in the market. Even churned customers are inquiring about returning for the AI capabilities. Your AI engineering team has built a suite that genuinely transforms enterprise workflows. The question: how to monetize in a down market.',
        choices: {
          A: 'Bundle AI features into existing plans at no additional cost. Drive retention and win-back. Monetize through volume, not price.',
          B: 'Launch AI features as a premium tier with usage-based pricing. Higher price but demonstrable ROI. Customers pay for what they use.',
        },
        scoring: { A: { MV: 5, TR: 5, OR: 5, TL: 0 }, B: { MV: 8, TR: 7, OR: 3, TL: 5 } },
        insights: {
          A: { first: 'Bundled AI stops churn cold. Win-back rate exceeds expectations. Customer count grows.', second: 'Free AI cannot be re-priced later. Revenue per customer stagnant. AI becomes expected baseline, not premium feature.' },
          B: { first: 'Premium tier creates new revenue stream immediately. ROI clear to customers. Some price resistance.', second: 'Usage-based pricing aligns cost with value. Heavy users pay more and are happy to — the ROI justifies it. Revenue per customer increases 40%.' },
        },
      },
      {
        id: 5, title: 'Recovery Positioning', month: 'Month 12',
        scenario: 'The market downturn is ending. IT budgets are recovering. Your competitors are weakened from the pricing war and underinvestment. You are positioned for a strong recovery. The board wants a growth investment. $150M available.',
        choices: {
          A: 'Aggressive customer acquisition. Hire 200 sales reps. Launch a massive marketing campaign. Target 50% customer growth in 12 months. Land-grab while competitors are weak.',
          B: 'Invest in product and customer success. Build the most capable platform in the market. Expand customer value. Grow revenue through expansion revenue from existing customers.',
        },
        scoring: { A: { MV: 10, TR: 3, OR: 8, TL: -5 }, B: { MV: 7, TR: 8, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Sales blitz generates impressive new logo count. Growth metrics soar.', second: 'Rapid hiring of 200 sales reps dilutes culture. Customer quality drops. Churn among new customers is high. Expensive growth with low retention.' },
          B: { first: 'Product investment is less visible externally. Growth metrics look modest.', second: 'Existing customer expansion creates highest-quality revenue. NRR exceeds 140%. Product superiority attracts customers organically. Growth is sustainable.' },
        },
      },
      {
        id: 6, title: 'Post-Downturn Identity', month: 'Month 15',
        scenario: 'Fifteen months after the revenue collapse. Your company has not just survived — it has been tempered by the downturn into a more efficient, more focused, more resilient organization. The final question: scale aggressively to capitalize on weakened competitors, or build the definitive enterprise AI platform methodically.',
        choices: {
          A: 'Aggressive scaling. Acquire weakened competitors. Expand internationally. Become the dominant enterprise platform. Speed over everything.',
          B: 'Methodical platform building. Invest in AI R&D. Expand product capabilities. Build the platform that becomes the default enterprise choice through superiority, not scale.',
        },
        scoring: { A: { MV: 12, TR: 3, OR: 10, TL: -5 }, B: { MV: 8, TR: 8, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Acquisition spree creates market excitement. Scale narrative is powerful.', second: 'Integrating multiple acquisitions in a recovering market is extremely complex. Culture diluted. Product coherence lost. Operational risk at maximum.' },
          B: { first: 'Methodical approach frustrates impatient investors.', second: 'Product superiority creates gravitational pull. Best engineers join. Best customers choose you. Growth comes from being the best, not the biggest. Sustainable compounding advantage.' },
        },
      },
    ],
    product: [
      {
        id: 1, title: 'Platform Catastrophe', month: 'Month 1',
        scenario: 'Your platform\'s AI-powered automation engine has been generating incorrect data transformations that went undetected for 3 weeks. 200 enterprise clients have corrupted data in production systems. The root cause: a model update that passed all automated tests but contained a subtle reasoning flaw. Financial losses across affected clients estimated at $500M. Your stock has halted trading.',
        choices: {
          A: 'Immediate rollback. Full data recovery from backups. $100M client compensation fund. Engage external auditors. Communicate through legal and PR teams.',
          B: 'Immediate rollback and data recovery. CEO addresses all 200 affected clients directly via emergency video call. Open the AI model and testing pipeline for external review. Announce a "Data Integrity Guarantee" backed by $200M insurance policy.',
        },
        scoring: { A: { MV: 5, TR: 3, OR: 5, TL: 0 }, B: { MV: 3, TR: 12, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Controlled response. Legal exposure managed. Compensation fund addresses immediate claims.', second: 'Arm\'s-length response creates trust vacuum. Clients feel like a liability, not a partner. Competitors weaponize the incident.' },
          B: { first: 'CEO direct address is unprecedented. Clients feel heard. External review increases exposure but builds credibility.', second: 'Data Integrity Guarantee becomes industry first. External review finds 3 additional potential issues, preventing future incidents. Transparency investment compounds.' },
        },
      },
      {
        id: 2, title: 'Engineering Rebuild', month: 'Month 3',
        scenario: 'Root cause analysis reveals systemic issues in your AI development pipeline — insufficient testing for edge cases, no human-in-the-loop for model updates, and a culture of "move fast" that deprioritized safety. Your VP of Engineering proposes two paths: add comprehensive safety layers to the existing pipeline, or redesign the pipeline from scratch around AI safety principles.',
        choices: {
          A: 'Add safety layers to existing pipeline. Testing frameworks, human review gates, canary deployments. Faster to implement. Existing team can execute.',
          B: 'Redesign the pipeline from scratch. AI safety as the foundational principle. Formal verification. Continuous monitoring. Human-AI co-development model.',
        },
        scoring: { A: { MV: 5, TR: 5, OR: 5, TL: -2 }, B: { MV: 3, TR: 8, OR: 2, TL: 8 } },
        insights: {
          A: { first: 'Safety layers added quickly. Pipeline operational with new gates in 60 days.', second: 'Bolted-on safety creates friction but does not change the underlying culture. "Move fast" mentality works around safety gates.' },
          B: { first: 'Pipeline redesign takes 5 months. Feature development slows significantly.', second: 'Safety-first pipeline fundamentally changes how AI is developed. Zero incidents post-implementation. Engineering culture transforms. Engineers feel proud of the quality.' },
        },
      },
      {
        id: 3, title: 'Product Relaunch', month: 'Month 6',
        scenario: 'Your rebuilt AI pipeline is operational. Zero incidents for 4 months. Enterprise clients are cautiously re-engaging. Your CPO wants to relaunch the automation engine with new capabilities. Your Head of AI Safety argues for 6 more months of monitoring before adding new features.',
        choices: {
          A: 'Relaunch with new capabilities. Show the market you are back and better. Aggressive feature roadmap to reclaim competitive position.',
          B: 'Continue monitoring. Launch a "Reliability Dashboard" that shows real-time AI performance metrics to all clients. Let the data speak for 6 more months before adding new capabilities.',
        },
        scoring: { A: { MV: 10, TR: 3, OR: 8, TL: -3 }, B: { MV: 5, TR: 10, OR: 2, TL: 5 } },
        insights: {
          A: { first: 'Feature relaunch grabs attention. Analysts upgrade. Stock recovers.', second: 'New features on a platform with healing trust is risky. Any issue, however minor, triggers outsized market reaction.' },
          B: { first: 'Reliability dashboard is boring compared to competitors shipping features. Market share loss continues.', second: 'Six months of flawless operation data becomes most powerful marketing asset. Reliability Dashboard becomes must-have for enterprise procurement. "Proven reliable" becomes your brand.' },
        },
      },
      {
        id: 4, title: 'Trust Differentiation', month: 'Month 9',
        scenario: 'Your Reliability Dashboard has become a sensation. Enterprise procurement teams now require reliability metrics as part of vendor evaluation. Competitors are scrambling to build similar dashboards. Your Head of Product sees an opportunity to turn reliability and AI safety into a product category, not just a feature.',
        choices: {
          A: 'Productize AI safety and reliability. Launch a standalone AI governance platform for enterprises. New product line, new revenue stream.',
          B: 'Keep AI safety deeply integrated into your core platform. Make it the reason enterprises choose you. Safety is your brand, not your product.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 8, TL: -3 }, B: { MV: 7, TR: 10, OR: 2, TL: 7 } },
        insights: {
          A: { first: 'AI governance product creates new TAM. Analyst coverage expands.', second: 'Standalone safety product competes with established governance vendors. Engineering attention split. Core platform innovation slows.' },
          B: { first: 'Keeping safety integrated seems like missed revenue opportunity.', second: 'Safety-as-brand creates most defensible competitive position. Enterprises cannot get this reliability elsewhere. Pricing power increases. Switching costs through trust.' },
        },
      },
      {
        id: 5, title: 'Market Leadership', month: 'Month 12',
        scenario: 'You are now recognized as the most reliable enterprise AI platform. Client retention exceeds pre-incident levels. New enterprise clients cite reliability as the primary reason for choosing you. The board wants to capitalize. Two paths: expand the platform horizontally (more features), or expand vertically (more industries).',
        choices: {
          A: 'Horizontal expansion. Add AI capabilities across the enterprise — from automation to analytics to customer service. Become the AI platform for everything.',
          B: 'Vertical expansion. Build industry-specific AI solutions for healthcare, finance, and manufacturing — leveraging your reliability reputation in regulated industries where trust matters most.',
        },
        scoring: { A: { MV: 10, TR: 5, OR: 8, TL: -3 }, B: { MV: 7, TR: 10, OR: 3, TL: 7 } },
        insights: {
          A: { first: 'Horizontal expansion creates massive TAM story. Platform narrative is compelling.', second: 'Spreading across many capabilities dilutes the reliability advantage. Each new area requires deep expertise you don\'t have.' },
          B: { first: 'Vertical strategy seems narrower. Some analysts disappointed.', second: 'Regulated industries pay premium for reliability. Healthcare, finance, manufacturing become core verticals. Deep domain expertise compounds. Revenue per customer 3x higher than horizontal play.' },
        },
      },
      {
        id: 6, title: 'Platform Legacy', month: 'Month 15',
        scenario: 'The product catastrophe that nearly destroyed the company has been transformed into its defining competitive advantage. You built the most trusted enterprise AI platform in the world. The final question: use that position to become the largest enterprise AI company through aggressive scaling, or use it to set the standard for how AI should be built — safely, transparently, and accountably.',
        choices: {
          A: 'Scale aggressively. Acquire competitors. Expand globally. Become the dominant enterprise AI platform. Win the market-cap race.',
          B: 'Set the standard. Publish your AI safety frameworks. Collaborate with regulators. Build the platform that defines how enterprise AI should work. Win the trust race.',
        },
        scoring: { A: { MV: 12, TR: 3, OR: 12, TL: -5 }, B: { MV: 8, TR: 10, OR: 3, TL: 8 } },
        insights: {
          A: { first: 'Aggressive scaling creates market leader narrative. M&A creates growth.', second: 'Scaling through acquisition dilutes the very culture and reliability that made you special. Integration risk is enormous. Trust advantage erodes as scale increases.' },
          B: { first: 'Standard-setting is a long game. Investors want faster growth.', second: 'Published frameworks become industry standard. Regulatory influence creates structural advantage. Best talent joins the mission. Trust compounds. The company that nearly failed at AI becomes the company that defines how AI should be done.' },
        },
      },
    ],
  },
};

export function getLevelsForScenario(industry: IndustryKey, crisis: CrisisKey): Level[] {
  return LEVELS[industry][crisis];
}
