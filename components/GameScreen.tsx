'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChoiceCard from './ChoiceCard';
import InsightReveal from './InsightReveal';
import { Level, Scores } from '@/lib/gameData';

interface GameScreenProps {
  level: Level;
  currentLevelIndex: number;
  totalLevels: number;
  scores: Scores;
  selectedChoice: 'A' | 'B' | null;
  onChoice: (choice: 'A' | 'B') => void;
  onNext: () => void;
  onUndo?: () => void;
  onReset?: () => void;
  canUndo?: boolean;
}

export default function GameScreen({
  level,
  currentLevelIndex,
  totalLevels,
  scores,
  selectedChoice,
  onChoice,
  onNext,
  onUndo,
  onReset,
  canUndo = false,
}: GameScreenProps) {
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    setShowInsight(false);
  }, [currentLevelIndex]);

  useEffect(() => {
    if (selectedChoice !== null && !showInsight) {
      const timer = setTimeout(() => setShowInsight(true), 500);
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

  const handleRepeat = () => {
    if (onUndo) {
      setShowInsight(false);
      onUndo();
    }
  };

  const isLastLevel = currentLevelIndex === totalLevels - 1;

  return (
    <div className="h-full flex flex-col px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-3">
          {onReset && (
            <button
              onClick={onReset}
              className="text-white/40 hover:text-white/70 text-sm flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Restart
            </button>
          )}
        </div>
        <p className="text-white/40 text-xs font-mono">
          Decision {currentLevelIndex + 1} of {totalLevels}
        </p>
      </div>

      <div className="flex-1 flex items-start justify-center overflow-y-auto">
        <div className="max-w-2xl w-full">
          <div className="mb-3 md:mb-4">
            <p className="font-mono text-[10px] text-exl-orange tracking-[0.2em] uppercase mb-1">
              {level.month} &middot; Decision {level.id} of {totalLevels}
            </p>
            <h2 className="text-lg md:text-2xl font-bold text-white">
              {level.title}
            </h2>
          </div>

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
                className="space-y-3"
              >
                <ChoiceCard
                  choice="A"
                  description={level.choices.A}
                  isSelected={selectedChoice === 'A'}
                  isDisabled={selectedChoice !== null && selectedChoice !== 'A'}
                  onSelect={() => handleChoiceSelect('A')}
                />
                <ChoiceCard
                  choice="B"
                  description={level.choices.B}
                  isSelected={selectedChoice === 'B'}
                  isDisabled={selectedChoice !== null && selectedChoice !== 'B'}
                  onSelect={() => handleChoiceSelect('B')}
                />
              </motion.div>
            ) : (
              <motion.div
                key="insight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <InsightReveal
                  choice={selectedChoice!}
                  insight={level.insights[selectedChoice!]}
                  onNext={handleNext}
                  onRepeat={canUndo ? handleRepeat : undefined}
                  isLastLevel={isLastLevel}
                  canRepeat={canUndo}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
