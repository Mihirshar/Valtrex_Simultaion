# AI Valuation Increase Quiz

Valtrex Group AI Comeback Simulation built with Next.js 14, Tailwind CSS, and Framer Motion.

## Overview

This project is an executive strategy simulation where a player:

1. Selects an industry and crisis scenario
2. Makes 6 sequential strategic decisions
3. Gets a final Enterprise Value (EV) outcome and leadership archetype

The app currently supports:

- 4 industries
- 4 crisis types per industry
- 16 total scenario paths
- 96 total decisions (16 x 6)

## Core Scoring Model

The game tracks four metrics:

- **MV**: Market Value Recovery
- **TR**: Trust Restoration
- **OR**: Operational Risk
- **TL**: Talent & Culture

Final result is based on the EV formula:

`EV = (MV * 50) + (TR * 50) + TL contribution - OR penalty - TL negative penalty`

Where:

- `OR penalty = max(0, OR - 35) * 80`
- `TL contribution = TL * 25` when `TL >= 0`
- `TL negative penalty = 500` when `TL < 0`

## Flow

- **Select**: Choose industry + crisis
- **Intro**: Scenario brief and metric targets
- **Game**: 6 decisions across Months 1, 3, 6, 9, 12, 15
- **Result**: EV value, recovery tier, scorecard, and archetype

## Leadership Archetypes

- The Comeback Architect
- The Velocity Maximizer
- The Trust Guardian
- The Efficiency Trap
- The Cautionary Tale

## Branding

Theme uses EXL orange accent to match logo:

- Primary accent: `#F26522`
- Dark boardroom background with surface layers
- Orange highlights on actions, timeline, and key metrics

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

Open `http://localhost:3000`.

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  SelectionScreen.tsx
  IntroScreen.tsx
  GameScreen.tsx
  ResultScreen.tsx
  MonthTimeline.tsx
  ScoreMeter.tsx
  ArchetypeReveal.tsx
  ChoiceCard.tsx
  InsightReveal.tsx
  EXLLogo.tsx
  BackgroundOrbs.tsx
lib/
  gameData.ts
  archetypes.ts
  types.ts
  useConfetti.ts
```

## Notes

- This repo contains the adapted UI from the board-challenge base with Valtrex-specific game data and EV logic.
- All scenario content is embedded in `lib/gameData.ts`.
