'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ScoreMeter from './ScoreMeter';
import { Scores, SCORE_METRICS } from '@/lib/gameData';
import { computeEV, formatEV, getRecoveryTier, determineArchetype, isWinningOutcome, Archetype } from '@/lib/archetypes';
import { useConfetti } from '@/lib/useConfetti';

interface ResultScreenProps {
  scores: Scores;
  choices: ('A' | 'B')[];
  archetype: Archetype;
  onReset: () => void;
}

export default function ResultScreen({ scores, choices, archetype, onReset }: ResultScreenProps) {
  const ev = computeEV(scores);
  const tier = getRecoveryTier(ev);
  const isWinner = isWinningOutcome(ev);
  const { fireSuccess } = useConfetti();

  useEffect(() => {
    if (isWinner) {
      const timer = setTimeout(() => fireSuccess(), 800);
      return () => clearTimeout(timer);
    }
  }, [isWinner, fireSuccess]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-3 border-b border-border/30 flex-shrink-0"
      >
        <p className="font-mono text-[9px] text-exl-orange tracking-[0.2em] uppercase mb-0.5">
          Month 18 &middot; Strategy Audit Complete
        </p>
        <h1 className="text-lg font-bold text-white">
          {isWinner ? '\uD83C\uDF89 Transformation Complete' : 'Strategy Analysis Complete'}
        </h1>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-3 md:p-4 space-y-4">
          {/* Enterprise Value Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-6 rounded-2xl border-2 relative overflow-hidden"
            style={{ 
              borderColor: `${tier.color}60`,
              background: `radial-gradient(ellipse at center, ${tier.color}08 0%, transparent 70%)`,
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: tier.color }}>
              {tier.label}
            </p>
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
              className="text-5xl md:text-6xl font-bold font-mono"
              style={{ color: tier.color }}
            >
              {formatEV(ev)}
            </motion.p>
            <p className="text-white/40 text-xs mt-2 font-mono">Enterprise Value Recovered</p>
          </motion.div>

          {/* Choices Path */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-1"
          >
            <span className="text-white/30 text-xs font-mono mr-2">Your Path:</span>
            {choices.map((choice, index) => (
              <span
                key={index}
                className={`font-mono font-bold px-2 py-0.5 rounded text-xs
                  ${choice === 'A' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}
                `}
              >
                {choice}
              </span>
            ))}
          </motion.div>

          {/* Scorecard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider mb-2">Your Scorecard</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {SCORE_METRICS.map((metric, index) => (
                <ScoreMeter
                  key={metric.key}
                  label={metric.name}
                  scoreKey={metric.key}
                  value={scores[metric.key]}
                  delay={0.5 + index * 0.05}
                  compact={true}
                />
              ))}
            </div>
          </motion.div>

          {/* EV Formula Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-surface/50 border border-border rounded-lg p-3"
          >
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider mb-2">EV Formula Breakdown</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-white/50">MV &times; 50</span>
                <span className="text-white/80">{formatEV(scores.MV * 50)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">TR &times; 50</span>
                <span className="text-white/80">{formatEV(scores.TR * 50)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">TL contribution</span>
                <span className={scores.TL < 0 ? 'text-red-400' : 'text-white/80'}>
                  {scores.TL < 0 ? '-$500M penalty' : formatEV(scores.TL * 25)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">OR penalty</span>
                <span className={scores.OR > 35 ? 'text-red-400' : 'text-green-400'}>
                  {scores.OR > 35 ? `-${formatEV(Math.max(0, scores.OR - 35) * 80)}` : 'None'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Archetype Result */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-surface border border-border rounded-xl p-4"
            style={{ borderColor: `${archetype.color}40` }}
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${archetype.color}20` }}
              >
                {archetype.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider">Your Leadership Profile</p>
                <h3 className="text-white font-bold text-lg leading-tight">{archetype.name}</h3>
                <p className="text-white/50 text-xs">{archetype.subtitle}</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <p className="text-white/70 text-xs leading-relaxed">{archetype.diagnosis}</p>
              <p className="text-white/50 text-xs leading-relaxed">{archetype.impact}</p>
              <p className="text-white/40 text-xs leading-relaxed italic">{archetype.reality}</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 pt-2 pb-4"
          >
            <button onClick={onReset} className="btn-primary text-sm py-2 px-4">
              Play Again
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
