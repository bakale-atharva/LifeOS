'use client';

import { useStore } from '@/store/useStore';
import { Trophy, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar() {
  const { xp, level, streak } = useStore();
  const nextLevelXP = level * 1000;
  const progress = (xp / nextLevelXP) * 100;

  return (
    <div className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
          LifeOS
        </h1>
      </div>

      <div className="flex items-center gap-8">
        {/* Level & XP Bar */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Trophy className="w-4 h-4 text-accent-purple" />
            <span>Level {level}</span>
          </div>
          <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <motion.div 
              className="h-full bg-gradient-to-r from-accent-purple to-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 shadow-lg">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
          <span className="font-bold text-orange-500">{streak}</span>
        </div>

        {/* Total XP */}
        <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 shadow-lg text-accent-green">
          <Zap className="w-5 h-5 fill-accent-green/20" />
          <span className="font-bold">{xp} XP</span>
        </div>
      </div>
    </div>
  );
}
