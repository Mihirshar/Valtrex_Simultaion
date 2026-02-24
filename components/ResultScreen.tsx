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
                gain: { text: 'text-ticker-gain', icon: '🟢' },
                loss: { text: 'text-ticker-loss', icon: '🔴' },
                volatile: { text: 'text-ticker-volatile', icon: '🟡' },
              };
              const tc = tickerColors[record.tickerResult.type];

              return (
                <motion.div
                  key={record.level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-2 md:p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <span className="text-sm md:text-lg flex-shrink-0">{tc.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-xs md:text-sm truncate">
                        L{level.id}: {level.title}
                      </p>
                      <p className="text-white/50 text-[10px] md:text-xs font-mono truncate">
                        {record.choiceLabel}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className={`font-mono text-xs md:text-sm font-bold ${tc.text}`}>
                      {record.tickerResult.percent >= 0 ? '+' : ''}{record.tickerResult.percent.toFixed(1)}%
                    </p>
                    <p className="text-white/40 text-[9px] md:text-xs font-mono">
                      {record.tickerResult.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
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
