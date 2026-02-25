'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChoiceCard from './ChoiceCard';
import InsightReveal from './InsightReveal';
import { Level } from '@/lib/types';
import { getStockImpact, getChoiceDescription } from '@/lib/gameData';

interface GameScreenProps {
  level: Level;
  currentLevelIndex: number;
  totalLevels: number;
  currentPrice: number;
  selectedChoice: 'A' | 'B' | null;
  variantIndices: { A: number; B: number };
  displayOrder: ('A' | 'B')[];
  onChoice: (choice: 'A' | 'B') => void;
  onNext: () => void;
  onReset?: () => void;
}

export default function GameScreen({
  level,
  currentLevelIndex,
  totalLevels,
  currentPrice,
  selectedChoice,
  variantIndices,
  displayOrder,
  onChoice,
  onNext,
  onReset,
}: GameScreenProps) {
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    setShowInsight(false);
  }, [currentLevelIndex]);

  useEffect(() => {
    if (selectedChoice !== null && !showInsight) {
      const timer = setTimeout(() => setShowInsight(true), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedChoice, showInsight]);

  const handleChoiceSelect = (choice: 'A' | 'B') => {
    if (selectedChoice !== null) return;
    onChoice(choice);
  };

  const handleNext = () => {
    setShowInsight(false);
    onNext();
  };

  const isLastLevel = currentLevelIndex === totalLevels - 1;

  const stockImpact = selectedChoice
    ? getStockImpact(level, selectedChoice, currentPrice)
    : null;

  return (
    <div className="h-full flex flex-col px-3 md:px-6 py-3 md:py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="text-white/40 hover:text-white/70 text-xs md:text-sm flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Restart</span>
            </button>
          )}
        </div>
        <p className="text-white/40 text-[10px] md:text-xs font-mono">
          Level {currentLevelIndex + 1}/{totalLevels}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center overflow-y-auto">
        <div className="max-w-2xl w-full">
          {/* Level Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 md:mb-4"
          >
            <p className="font-mono text-[10px] md:text-xs text-exl-orange tracking-[0.15em] md:tracking-[0.2em] uppercase mb-1">
              {level.month} · Decision {level.id} of {totalLevels}
            </p>
            <h2 className="text-lg md:text-2xl font-bold text-white">
              {level.title}
            </h2>
          </motion.div>

          {/* Scenario Card */}
          <div className="bg-surface border-l-4 border-l-exl-orange border border-border rounded-xl p-3 md:p-4 mb-3 md:mb-4">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-2">
              The Scenario
            </p>
            <p className="text-white/80 leading-relaxed text-sm">
              {level.scenario}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showInsight ? (
              <motion.div
                key="choices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 md:space-y-4"
              >
                {displayOrder.map((actualChoice, displayIndex) => {
                  const displayLabel = displayIndex === 0 ? 'A' : 'B';
                  return (
                    <ChoiceCard
                      key={actualChoice}
                      choice={displayLabel as 'A' | 'B'}
                      data={level.choices[actualChoice]}
                      description={getChoiceDescription(level, actualChoice, variantIndices[actualChoice])}
                      isSelected={selectedChoice === actualChoice}
                      isDisabled={selectedChoice !== null && selectedChoice !== actualChoice}
                      onSelect={() => handleChoiceSelect(actualChoice)}
                    />
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="insight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {stockImpact && selectedChoice && (
                  <InsightReveal
                    choice={selectedChoice}
                    choiceData={level.choices[selectedChoice]}
                    stockImpact={stockImpact}
                    onNext={handleNext}
                    isLastLevel={isLastLevel}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
