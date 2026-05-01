'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Target, Clock, HeartPulse, Users, Wallet, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import RadarChart from '@/components/charts/RadarChart';
import { useEffect, useState } from 'react';
import { getDocuments } from '@/lib/firestoreUtils';

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
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black mb-2 italic tracking-tighter"
          >
            SYSTEM_ACCESS: <span className="text-accent-purple uppercase">Player One</span>
          </motion.h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">Neural link stable • All systems nominal</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Global XP</div>
          <div className="text-2xl font-black text-zinc-100">{xp.toLocaleString()} <span className="text-xs text-zinc-600">/ {xpToNextLevel.toLocaleString()}</span></div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {stats.map((stat, i) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl border-zinc-800 hover:border-accent-purple/30 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 -rotate-45 translate-x-8 -translate-y-8 group-hover:bg-accent-purple/10 transition-colors" />
              <stat.icon className={`w-6 h-6 ${stat.color} mb-4 relative z-10`} />
              <div className="text-2xl font-black mb-1 relative z-10">{stat.value}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between relative z-10">
                {stat.label}
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-3xl border-zinc-800 relative overflow-hidden h-full">
             <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-xl font-bold italic tracking-tight">LIFE_RADAR.LOG</h3>
                  <p className="text-xs text-zinc-500 font-mono">Skill distribution analysis</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>
             </div>
             
             <div className="flex justify-center items-center py-8">
                <RadarChart data={skillPoints} maxValue={Math.max(...Object.values(skillPoints), 5)} size={300} />
             </div>

             {/* Grid Overlay */}
             <div className="absolute inset-0 opacity-5 pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border-zinc-800">
            <h3 className="text-xl font-bold mb-8 italic">LEVEL_PROG.SYS</h3>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-48 h-48 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-zinc-900"
                  />
                  <motion.circle
                    initial={{ strokeDashoffset: 553 }}
                    animate={{ strokeDashoffset: 553 - (553 * (xp / xpToNextLevel)) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={553}
                    className="text-accent-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500 mb-1">Level</span>
                  <span className="text-5xl font-black italic tracking-tighter">{level}</span>
                </div>
              </div>
              <div className="text-center w-full">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 px-2">
                  <span>Progress</span>
                  <span>{Math.round((xp / xpToNextLevel) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(xp / xpToNextLevel) * 100}%` }}
                    className="h-full bg-accent-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                  />
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-3 uppercase">
                  {xpToNextLevel - xp} XP to next evolution
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border-zinc-800 bg-accent-purple/5 border-accent-purple/20">
            <h4 className="text-xs font-black uppercase tracking-widest text-accent-purple mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              Recent Uplink
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              System efficiency increased by <span className="text-zinc-100">12.4%</span> since last cycle. Combat readiness at maximum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

