'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SelectionScreen from '@/components/SelectionScreen';
import IntroScreen from '@/components/IntroScreen';
import GameScreen from '@/components/GameScreen';
import ResultScreen from '@/components/ResultScreen';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import MonthTimeline from '@/components/MonthTimeline';
import ArchetypeReveal from '@/components/ArchetypeReveal';
import EXLLogo from '@/components/EXLLogo';
import { INITIAL_SCORES, Scores, calculateScores, getLevelsForScenario } from '@/lib/gameData';
import { IndustryKey, CrisisKey, INDUSTRIES_META, CRISES_META } from '@/lib/types';
import { computeEV, determineArchetype, Archetype } from '@/lib/archetypes';

type Phase = 'select' | 'intro' | 'game' | 'calculating' | 'result';

const contentTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

export default function Home() {
  const [phase, setPhase] = useState<Phase>('select');
  const [industry, setIndustry] = useState<IndustryKey | null>(null);
  const [crisis, setCrisis] = useState<CrisisKey | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choices, setChoices] = useState<('A' | 'B')[]>([]);
  const [scores, setScores] = useState<Scores>(INITIAL_SCORES);
  const [finalArchetype, setFinalArchetype] = useState<Archetype | null>(null);
  const [currentSelectedChoice, setCurrentSelectedChoice] = useState<'A' | 'B' | null>(null);

  const levels = useMemo(() => {
    if (industry && crisis) return getLevelsForScenario(industry, crisis);
    return [];
  }, [industry, crisis]);

  const handleSelect = useCallback((ind: IndustryKey, cri: CrisisKey) => {
    setIndustry(ind);
    setCrisis(cri);
    setPhase('intro');
  }, []);

  const handleStart = useCallback(() => {
    setPhase('game');
  }, []);

  const handleChoice = useCallback((choice: 'A' | 'B') => {
    setCurrentSelectedChoice(choice);
  }, []);

  const handleNext = useCallback(() => {
    if (currentSelectedChoice === null) return;
    
    const newChoices = [...choices, currentSelectedChoice];
    const newScores = calculateScores(newChoices, levels);
    setChoices(newChoices);
    setScores(newScores);
    setCurrentSelectedChoice(null);
    
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      const ev = computeEV(newScores);
      const archetype = determineArchetype(ev, newScores);
      setFinalArchetype(archetype);
      setPhase('calculating');
    }
  }, [currentLevel, choices, currentSelectedChoice, levels]);

  const handleUndo = useCallback(() => {
    if (choices.length > 0) {
      const newChoices = choices.slice(0, -1);
      setChoices(newChoices);
      setScores(calculateScores(newChoices, levels));
      setCurrentLevel(Math.max(0, currentLevel - 1));
      setCurrentSelectedChoice(null);
    }
  }, [choices, currentLevel, levels]);

  const handleCalculationComplete = useCallback(() => {
    setPhase('result');
  }, []);

  const handleReset = useCallback(() => {
    setPhase('select');
    setIndustry(null);
    setCrisis(null);
    setCurrentLevel(0);
    setChoices([]);
    setScores(INITIAL_SCORES);
    setFinalArchetype(null);
    setCurrentSelectedChoice(null);
  }, []);

  const showHeader = phase === 'game' || phase === 'calculating' || phase === 'result';

  return (
    <main className="relative h-screen bg-background overflow-hidden flex flex-col">
      <BackgroundOrbs />
      
      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="relative z-20 flex-shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between gap-2 md:gap-8">
                <EXLLogo size="sm" withGlow={false} />
                <div className="flex-1 max-w-2xl hidden sm:block">
                  <MonthTimeline 
                    currentLevel={currentLevel} 
                    completedLevels={choices.length}
                    isComplete={phase === 'result' || phase === 'calculating'}
                  />
                </div>
                <div className="flex-1 sm:hidden text-center">
                  <span className="text-xs text-white/60 font-mono">
                    {phase === 'result' || phase === 'calculating' ? 'Complete' : `${currentLevel + 1}/${levels.length}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                  {industry && crisis && (
                    <span className="hidden md:inline">
                      {INDUSTRIES_META[industry].icon} {CRISES_META[crisis].icon}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {phase === 'select' && (
              <motion.div key="select" {...contentTransition} className="h-full">
                <SelectionScreen onSelect={handleSelect} />
              </motion.div>
            )}

            {phase === 'intro' && industry && crisis && (
              <motion.div key="intro" {...contentTransition} className="h-full">
                <IntroScreen industry={industry} crisis={crisis} onStart={handleStart} />
              </motion.div>
            )}

            {phase === 'game' && levels.length > 0 && (
              <motion.div key={`game-${currentLevel}`} {...contentTransition} className="h-full">
                <GameScreen
                  level={levels[currentLevel]}
                  currentLevelIndex={currentLevel}
                  totalLevels={levels.length}
                  scores={scores}
                  selectedChoice={currentSelectedChoice}
                  onChoice={handleChoice}
                  onNext={handleNext}
                  onUndo={handleUndo}
                  onReset={handleReset}
                  canUndo={choices.length > 0}
                />
              </motion.div>
            )}

            {phase === 'calculating' && finalArchetype && (
              <motion.div key="calculating" {...contentTransition} className="h-full">
                <ArchetypeReveal
                  archetype={finalArchetype}
                  onComplete={handleCalculationComplete}
                />
              </motion.div>
            )}

            {phase === 'result' && finalArchetype && (
              <motion.div key="result" {...contentTransition} className="h-full">
                <ResultScreen
                  scores={scores}
                  choices={choices}
                  archetype={finalArchetype}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
