'use client';

import { useStore } from '@/store/useStore';
import { Trophy, Flame, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TopBar() {
  const { xp, level, streak, displayName, profileImage } = useStore();
  const nextLevelXP = level * 1000;
  const progress = (xp / nextLevelXP) * 100;

  return (
    <div className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/">
          <h1 className="text-xl font-black bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent cursor-pointer">
            LIFEOS
          </h1>
        </Link>
        
        {/* Streak & XP Vitals */}
        <div className="hidden md:flex items-center gap-4 border-l border-zinc-800 pl-6">
          <div className="flex items-center gap-2 text-orange-500">
            <Flame className="w-4 h-4 fill-orange-500/20" />
            <span className="text-xs font-black">{streak}</span>
          </div>
          <div className="flex items-center gap-2 text-accent-green">
            <Zap className="w-4 h-4 fill-accent-green/20" />
            <span className="text-xs font-black">{xp} XP</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Level Progress */}
        <div className="hidden lg:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Trophy className="w-3 h-3 text-accent-purple" />
            <span>Tier {level} Agent</span>
          </div>
          <div className="w-32 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <motion.div 
              className="h-full bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* User Identity Section */}
        <Link href="/profile">
          <div className="flex items-center gap-3 pl-6 border-l border-zinc-800 group cursor-pointer">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-zinc-100 group-hover:text-accent-purple transition-colors">{displayName}</span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">View Profile</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden group-hover:border-accent-purple transition-all shadow-lg">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-zinc-700" />
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
