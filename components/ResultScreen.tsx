'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { StockState, ChoiceRecord, MarketVerdict } from '@/lib/types';
import { LEVELS } from '@/lib/gameData';

function Confetti({ isActive }: { isActive: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (isActive) {
      const colors = ['#00FF88', '#FFB800', '#FF6600', '#00BFFF', '#FF69B4'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: -20, x: `${particle.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '110vh', 
            opacity: [1, 1, 0],
            rotate: Math.random() > 0.5 ? 360 : -360,
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            delay: particle.delay,
            ease: 'linear',
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
}

interface ResultScreenProps {
  stockState: StockState;
  choiceRecords: ChoiceRecord[];
  verdict: MarketVerdict;
  onRestart: () => void;
}

export default function ResultScreen({
  stockState,
  choiceRecords,
  verdict,
  onRestart,
}: ResultScreenProps) {
  const netChange = stockState.price - 100;
  const netChangePercent = ((stockState.price - 100) / 100) * 100;
  const isPositive = netChange >= 0;
  const isWinner = stockState.price >= 110;

  return (
    <div className="h-full flex flex-col items-center justify-start px-3 md:px-6 py-4 md:py-6 overflow-y-auto">
      <Confetti isActive={isWinner} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-[10px] md:text-xs text-white/50 uppercase tracking-widest mb-1 md:mb-2"
          >
            Portfolio Summary
          </motion.p>
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white"
          >
            Final Verdict
          </motion.h1>
        </div>

        {/* Market Verdict Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border-2 p-4 md:p-6 mb-4 md:mb-6 text-center"
          style={{
            borderColor: `${verdict.color}40`,
            backgroundColor: `${verdict.color}10`,
            boxShadow: `0 0 30px ${verdict.color}20`,
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          >
            <p
              className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2"
              style={{ color: verdict.color, textShadow: `0 0 20px ${verdict.color}` }}
            >
              {verdict.label}
            </p>
            <p className="text-white/70 text-sm md:text-lg">{verdict.description}</p>
          </motion.div>
        </motion.div>

        {/* Final Price */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface border border-border rounded-xl p-4 md:p-5 mb-4 md:mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 font-mono text-[9px] md:text-xs uppercase tracking-wider mb-1">
                EXLS · Final Price
              </p>
              <p className="text-white font-mono text-2xl md:text-3xl lg:text-4xl font-bold">
                ${stockState.price.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-mono text-lg md:text-xl lg:text-2xl font-bold ${isPositive ? 'text-ticker-gain' : 'text-ticker-loss'}`}>
                {isPositive ? '+' : ''}{netChangePercent.toFixed(1)}%
              </p>
              <p className="text-white/50 font-mono text-xs md:text-sm">
                ({isPositive ? '+' : ''}${netChange.toFixed(2)})
              </p>
            </div>
          </div>
        </motion.div>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6"
        >
          {(() => {
            const gains = choiceRecords.filter(r => r.tickerResult.type === 'gain').length;
            const losses = choiceRecords.filter(r => r.tickerResult.type === 'loss').length;
            const volatile = choiceRecords.filter(r => r.tickerResult.type === 'volatile').length;
            return (
              <>
                <div className="bg-ticker-gain/10 border border-ticker-gain/30 rounded-lg p-2 md:p-3 text-center">
                  <p className="text-ticker-gain font-mono text-xl md:text-2xl font-bold">{gains}</p>
                  <p className="text-white/50 text-[9px] md:text-xs font-mono uppercase">Gains</p>
                </div>
                <div className="bg-ticker-loss/10 border border-ticker-loss/30 rounded-lg p-2 md:p-3 text-center">
                  <p className="text-ticker-loss font-mono text-xl md:text-2xl font-bold">{losses}</p>
                  <p className="text-white/50 text-[9px] md:text-xs font-mono uppercase">Losses</p>
                </div>
                <div className="bg-ticker-volatile/10 border border-ticker-volatile/30 rounded-lg p-2 md:p-3 text-center">
                  <p className="text-ticker-volatile font-mono text-xl md:text-2xl font-bold">{volatile}</p>
                  <p className="text-white/50 text-[9px] md:text-xs font-mono uppercase">Volatile</p>
                </div>
              </>
            );
          })()}
        </motion.div>

        {/* Path Recap */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-surface border border-border rounded-xl p-3 md:p-5 mb-4 md:mb-6"
        >
          <p className="text-white/50 font-mono text-[9px] md:text-xs uppercase tracking-wider mb-3">
            Your Strategic Path
          </p>
          
          <div className="space-y-2 md:space-y-3">
            {choiceRecords.map((record, index) => {
              const level = LEVELS[index];
              const tickerColors = {
                gain: { text: 'text-ticker-gain', bg: 'bg-ticker-gain/10', border: 'border-ticker-gain/30', icon: '▲' },
                loss: { text: 'text-ticker-loss', bg: 'bg-ticker-loss/10', border: 'border-ticker-loss/30', icon: '▼' },
                volatile: { text: 'text-ticker-volatile', bg: 'bg-ticker-volatile/10', border: 'border-ticker-volatile/30', icon: '◆' },
              };
              const tc = tickerColors[record.tickerResult.type];

              return (
                <motion.div
                  key={record.level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`p-3 md:p-4 rounded-lg border ${tc.bg} ${tc.border}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-sm ${tc.text}`}>{tc.icon}</span>
                        <p className="text-white font-semibold text-sm md:text-base">
                          Level {level.id}: {level.title}
                        </p>
                      </div>
                      <p className="text-white/70 text-xs md:text-sm">
                        You chose: <span className={`font-semibold ${tc.text}`}>{record.choiceLabel}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className={`font-mono text-base md:text-lg font-bold ${tc.text}`}>
                        {record.tickerResult.percent >= 0 ? '+' : ''}{record.tickerResult.percent.toFixed(1)}%
                      </p>
                      <p className="text-white/50 text-[10px] md:text-xs font-mono">
                        {record.tickerResult.label}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/50 text-[10px] md:text-xs font-mono italic border-t border-white/10 pt-2 mt-2">
                    "{record.tickerResult.analystNote}"
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-exl-orange/10 border border-exl-orange/30 rounded-xl p-4 md:p-5 mb-4 md:mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-exl-orange/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-exl-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-exl-orange font-semibold text-sm md:text-base mb-1">Key Takeaway</p>
              <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                {stockState.price >= 130 
                  ? "Your strategic choices demonstrate mastery of AI transformation. You balanced speed with sustainability, embraced calculated risks, and built a foundation for long-term value creation."
                  : stockState.price >= 110
                  ? "Solid strategic thinking with room for bolder moves. You navigated the AI landscape well, though some opportunities for greater impact were left on the table."
                  : stockState.price >= 90
                  ? "A cautious approach that preserved value but limited upside. Consider where calculated risks could have accelerated your transformation journey."
                  : stockState.price >= 70
                  ? "Several strategic missteps impacted your trajectory. The key lesson: AI transformation requires both speed and thoughtful execution—neither alone is sufficient."
                  : "Critical strategic errors compounded over time. Remember: in AI transformation, early decisions create path dependencies that are difficult to reverse."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Restart Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary text-base md:text-lg px-8 md:px-12 py-3 md:py-4"
          >
            Play Again
            <span className="ml-2 md:ml-3">↻</span>
          </motion.button>
          
          <p className="mt-3 md:mt-4 text-white/30 text-[10px] md:text-xs font-mono">
            Can you beat your score?
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
