'use client';

import { motion } from 'framer-motion';
import { Choice } from '@/lib/types';

interface ChoiceCardProps {
  choice: 'A' | 'B';
  data: Choice;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

export default function ChoiceCard({
  choice,
  data,
  isSelected,
  isDisabled,
  onSelect,
}: ChoiceCardProps) {
  const colors = {
    A: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-400/40',
      text: 'text-blue-400',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
      tag: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    },
    B: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-400/40',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      tag: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    },
  };

  const c = colors[choice];

  return (
    <motion.button
      onClick={onSelect}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.01, y: -2 } : {}}
      whileTap={!isDisabled ? { scale: 0.99 } : {}}
      className={`
        w-full text-left rounded-xl border-2 p-3 md:p-4 transition-all duration-300 relative
        ${c.bg} ${c.border}
        ${isSelected ? `ring-2 ring-offset-2 ring-offset-background ${c.glow}` : ''}
        ${isDisabled && !isSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-opacity-80'}
      `}
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className={`
          flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center
          font-mono font-bold text-lg md:text-xl ${c.bg} ${c.text} border ${c.border}
        `}>
          {choice}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
            <h3 className={`font-bold text-base md:text-lg ${c.text}`}>
              {data.title}
            </h3>
          </div>
          
          <div className={`
            inline-block px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-mono font-medium
            border ${c.tag} mb-2
          `}>
            {data.strategicTags}
          </div>
          
          <p className="text-white/60 text-xs md:text-sm leading-relaxed">
            Choose this path to see how the market reacts.
          </p>
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 md:top-3 md:right-3"
        >
          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${c.bg} ${c.border} border flex items-center justify-center`}>
            <svg className={`w-3 h-3 md:w-4 md:h-4 ${c.text}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}
