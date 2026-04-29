'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { HeartPulse, Moon, Droplets, Dumbbell, Plus, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function HealthOSPage() {
  const [sleep, setSleep] = useState(7);
  const [water, setWater] = useState(0);
  const [exercise, setExercise] = useState(0);
  const addXP = useStore(state => state.addXP);

  const handleWaterClick = () => {
    setWater(prev => prev + 1);
    addXP(10);
  };

  const handleExerciseAdd = () => {
    setExercise(prev => prev + 15);
    addXP(50);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <HeartPulse className="text-accent-green w-8 h-8" />
          Health OS
        </h2>
        <p className="text-zinc-400 mt-1">Optimize your biological machine</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sleep Tracker */}
        <div className="glass-card p-8 rounded-3xl border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <Moon className="text-accent-purple w-6 h-6" />
            <span className="text-xs font-bold uppercase text-zinc-500">Sleep Tracking</span>
          </div>
          <div className="text-center mb-8">
            <input 
              type="number" 
              step="0.1"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value) || 0)}
              className="text-5xl font-black text-zinc-100 mb-2 bg-transparent border-b-2 border-zinc-800 w-32 text-center focus:outline-none focus:border-accent-purple transition-colors"
            />
            <div className="text-sm text-zinc-400 mt-2">Hours rested last night</div>
          </div>
          <button 
            onClick={() => {
              addXP(Math.round(sleep * 10));
              alert(`Logged ${sleep}h of sleep! +${Math.round(sleep * 10)} XP`);
            }}
            className="w-full py-3 rounded-xl bg-accent-purple text-white font-bold shadow-lg shadow-accent-purple/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Log Sleep Entry
          </button>
        </div>

        {/* Hydration Tracker */}
        <div className="glass-card p-8 rounded-3xl border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <Droplets className="text-accent-blue w-6 h-6" />
            <span className="text-xs font-bold uppercase text-zinc-500">Hydration</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-8 h-24">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  "w-8 h-10 rounded-lg flex items-center justify-center border-2 transition-all",
                  i < water 
                    ? "bg-accent-blue/20 border-accent-blue text-accent-blue" 
                    : "border-zinc-800 text-zinc-800"
                )}
              >
                <Droplets className="w-4 h-4" />
              </motion.div>
            ))}
          </div>
          <button 
            onClick={handleWaterClick}
            className="w-full py-4 rounded-2xl bg-accent-blue text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent-blue/20 transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Glass (+10 XP)
          </button>
        </div>

        {/* Exercise Tracker */}
        <div className="glass-card p-8 rounded-3xl border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <Dumbbell className="text-accent-green w-6 h-6" />
            <span className="text-xs font-bold uppercase text-zinc-500">Movement</span>
          </div>
          <div className="text-center mb-8">
            <div className="text-5xl font-black text-zinc-100 mb-2">{exercise}m</div>
            <div className="text-sm text-zinc-400">Activity today</div>
          </div>
          <div className="space-y-3">
            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent-green"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (exercise / 60) * 100)}%` }}
              />
            </div>
            <button 
              onClick={handleExerciseAdd}
              className="w-full py-4 rounded-2xl bg-accent-green text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent-green/20 transition-transform active:scale-95"
            >
              <Flame className="w-5 h-5" />
              Add 15m (+50 XP)
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 glass-card p-8 rounded-3xl border-zinc-800">
        <h3 className="text-xl font-bold mb-6">Weekly Vitals</h3>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center">
              <div className="text-xs text-zinc-500 mb-2">{day}</div>
              <div className="h-24 bg-zinc-950 rounded-xl border border-zinc-800 relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-accent-green/20 border-t border-accent-green"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
