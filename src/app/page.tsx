'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Target, Clock, HeartPulse, Users, Wallet, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import RadarChart from '@/components/charts/RadarChart';
import { useEffect, useState } from 'react';
import { getDocuments } from '@/lib/firestoreUtils';
import { cn } from '@/lib/utils';

export default function Home() {
  const { level, xp, xpToNextLevel, skillPoints } = useStore();
  const [questCount, setQuestLogCount] = useState(0);

  useEffect(() => {
    getDocuments('quests').then(data => {
      setQuestLogCount(data.filter((q: any) => !q.completed).length);
    });
  }, []);

  const stats = [
    { label: 'Active Quests', value: questCount.toString(), icon: Target, color: 'text-accent-purple', href: '/quests' },
    { label: 'Level', value: level.toString(), icon: Zap, color: 'text-yellow-500', href: '/combat' },
    { label: 'Skill Points', value: Object.values(skillPoints).reduce((a, b) => a + b, 0).toString(), icon: Clock, color: 'text-accent-blue', href: '/profile' },
    { label: 'Health Opt', value: 'Active', icon: HeartPulse, color: 'text-accent-green', href: '/health' },
    { label: 'Savings', value: '$2.4k', icon: Wallet, color: 'text-emerald-500', href: '/finance' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 max-w-7xl mx-auto"
    >
      <header className="mb-12 flex justify-between items-end">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black mb-2 tracking-tighter"
          >
            SYSTEM_ACCESS: <span className="text-brand-primary uppercase">Player One</span>
          </motion.h2>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Neural link stable • All systems nominal</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Global XP</div>
          <div className="text-2xl font-black text-zinc-100">{xp.toLocaleString()} <span className="text-xs text-zinc-600 font-normal">/ {xpToNextLevel.toLocaleString()}</span></div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {stats.map((stat, i) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="glass-card glass-card-hover p-6 rounded-3xl border-white/[0.05] group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] -rotate-45 translate-x-8 -translate-y-8 group-hover:bg-brand-primary/10 transition-colors" />
              <stat.icon className={cn("w-6 h-6 mb-4 relative z-10 transition-colors duration-300", stat.label === 'Active Quests' ? 'text-accent-purple' : stat.label === 'Level' ? 'text-brand-primary' : stat.color)} />
              <div className="text-2xl font-black mb-1 relative z-10 group-hover:text-brand-primary transition-colors">{stat.value}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between relative z-10">
                {stat.label}
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="glass-card p-8 rounded-[32px] border-white/[0.05] relative overflow-hidden h-full"
          >
             <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">LIFE_RADAR.LOG</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Skill distribution analysis</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>
             </div>
             
             <div className="flex justify-center items-center py-8 relative z-10">
                <RadarChart data={skillPoints} maxValue={Math.max(...Object.values(skillPoints), 5)} size={300} />
             </div>

             {/* Mesh Gradient Blur */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/10 blur-[100px] pointer-events-none" />
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="glass-card p-8 rounded-[32px] border-white/[0.05]"
          >
            <h3 className="text-xl font-bold mb-8 tracking-tight">LEVEL_PROG.SYS</h3>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-48 h-48 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    className="text-white/[0.02]"
                  />
                  <motion.circle
                    initial={{ strokeDashoffset: 553 }}
                    animate={{ strokeDashoffset: 553 - (553 * (xp / xpToNextLevel)) }}
                    transition={{ duration: 2, ease: "circOut", delay: 1.2 }}
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={553}
                    className="text-brand-primary drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500 mb-1">Level</span>
                  <span className="text-5xl font-black tracking-tighter">{level}</span>
                </div>
              </div>
              <div className="text-center w-full">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 px-2">
                  <span>Efficiency</span>
                  <span>{Math.round((xp / xpToNextLevel) * 100)}%</span>
                </div>
                <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(xp / xpToNextLevel) * 100}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 1.5 }}
                    className="h-full bg-brand-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  />
                </div>
                <div className="text-[9px] font-mono text-zinc-600 mt-4 uppercase tracking-[0.2em]">
                  {xpToNextLevel - xp} XP to next evolution
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="glass-card p-6 rounded-3xl border-brand-primary/10 bg-brand-primary/[0.02]"
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3 fill-brand-primary/20" />
              Recent Uplink
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              System efficiency increased by <span className="text-zinc-100 font-bold">12.4%</span> since last cycle. Combat readiness at maximum.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

