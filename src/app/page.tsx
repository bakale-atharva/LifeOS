'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Target, Clock, HeartPulse, Users, Wallet, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Active Goals', value: '3', icon: Target, color: 'text-accent-purple', href: '/gps' },
  { label: 'Today\'s Focus', value: '4h 20m', icon: Clock, color: 'text-accent-blue', href: '/time' },
  { label: 'Health Score', value: '85', icon: HeartPulse, color: 'text-accent-green', href: '/health' },
  { label: 'Network', value: '12', icon: Users, color: 'text-orange-500', href: '/relationships' },
  { label: 'Savings', value: '$2,400', icon: Wallet, color: 'text-emerald-500', href: '/finance' },
];

export default function Home() {
  const { level, xp } = useStore();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black mb-2"
        >
          Welcome back, <span className="text-accent-purple">Player One</span>
        </motion.h2>
        <p className="text-zinc-400">Your systems are operational. Ready to level up today?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {stats.map((stat, i) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl border-zinc-800 hover:border-zinc-700 transition-all group cursor-pointer"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-zinc-500 text-sm flex items-center justify-between">
                {stat.label}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border-zinc-800">
          <h3 className="text-xl font-bold mb-6">Quest Log</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="w-12 h-12 rounded-lg bg-accent-purple/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent-purple" />
                </div>
                <div>
                  <div className="font-bold">Complete Daily Reading</div>
                  <div className="text-xs text-zinc-500">25 XP reward</div>
                </div>
                <button className="ml-auto px-4 py-2 rounded-lg bg-zinc-900 text-xs font-bold border border-zinc-800 hover:border-accent-purple transition-colors">
                  Claim
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border-zinc-800">
          <h3 className="text-xl font-bold mb-6">Level Progression</h3>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-zinc-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * (xp / (level * 1000)))}
                  className="text-accent-purple"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{level}</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">Level</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium mb-1">{xp} / {level * 1000} XP</div>
              <div className="text-xs text-zinc-500">{(level * 1000) - xp} XP to next level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
