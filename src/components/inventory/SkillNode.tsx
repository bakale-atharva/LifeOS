'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface SkillNodeProps {
  name: string;
  level: number;
  xp: number;
  bonus?: number;
  onClick: () => void;
}

export default function SkillNode({ name, level, xp, bonus, onClick }: SkillNodeProps) {
  const nextLevelXP = level * 1000;
  const progress = (xp / nextLevelXP) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center cursor-pointer group"
    >
      <div className="relative w-32 h-32">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-zinc-900"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-accent-purple"
          />
        </svg>

        {/* Level Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-zinc-100">{level}</span>
          <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Level</span>
        </div>

        {/* Synergy Glow */}
        {bonus && bonus > 0 && (
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full border border-accent-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          />
        )}
      </div>

      <div className="mt-4 text-center">
        <h4 className="font-bold text-sm text-zinc-100 group-hover:text-accent-purple transition-colors uppercase tracking-wider">{name}</h4>
        {bonus && bonus > 0 && (
          <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-accent-green font-bold">
            <Sparkles className="w-3 h-3" />
            +{bonus}% XP BOOST
          </div>
        )}
      </div>
    </motion.div>
  );
}
