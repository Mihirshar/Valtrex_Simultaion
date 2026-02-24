'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreen from '@/components/IntroScreen';
import GameScreen from '@/components/GameScreen';
import ResultScreen from '@/components/ResultScreen';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import MonthTimeline from '@/components/MonthTimeline';
import StockTicker from '@/components/StockTicker';
import TickerSidebar from '@/components/TickerSidebar';
import EXLLogo from '@/components/EXLLogo';
import { INITIAL_STOCK, LEVELS, calculateStockState } from '@/lib/gameData';
import { StockState, ChoiceRecord, MarketVerdict } from '@/lib/types';
import { getMarketVerdict } from '@/lib/archetypes';

type Phase = 'intro' | 'game' | 'result';

const contentTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

export default function Home() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choiceRecords, setChoiceRecords] = useState<ChoiceRecord[]>([]);
  const [stockState, setStockState] = useState<StockState>(INITIAL_STOCK);
  const [currentSelectedChoice, setCurrentSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [showEdgeGlow, setShowEdgeGlow] = useState<'gain' | 'loss' | 'volatile' | null>(null);
  const [verdict, setVerdict] = useState<MarketVerdict | null>(null);

  const handleStart = useCallback(() => {
    setPhase('game');
  }, []);

  const handleChoice = useCallback((choice: 'A' | 'B') => {
    setCurrentSelectedChoice(choice);
  }, []);

  const handleNext = useCallback(() => {
    if (currentSelectedChoice === null) return;

    const level = LEVELS[currentLevel];
    const choiceData = level.choices[currentSelectedChoice];
    
    const newRecord: ChoiceRecord = {
      level: level.id,
      choice: currentSelectedChoice,
      choiceLabel: choiceData.title,
      tickerResult: choiceData.tickerResult,
      priceAfter: 0,
    };

    const newRecords = [...choiceRecords, newRecord];
    const newStockState = calculateStockState(newRecords);
    
    newRecord.priceAfter = newStockState.price;
    
    setChoiceRecords(newRecords);
    setStockState(newStockState);
    setCurrentSelectedChoice(null);

    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      const finalVerdict = getMarketVerdict(newStockState.price);
      setVerdict(finalVerdict);
      setPhase('result');
    }
  }, [currentLevel, currentSelectedChoice, choiceRecords]);

  const handleTickerFlash = useCallback((type: 'gain' | 'loss' | 'volatile') => {
    setShowEdgeGlow(type);
    setTimeout(() => setShowEdgeGlow(null), 2000);
  }, []);

  const handleReset = useCallback(() => {
    setPhase('intro');
    setCurrentLevel(0);
    setChoiceRecords([]);
    setStockState(INITIAL_STOCK);
    setCurrentSelectedChoice(null);
    setShowEdgeGlow(null);
    setVerdict(null);
  }, []);

  const showTicker = phase === 'game';
  const showTimeline = phase === 'game';
  const showSidebar = phase === 'game';

  return (
    <main className="h-screen h-[100dvh] bg-background text-white overflow-hidden relative flex flex-col">
      <BackgroundOrbs />

      {/* Full-screen edge glow effect */}
      <AnimatePresence>
        {showEdgeGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              boxShadow: `inset 0 0 150px ${
                showEdgeGlow === 'gain' ? '#00FF8850' :
                showEdgeGlow === 'loss' ? '#FF3B3B50' :
                '#FFB80050'
              }`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Header - Optimized for iPad */}
      <header className="flex-shrink-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2">
            <EXLLogo />
            
            {/* Ticker - visible on tablet and up */}
            {showTicker && (
              <div className="flex-1 max-w-md mx-2 md:mx-4">
                <StockTicker stockState={stockState} onFlash={handleTickerFlash} />
              </div>
            )}

            <div className="text-right flex-shrink-0">
              <p className="font-mono text-[10px] md:text-xs text-white/40 hidden sm:block">
                AI Strategy Boardroom
              </p>
            </div>
          </div>

          {/* Timeline - Compact for iPad */}
          {showTimeline && (
            <div className="mt-2 md:mt-3 border-t border-border/50 pt-2 md:pt-3">
              <MonthTimeline 
                currentLevelIndex={currentLevel} 
                completedLevels={choiceRecords.length}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area - Flex layout for iPad landscape */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {phase === 'intro' && (
              <motion.div key="intro" {...contentTransition} className="h-full">
                <IntroScreen onStart={handleStart} />
              </motion.div>
            )}

            {phase === 'game' && (
              <motion.div key={`game-${currentLevel}`} {...contentTransition} className="h-full">
                <GameScreen
                  level={LEVELS[currentLevel]}
                  currentLevelIndex={currentLevel}
                  totalLevels={LEVELS.length}
                  currentPrice={stockState.price}
                  selectedChoice={currentSelectedChoice}
                  onChoice={handleChoice}
                  onNext={handleNext}
                  onReset={handleReset}
                />
              </motion.div>
            )}

            {phase === 'result' && verdict && (
              <motion.div key="result" {...contentTransition} className="h-full">
                <ResultScreen
                  stockState={stockState}
                  choiceRecords={choiceRecords}
                  verdict={verdict}
                  onRestart={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ticker Sidebar - Show on iPad (md: 768px+) and larger */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex w-72 lg:w-80 xl:w-96 border-l border-border/50 bg-surface/30 backdrop-blur-sm flex-shrink-0"
            >
              <TickerSidebar
                stockState={stockState}
                choiceRecords={choiceRecords}
                currentLevelIndex={currentLevel}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
