'use client';

import { motion } from 'framer-motion';
import { MONTH_MARKERS, TOTAL_MONTHS } from '@/lib/gameData';

interface MonthTimelineProps {
  currentLevel: number;
  completedLevels: number;
  isComplete?: boolean;
}

export default function MonthTimeline({ currentLevel, completedLevels, isComplete = false }: MonthTimelineProps) {
  const months = Array.from({ length: TOTAL_MONTHS }, (_, i) => i + 1);
  const decisionMonths = MONTH_MARKERS;
  
  const getMonthStatus = (month: number): 'completed' | 'current' | 'pending' => {
    if (isComplete) return 'completed';
    
    const decisionIndex = decisionMonths.indexOf(month as typeof decisionMonths[number]);
    
    if (decisionIndex === -1) {
      const prevDecisionMonth = decisionMonths.filter(m => m < month).pop() || 0;
      const prevDecisionIndex = decisionMonths.indexOf(prevDecisionMonth as typeof decisionMonths[number]);
      return prevDecisionIndex < completedLevels ? 'completed' : 'pending';
    }
    
    if (decisionIndex < completedLevels) return 'completed';
    if (decisionIndex === currentLevel) return 'current';
    return 'pending';
  };

  const getProgressWidth = () => {
    if (isComplete) return 100;
    const currentMonth = decisionMonths[currentLevel];
    if (!currentMonth) return 0;
    return ((currentMonth - 1) / (TOTAL_MONTHS - 1)) * 100;
  };

  const isDecisionMonth = (month: number) => decisionMonths.includes(month as typeof decisionMonths[number]);

  const LABEL_WIDTH = 56;

  return (
    <div className="relative px-2">
      <div className="relative h-5 mb-1 flex items-center">
        <span 
          className="text-[10px] font-mono text-white/50 uppercase tracking-wider flex-shrink-0"
          style={{ width: `${LABEL_WIDTH}px` }}
        >
          Months
        </span>
        <div className="relative flex-1 h-full">
          {months.map((month) => {
            const leftPercent = ((month - 1) / (TOTAL_MONTHS - 1)) * 100;
            const status = getMonthStatus(month);
            const isDecision = isDecisionMonth(month);
            
            return (
              <div
                key={month}
                className="absolute -translate-x-1/2"
                style={{ left: `${leftPercent}%` }}
              >
                <span
                  className={`
                    text-xs font-mono transition-all duration-300
                    ${isDecision ? 'font-bold text-sm' : 'opacity-60 text-[10px]'}
                    ${status === 'completed' ? 'text-green-400' : ''}
                    ${status === 'current' ? 'text-exl-orange' : ''}
                    ${status === 'pending' ? 'text-white/40' : ''}
                  `}
                >
                  {month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative h-6 flex items-center" style={{ marginLeft: `${LABEL_WIDTH}px` }}>
        <div className="absolute inset-x-0 h-1.5 bg-surface/80 rounded-full" />
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${getProgressWidth()}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute h-1.5 left-0 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
        />

        {decisionMonths.map((month, index) => {
          const leftPercent = ((month - 1) / (TOTAL_MONTHS - 1)) * 100;
          const status = getMonthStatus(month);
          
          return (
            <div
              key={`marker-${month}`}
              className="absolute -translate-x-1/2 z-10"
              style={{ left: `${leftPercent}%` }}
            >
              <div
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300
                  ${status === 'completed' 
                    ? 'bg-green-500 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' 
                    : status === 'current'
                      ? 'bg-exl-orange border-exl-orange-light shadow-[0_0_12px_rgba(242,101,34,0.6)]'
                      : 'bg-surface border-border'
                  }
                `}
              >
                {status === 'completed' && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {status === 'current' && (
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-white" 
                  />
                )}
                {status === 'pending' && (
                  <span className="text-[10px] font-mono text-white/40">
                    {index + 1}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative h-5 mt-1" style={{ marginLeft: `${LABEL_WIDTH}px` }}>
        {decisionMonths.map((month, index) => {
          const status = getMonthStatus(month);
          const leftPercent = ((month - 1) / (TOTAL_MONTHS - 1)) * 100;
          
          if (status !== 'current') return null;
          
          return (
            <motion.div
              key={`label-${month}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -translate-x-1/2"
              style={{ left: `${leftPercent}%` }}
            >
              <span className="text-[9px] font-mono text-exl-orange bg-background px-1.5 py-0.5 rounded border border-exl-orange/30">
                Decision {index + 1}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-1 text-[9px] font-mono text-white/40">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Done</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-exl-orange" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-surface border border-border" />
          <span>Next</span>
        </div>
      </div>
    </div>
  );
}
