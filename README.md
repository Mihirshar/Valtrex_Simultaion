# EXL AI Org Board Challenge

An executive AI strategy simulation game built with Next.js 14, Tailwind CSS, and Framer Motion.

## Overview

This is a production-grade, interactive React application used in live boardroom settings at EXL Services. Players navigate through 5 strategic decision points over a simulated 12-month AI transformation journey, with their choices affecting four key metrics:

- **TV** - Turnaround Value (Target: > +35)
- **OR** - Operational Risk (Limit: < +40)
- **IV** - Innovation Velocity (Target: > 0)
- **HR** - Human Readiness (Target: > 0)

## Features

- 🎮 **3-Phase Gameplay**: Intro → 5 Decision Levels → Results Dashboard
- 📊 **Real-time Scoring**: Track four metrics across every decision
- 🎭 **Leadership Archetypes**: Get assigned one of four leadership profiles based on your choices
- ✨ **Premium Animations**: Smooth page transitions and micro-interactions with Framer Motion
- 🎨 **EXL Branding**: Custom theme with EXL Orange (#F26522)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Fonts**: DM Sans (body) + DM Mono (labels/scores)
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

## Game Structure

### Phase 1: Intro Screen
- Welcome message and mandate explanation
- Overview of the four scoring dimensions
- "Accept the Mandate" CTA to begin

### Phase 2: Game Screen (5 Levels)
1. **The Readiness Dilemma** (Month 1) - Budget allocation
2. **The Domain Crucible** (Month 4) - DSLM vs generic LLM
3. **The Agentic Shift** (Month 7) - Copilots vs autonomous agents
4. **The Trust & Governance Shield** (Month 10) - Pause vs guardrails
5. **The Operating Model** (Month 12) - Automation vs value creation

### Phase 3: Results Dashboard
- Animated score meters for each metric
- Leadership archetype reveal with detailed analysis
- Play again option

## Leadership Archetypes

1. **The Balanced Catalyst** ⚡ - Successfully balanced speed, risk, and culture
2. **The Technology Accelerator** 🚀 - Prioritized rapid tech deployment
3. **The Governance Champion** 🛡️ - Focused on security and compliance
4. **The Efficiency Optimizer** 📉 - Drove immediate cost savings

## Project Structure

```
board-challenge/
├── app/
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Main game orchestrator
│   └── globals.css      # Tailwind + custom styles
├── components/
│   ├── IntroScreen.tsx  # Phase 1 welcome
│   ├── GameScreen.tsx   # Phase 2 decisions
│   ├── ResultScreen.tsx # Phase 3 dashboard
│   ├── ScoreMeter.tsx   # Animated score bar
│   ├── ChoiceCard.tsx   # A/B decision cards
│   ├── ProgressBar.tsx  # 5-segment tracker
│   ├── ArchetypeCard.tsx# Leadership reveal
│   ├── BackgroundOrbs.tsx# Ambient effects
│   └── EXLLogo.tsx      # Brand logo component
├── lib/
│   ├── gameData.ts      # Levels, scoring, insights
│   └── archetypes.ts    # Archetype definitions
└── tailwind.config.ts   # Custom EXL theme
```

## Customization

### Changing Brand Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  exl: {
    orange: '#F26522',   // Change to your brand color
    'orange-light': '#F4943E',
    'orange-dark': '#E85D26',
  },
}
```

### Adding New Levels

Add to the `LEVELS` array in `lib/gameData.ts`:
```typescript
{
  id: 6,
  title: 'Your New Level',
  month: 'Month 15',
  scenario: 'Description...',
  choices: {
    A: 'Option A description',
    B: 'Option B description',
  },
  scoring: {
    A: { IV: +10, OR: +5, HR: -5, TV: +8 },
    B: { IV: -5, OR: -10, HR: +15, TV: +12 },
  },
  insights: {
    A: { first: '...', second: '...' },
    B: { first: '...', second: '...' },
  },
}
```

## License

Internal use only - EXL Services
