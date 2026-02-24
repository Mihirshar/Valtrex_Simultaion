'use client';

import { motion } from 'framer-motion';
import { ScoreKey, ScoreStatus, getScoreTarget, getScoreStatus, getScoreRange } from '@/lib/gameData';

interface ScoreMeterProps {
  label: string;
  scoreKey: ScoreKey;
  value: number;
  delay?: number;
  compact?: boolean;
}

const STATUS_CONFIG: Record<ScoreStatus, { bg: string; fill: string; border: string; text: string; label: string; glow: string }> = {
  met: {
    bg: 'bg-green-500/10',
    fill: 'from-green-600 to-green-400',
    border: 'border-green-500/30',
    text: 'text-green-400',
    label: 'MET',
    glow: 'rgba(34, 197, 94, 0.4)',
  },
  target: {
    bg: 'bg-yellow-500/10',
    fill: 'from-yellow-600 to-yellow-400',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    label: 'TARGET',
    glow: 'rgba(234, 179, 8, 0.4)',
  },
  missed: {
    bg: 'bg-red-500/10',
    fill: 'from-red-600 to-red-400',
    border: 'border-red-500/30',
    text: 'text-red-400',
    label: 'MISSED',
    glow: 'rgba(239, 68, 68, 0.4)',
  },
};

export default function ScoreMeter({
  label,
  scoreKey,
  value,
  delay = 0,
  compact = false,
}: ScoreMeterProps) {
  const status = getScoreStatus(scoreKey, value);
  const config = STATUS_CONFIG[status];
  const target = getScoreTarget(scoreKey);
  const range = getScoreRange(scoreKey);
  const isRiskMetric = scoreKey === 'OR';
  
  const normalizedValue = Math.min(Math.max(value, range.min), range.max);
  const rangeSpan = range.max - range.min;
  const displayPercentage = ((normalizedValue - range.min) / rangeSpan) * 100;
  const targetPercentage = ((target - range.min) / rangeSpan) * 100;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className={`rounded-lg p-3 border ${config.bg} ${config.border} overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`font-mono text-xs font-bold ${config.text} flex-shrink-0`}>{scoreKey}</span>
            <span className="text-white/20 text-xs flex-shrink-0">|</span>
            <span className="text-[10px] text-white/50 truncate">{label}</span>
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring' }}
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${config.bg} ${config.text} border ${config.border} flex-shrink-0`}
          >
            {config.label}
          </motion.span>
        </div>

        <div className="relative h-2 bg-surface rounded-full overflow-hidden border border-border/50">
          {isRiskMetric ? (
            <div className="absolute top-0 bottom-0 left-0 bg-green-500/10" style={{ width: `${targetPercentage}%` }} />
          ) : (
            <div className="absolute top-0 bottom-0 right-0 bg-green-500/10" style={{ width: `${100 - targetPercentage}%` }} />
          )}

          <motion.div
            initial={{ width: `${((0 - range.min) / rangeSpan) * 100}%` }}
            animate={{ width: `${displayPercentage}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${config.fill}`}
            style={{ boxShadow: `0 0 8px ${config.glow}` }}
          />

          <div 
            className="absolute top-0 h-full w-0.5 bg-white/40"
            style={{ left: `${targetPercentage}%` }}
          />
          
          <motion.div
            initial={{ left: `${((0 - range.min) / rangeSpan) * 100}%` }}
            animate={{ left: `${displayPercentage}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-background z-10"
            style={{ 
              backgroundColor: status === 'met' ? '#22c55e' : status === 'target' ? '#eab308' : '#ef4444',
              boxShadow: `0 0 6px ${config.glow}`,
            }}
          />
        </div>

        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] font-mono text-white/30">{range.min}</span>
          <motion.span
            key={value}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-mono font-bold text-sm ${config.text}`}
          >
            {value > 0 ? '+' : ''}{value}
          </motion.span>
          <span className="text-[9px] font-mono text-white/30">+{range.max}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`rounded-xl p-4 border ${config.bg} ${config.border}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm font-semibold ${config.text}`}>{scoreKey}</span>
          <span className="text-white/30">|</span>
          <span className="text-xs text-white/60">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            key={value}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring' }}
            className={`font-mono font-bold text-base ${config.text}`}
          >
            {value > 0 ? '+' : ''}{value}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5, type: 'spring' }}
            className={`text-[10px] font-mono px-2 py-0.5 rounded ${config.bg} ${config.text} border ${config.border}`}
          >
            {config.label}
          </motion.span>
        </div>
      </div>

      <div className="relative h-2.5 bg-surface rounded-full overflow-hidden border border-border">
        {isRiskMetric ? (
          <div className="absolute top-0 bottom-0 left-0 bg-green-500/10" style={{ width: `${targetPercentage}%` }} />
        ) : (
          <div className="absolute top-0 bottom-0 right-0 bg-green-500/10" style={{ width: `${100 - targetPercentage}%` }} />
        )}

        <motion.div
          initial={{ width: `${((0 - range.min) / rangeSpan) * 100}%` }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ delay: delay + 0.3, duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${config.fill}`}
          style={{ boxShadow: `0 0 10px ${config.glow}` }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          className="absolute top-0 h-full w-0.5 bg-white/60 z-10"
          style={{ left: `${targetPercentage}%` }}
        />

        <motion.div
          initial={{ left: `${((0 - range.min) / rangeSpan) * 100}%` }}
          animate={{ left: `${displayPercentage}%` }}
          transition={{ delay: delay + 0.3, duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background z-20"
          style={{ 
            backgroundColor: status === 'met' ? '#22c55e' : status === 'target' ? '#eab308' : '#ef4444',
            boxShadow: `0 0 10px ${config.glow}`,
          }}
        />
      </div>

      <div className="flex justify-between mt-1.5 text-[10px] font-mono text-white/30">
        <span>{range.min}</span>
        <span className={config.text}>
          {isRiskMetric ? `< ${target}` : `> ${target}`}
        </span>
        <span>+{range.max}</span>
      </div>
    </motion.div>
  );
}
