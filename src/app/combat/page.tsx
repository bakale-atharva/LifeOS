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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-6xl mx-auto h-full flex flex-col overflow-hidden"
    >
      <header className="mb-12 shrink-0">
        <h2 className="text-4xl font-black flex items-center gap-4 text-zinc-100 tracking-tighter">
          <Zap className="text-brand-primary w-10 h-10 fill-brand-primary/20" />
          COMBAT_ARENA.EXE
        </h2>
        <p className="text-zinc-500 mt-2 font-mono text-[10px] tracking-[0.3em] uppercase">Target lock engaged • System integration active</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Boss Visual Area */}
        <div className="lg:col-span-2 flex flex-col gap-8 min-h-[400px]">
          <div className="glass-card flex-1 rounded-[32px] border-white/[0.05] flex flex-col items-center justify-center p-12 relative overflow-hidden shadow-2xl">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="w-48 h-48 rounded-full bg-brand-primary/5 border border-brand-primary/20 flex items-center justify-center relative">
                <Skull className="w-24 h-24 text-brand-primary drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]" />
                
                {/* Orbital Rings */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-brand-primary/20 rounded-full scale-150" 
                />
              </div>
            </motion.div>

            <div className="mt-16 text-center relative z-10 w-full max-w-md">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary">Target: {combatState.bossName}</span>
                <span className="text-[10px] font-mono text-zinc-500">{Math.round(combatState.bossHP)} / {combatState.bossMaxHP} HP</span>
              </div>
              
              {/* HP Bar */}
              <div className="h-2 bg-white/[0.02] rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${hpPercentage}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    hpPercentage > 50 ? "bg-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]" :
                    hpPercentage > 20 ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" :
                    "bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Battle Log Area */}
        <div className="glass-card rounded-[32px] border-white/[0.05] flex flex-col min-h-0">
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between shrink-0">
            <h3 className="text-[10px] font-bold flex items-center gap-3 uppercase tracking-[0.2em] text-zinc-300">
              <Terminal className="w-4 h-4 text-brand-primary" />
              BATTLE_LOG
            </h3>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 cyber-scrollbar font-mono text-[11px]"
          >
            <AnimatePresence mode="popLayout">
              {combatState.battleLog.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "p-4 rounded-2xl border leading-relaxed relative overflow-hidden",
                    log.type === 'player' ? "bg-brand-primary/[0.03] border-brand-primary/10 text-brand-primary" :
                    log.type === 'boss' ? "bg-white/[0.02] border-white/[0.05] text-zinc-100" :
                    "bg-zinc-950/50 border-white/[0.02] text-zinc-500 italic"
                  )}
                >
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-40 block mb-1.5">
                    {log.type === 'player' ? '>> PLAYER_ACTION' : log.type === 'boss' ? '>> AI_NARRATOR' : '>> SYSTEM'}
                  </span>
                  {log.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-white/[0.05] shrink-0">
            <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Real-time Passive Uplink Active
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
