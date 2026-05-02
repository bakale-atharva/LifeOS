'use client';

import { useStore } from '@/store/useStore';
import { Trophy, Flame, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TopBar() {
  const { xp, level, xpToNextLevel, streak, displayName, profileImage } = useStore();
  const progress = (xp / xpToNextLevel) * 100;

  return (
    <div className="h-16 border-b border-white/[0.05] bg-[#0B0B0B]/60 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/">
          <h1 className="text-xl font-black bg-gradient-to-r from-brand-primary to-accent-purple bg-clip-text text-transparent cursor-pointer tracking-tighter">
            LIFEOS
          </h1>
        </Link>
        
        {/* Streak & XP Vitals */}
        <div className="hidden md:flex items-center gap-4 border-l border-white/[0.05] pl-6">
          <div className="flex items-center gap-2 text-orange-500">
            <Flame className="w-4 h-4 fill-orange-500/20" />
            <span className="text-xs font-black">{streak}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-primary">
            <Zap className="w-4 h-4 fill-brand-primary/20" />
            <span className="text-xs font-black">{xp} XP</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Level Progress */}
        <div className="hidden lg:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Trophy className="w-3 h-3 text-brand-primary" />
            <span>Tier {level} Agent</span>
          </div>
          <div className="w-32 h-1 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-primary shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* User Identity Section */}
        <Link href="/profile">
          <div className="flex items-center gap-3 pl-6 border-l border-white/[0.05] group cursor-pointer">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-zinc-100 group-hover:text-brand-primary transition-colors">{displayName}</span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Profile</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.05] flex items-center justify-center overflow-hidden group-hover:border-brand-primary/50 group-hover:bg-brand-primary/5 transition-all shadow-lg">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-zinc-500 group-hover:text-brand-primary transition-colors" />
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
