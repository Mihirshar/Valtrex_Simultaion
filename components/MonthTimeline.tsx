'use client';

import { motion } from 'framer-motion';
import { LEVELS } from '@/lib/gameData';

interface MonthTimelineProps {
  currentLevelIndex: number;
  completedLevels: number;
}

export default function MonthTimeline({ currentLevelIndex, completedLevels }: MonthTimelineProps) {
  return (
    <div className="flex items-center justify-center gap-0.5 md:gap-1 px-2">
      {LEVELS.map((level, index) => {
        const isCompleted = index < completedLevels;
        const isCurrent = index === currentLevelIndex;
        const isPending = index > currentLevelIndex;

        return (
          <div key={level.id} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.08 }}
              className="flex flex-col items-center"
            >
              <div
                className={`
                  w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center
                  font-mono text-[10px] md:text-xs font-bold transition-all duration-300
                  ${isCompleted ? 'bg-ticker-gain/20 text-ticker-gain border-2 border-ticker-gain/40' : ''}
                  ${isCurrent ? 'bg-exl-orange/20 text-exl-orange border-2 border-exl-orange ring-2 ring-exl-orange/30 ring-offset-1 ring-offset-background' : ''}
                  ${isPending ? 'bg-white/5 text-white/30 border border-white/10' : ''}
                `}
              >
                {isCompleted ? '✓' : level.id}
              </div>
              <p className={`
                mt-0.5 text-[8px] md:text-[9px] font-mono whitespace-nowrap
                ${isCurrent ? 'text-exl-orange' : isCompleted ? 'text-ticker-gain/70' : 'text-white/30'}
              `}>
                M{level.monthNumber}
              </p>
            </motion.div>

            {index < LEVELS.length - 1 && (
              <div
                className={`
                  w-3 md:w-6 h-0.5 mx-0.5
                  ${index < completedLevels ? 'bg-ticker-gain/40' : 'bg-white/10'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
