# The AI Strategy Boardroom

A 5-level interactive decision simulation game for corporate training and workshops. Players act as a C-suite executive guiding their company through critical AI transformation decisions across 12 months.

## Overview

Every choice is immediately validated — or punished — by a **live stock ticker** that reacts to strategy in real time. The game feels like a *Bloomberg Terminal meets a War Room*: dark, data-dense, high-stakes, cinematic.

### Key Features

- **5 Strategic Levels** across 12 months of AI transformation
- **Live Stock Ticker** as the central feedback system
- **Real-time Price Compounding** — choices stack and compound
- **Dramatic Market Reactions** with analyst notes
- **Final Market Verdict** based on performance

## Game Structure

| Level | Month | Decision |
|-------|-------|----------|
| 1 | Month 1 | The Readiness Dilemma |
| 2 | Month 4 | The Domain Crucible |
| 3 | Month 7 | The Agentic Shift |
| 4 | Month 10 | The Trust & Governance Shield |
| 5 | Month 12 | The Operating Model |

## Stock Ticker Mechanics

- **Starting Price**: $100.00
- **Price compounds** after each decision
- **Visual feedback**: Green (gain), Red (loss), Yellow (volatile)
- **Analyst Notes** provide market commentary

### Market Verdicts

| Final Price | Verdict | Description |
|-------------|---------|-------------|
| ≥ $130 | STRONG BUY | AI Transformation Champion |
| $110-$129 | OUTPERFORM | Solid Strategist |
| $90-$109 | HOLD | Cautious Progress |
| $70-$89 | UNDERPERFORM | Missed Opportunities |
| < $70 | SELL | Strategy Collapse |

## Design

**Aesthetic**: Bloomberg Terminal meets War Room

- **Background**: Near-black (#0A0A0F)
- **Gains**: Electric green (#00FF88)
- **Losses**: Bright red (#FF3B3B)
- **Volatile**: Amber (#FFB800)
- **Accent**: EXL Orange (#FF6600)
- **Typography**: DM Sans + DM Mono (terminal-style)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Fonts**: DM Sans, DM Mono

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
app/
  layout.tsx          # Root layout with metadata
  page.tsx            # Main game orchestrator
  globals.css         # Global styles and animations
components/
  IntroScreen.tsx     # Game introduction
  GameScreen.tsx      # Decision interface
  ChoiceCard.tsx      # Strategy choice cards
  InsightReveal.tsx   # THE MARKET REACTS section
  ResultScreen.tsx    # Final verdict and recap
  StockTicker.tsx     # Header ticker component
  TickerSidebar.tsx   # Full sidebar with chart
  MonthTimeline.tsx   # Progress timeline
  EXLLogo.tsx         # Logo component
  BackgroundOrbs.tsx  # Ambient visual effects
lib/
  types.ts            # TypeScript interfaces
  gameData.ts         # 5 levels with all content
  archetypes.ts       # Market verdict logic
```

## iPad Optimization

The game is optimized for iPad presentation:
- Responsive layout with sidebar on tablets
- Touch-friendly 44px minimum tap targets
- Safe area insets for notched devices
- Viewport settings to prevent unwanted zoom

## Facilitator Mode

During insight reveals, a facilitator note appears:

> "After reading the Second Order Insight, pause for effect, point to the ticker, and say: 'And here is how the Street reacted to that move...'"

---

Built with EXL branding for executive AI strategy workshops.
