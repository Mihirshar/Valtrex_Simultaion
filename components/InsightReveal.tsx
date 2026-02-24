'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Choice } from '@/lib/types';

interface StockImpact {
  newPrice: number;
  change: number;
  changePercent: number;
  type: 'gain' | 'loss' | 'volatile';
  label: string;
  analystNote: string;
  insightRecap: string;
  marketReacts: string;
}

interface InsightRevealProps {
  choice: 'A' | 'B';
  choiceData: Choice;
  stockImpact: StockImpact;
  onNext: () => void;
  isLastLevel: boolean;
}

function TypewriterText({ text, delay = 0, speed = 30 }: { text: string; delay?: number; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay, speed]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
}

export default function InsightReveal({
  choice,
  choiceData,
  stockImpact,
  onNext,
  isLastLevel,
}: InsightRevealProps) {
  const choiceColors = {
    A: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-400/40',
      text: 'text-blue-400',
    },
    B: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-400/40',
      text: 'text-purple-400',
    },
  };

  const colors = choiceColors[choice];
  
  const tickerColors = {
    gain: {
      text: 'text-ticker-gain',
      bg: 'bg-ticker-gain/10',
      border: 'border-ticker-gain/30',
      glow: '#00FF88',
      icon: '🟢',
    },
    loss: {
      text: 'text-ticker-loss',
      bg: 'bg-ticker-loss/10',
      border: 'border-ticker-loss/30',
      glow: '#FF3B3B',
      icon: '🔴',
    },
    volatile: {
      text: 'text-ticker-volatile',
      bg: 'bg-ticker-volatile/10',
      border: 'border-ticker-volatile/30',
      glow: '#FFB800',
      icon: '🟡',
    },
  };

  const tc = tickerColors[stockImpact.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-3 md:space-y-4"
    >
      {/* Choice Made */}
      <div className={`rounded-xl border-2 p-3 md:p-4 ${colors.bg} ${colors.border}`}>
        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
          <span className={`font-mono text-xs md:text-sm font-bold ${colors.text}`}>
            Choice {choice}: {choiceData.title}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] md:text-xs font-mono ${colors.bg} ${colors.text} border ${colors.border}`}>
            {choiceData.strategicTags}
          </span>
        </div>
        
        <div>
          <p className="text-white/40 font-mono text-[9px] md:text-[10px] uppercase tracking-wider mb-1">
            Insight Recap
          </p>
          <p className="text-white/80 leading-relaxed text-sm md:text-base">{stockImpact.insightRecap}</p>
        </div>
      </div>

      {/* Facilitator Note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="bg-exl-orange/5 border border-exl-orange/20 rounded-lg p-2.5 md:p-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-exl-orange text-sm md:text-base">🎯</span>
          <p className="text-exl-orange/90 text-[10px] md:text-xs font-medium">
            <span className="font-bold">Facilitator:</span> <span className="italic">&ldquo;And here is how the Street reacted...&rdquo;</span>
          </p>
        </div>
      </motion.div>

      {/* THE MARKET REACTS */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className={`rounded-xl border-2 p-3 md:p-4 ${tc.bg} ${tc.border} relative overflow-hidden`}
        style={{
          boxShadow: `0 0 30px ${tc.glow}25, inset 0 0 20px ${tc.glow}10`,
        }}
      >
        {/* Animated edge glow */}
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2.5, delay: 0.5 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 50px ${tc.glow}40`,
          }}
        />
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
            style={{ backgroundColor: tc.glow }}
            animate={{
              boxShadow: [
                `0 0 4px ${tc.glow}`,
                `0 0 12px ${tc.glow}`,
                `0 0 4px ${tc.glow}`,
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <p className="font-mono text-xs md:text-sm text-white uppercase tracking-widest font-bold">
            THE MARKET REACTS:
          </p>
        </div>

        {/* Market Reaction Text */}
        <p className="text-white/70 mb-3 text-sm md:text-base">{stockImpact.marketReacts}</p>
        
        {/* Ticker Result */}
        <div className="flex items-center justify-between mb-3 p-2.5 md:p-3 bg-black/30 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-lg md:text-xl">{tc.icon}</span>
            <p className={`font-mono text-xs md:text-sm font-bold ${tc.text}`}>
              {stockImpact.label}
            </p>
          </div>
          <div className="text-right">
            <motion.p
              className={`font-mono text-xl md:text-2xl font-bold ${tc.text}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
              style={{ textShadow: `0 0 15px ${tc.glow}` }}
            >
              {stockImpact.changePercent >= 0 ? '+' : ''}{stockImpact.changePercent.toFixed(1)}%
            </motion.p>
            <motion.p
              className="font-mono text-[10px] md:text-xs text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              ${stockImpact.newPrice.toFixed(2)}
            </motion.p>
          </div>
        </div>
        
        {/* Analyst Note */}
        <div className="border-t border-white/10 pt-3">
          <p className="text-white/50 text-[9px] md:text-[10px] font-mono uppercase tracking-wider mb-1.5">
            Analyst Consensus
          </p>
          <p className="text-white/80 italic font-mono text-xs md:text-sm">
            &ldquo;<TypewriterText text={stockImpact.analystNote} delay={2000} speed={25} />&rdquo;
          </p>
        </div>
      </motion.div>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
      >
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full text-base md:text-lg py-3 md:py-4"
        >
          {isLastLevel ? 'View Final Verdict' : 'Next Decision'}
          <span className="ml-2">→</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
