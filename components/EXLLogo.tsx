'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface EXLLogoProps {
  size?: 'sm' | 'md' | 'lg';
  withGlow?: boolean;
}

export default function EXLLogo({ size = 'md', withGlow = true }: EXLLogoProps) {
  const sizeMap = {
    sm: { width: 60, height: 24 },
    md: { width: 80, height: 32 },
    lg: { width: 120, height: 48 },
  };

  const { width, height } = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`
        inline-flex items-center justify-center
        ${withGlow ? 'drop-shadow-[0_0_25px_rgba(242,101,34,0.5)]' : ''}
      `}
    >
      <Image
        src="/exl-logo.png"
        alt="EXL"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </motion.div>
  );
}
