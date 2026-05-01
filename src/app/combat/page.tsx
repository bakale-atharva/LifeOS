'use client';

import { useStore } from '@/store/useStore';
import { Zap, ShieldAlert, History, Skull, Swords, Flame, Sparkles, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export default function CombatArenaPage() {
  const { combatState } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll battle log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [combatState.battleLog]);

  const hpPercentage = (combatState.bossHP / combatState.bossMaxHP) * 100;

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col bg-zinc-950 text-zinc-50 overflow-hidden">
      <header className="mb-12 shrink-0">
        <h2 className="text-4xl font-black flex items-center gap-4 text-zinc-100 italic tracking-tighter font-heading">
          <Zap className="text-accent-blue w-10 h-10 fill-accent-blue/20" />
          COMBAT_ARENA.EXE
        </h2>
        <p className="text-zinc-500 mt-2 font-mono text-sm tracking-widest uppercase">Target lock engaged • System integration active</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Boss Visual Area */}
        <div className="lg:col-span-2 flex flex-col gap-8 min-h-[400px]">
          <div className="glass-card flex-1 rounded-3xl border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center p-12 relative overflow-hidden shadow-2xl">
            {/* Background Grid/Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="relative z-10"
            >
              <div className="w-48 h-48 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center relative">
                <Skull className="w-24 h-24 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                
                {/* Orbital Rings */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-red-500/20 rounded-full scale-150" 
                />
              </div>
            </motion.div>

            <div className="mt-12 text-center relative z-10 w-full max-w-md">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-red-500 italic">Target: {combatState.bossName}</span>
                <span className="text-xs font-mono text-zinc-500">{Math.round(combatState.bossHP)} / {combatState.bossMaxHP} HP</span>
              </div>
              
              {/* HP Bar */}
              <div className="h-4 bg-zinc-950 rounded-full border border-zinc-800 p-0.5 overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${hpPercentage}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    hpPercentage > 50 ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" :
                    hpPercentage > 20 ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" :
                    "bg-red-700 animate-pulse shadow-[0_0_20px_rgba(185,28,28,0.8)]"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Battle Log Area */}
        <div className="glass-card rounded-3xl border-zinc-800 bg-zinc-950 flex flex-col min-h-0">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <h3 className="text-sm font-black flex items-center gap-3 uppercase tracking-widest text-zinc-300 italic">
              <Terminal className="w-4 h-4 text-accent-blue" />
              BATTLE_LOG
            </h3>
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide font-mono text-sm"
          >
            <AnimatePresence mode="popLayout">
              {combatState.battleLog.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "p-3 rounded-xl border leading-relaxed relative overflow-hidden",
                    log.type === 'player' ? "bg-accent-blue/5 border-accent-blue/20 text-accent-blue" :
                    log.type === 'boss' ? "bg-red-500/5 border-red-500/20 text-zinc-100" :
                    "bg-zinc-900 border-zinc-800 text-zinc-500 italic"
                  )}
                >
                  <span className="text-[10px] font-black uppercase opacity-50 block mb-1">
                    {log.type === 'player' ? '>> PLAYER_ACTION' : log.type === 'boss' ? '>> AI_NARRATOR' : '>> SYSTEM'}
                  </span>
                  {log.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-zinc-800 shrink-0">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Real-time Passive Uplink Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
