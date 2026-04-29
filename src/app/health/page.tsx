'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { HeartPulse, Moon, Droplets, Dumbbell, Plus, Flame, Loader2, Sparkles, X, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDocument, getDocuments, updateDocument } from '@/lib/firestoreUtils';

interface HealthData {
  id?: string;
  sleep: number;
  water: number;
  exercise: number;
  weight: number;
  lastUpdated: string; // Format: "M/D/YYYY" or similar from toLocaleDateString()
  timestamp?: any;
}

interface Toast {
  id: string;
  message: string;
  xp?: number;
}

export default function HealthOSPage() {
  const [healthData, setHealthData] = useState<HealthData>({ sleep: 7, water: 0, exercise: 0, weight: 70, lastUpdated: new Date().toLocaleDateString() });
  const [weeklyHistory, setWeeklyHistory] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addXP = useStore(state => state.addXP);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const data = await getDocuments('health') as HealthData[];
      const today = new Date().toLocaleDateString();
      
      // Sort data for weekly vitals
      const sortedData = data.sort((a, b) => {
        return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      });
      setWeeklyHistory(sortedData.slice(-7));

      const todayData = data.find(d => d.lastUpdated === today);
      
      if (todayData) {
        setHealthData(todayData);
      } else {
        const newRecord = { sleep: 0, water: 0, exercise: 0, weight: todayData ? todayData.weight : 70, lastUpdated: today };
        const docRef = await addDocument('health', newRecord);
        setHealthData({ ...newRecord, id: docRef.id });
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, xp?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, xp }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const updateHealth = async (updates: Partial<HealthData>, xpReward: number, message: string) => {
    const newData = { ...healthData, ...updates };
    setHealthData(newData);
    
    if (xpReward > 0) {
      addXP(xpReward);
      showToast(message, xpReward);
    }

    try {
      if (healthData.id) {
        await updateDocument('health', healthData.id, updates);
      }
    } catch (error) {
      console.error("Error syncing health data:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent-green animate-spin" />
      </div>
    );
  }

  // Calculate day scores for the graph (simplified)
  const getDayHeight = (data: HealthData) => {
    const sleepScore = (data.sleep / 8) * 33;
    const waterScore = (data.water / 8) * 33;
    const exerciseScore = (data.exercise / 60) * 33;
    return Math.min(100, sleepScore + waterScore + exerciseScore);
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-card px-6 py-4 rounded-2xl border-accent-green/30 bg-zinc-900/90 shadow-2xl flex items-center gap-4 min-w-[300px]"
            >
              <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-zinc-100">{toast.message}</p>
                {toast.xp && <p className="text-xs text-accent-green">+{toast.xp} XP Earned</p>}
              </div>
              <button onClick={() => setToasts(toasts.filter(t => t.id !== toast.id))}>
                <X className="w-4 h-4 text-zinc-500 hover:text-zinc-100" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="mb-12">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <HeartPulse className="text-accent-green w-8 h-8" />
          Health OS
        </h2>
        <p className="text-zinc-400 mt-1">Daily biological optimization • {healthData.lastUpdated}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Sleep Tracker */}
        <div className="glass-card p-6 rounded-3xl border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <Moon className="text-accent-purple w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-zinc-500">Sleep</span>
          </div>
          <div className="text-center mb-6">
            <input 
              type="number" 
              step="0.1"
              value={healthData.sleep}
              onChange={(e) => setHealthData({ ...healthData, sleep: parseFloat(e.target.value) || 0 })}
              className="text-4xl font-black text-zinc-100 mb-1 bg-transparent border-b border-zinc-800 w-24 text-center focus:outline-none focus:border-accent-purple transition-colors"
            />
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Hours</div>
          </div>
          <button 
            onClick={() => updateHealth({ sleep: healthData.sleep }, Math.round(healthData.sleep * 10), `Logged ${healthData.sleep}h sleep`)}
            className="w-full py-2 rounded-xl bg-accent-purple/10 text-accent-purple border border-accent-purple/20 font-bold text-xs hover:bg-accent-purple hover:text-white transition-all"
          >
            Log Entry
          </button>
        </div>

        {/* Hydration Tracker */}
        <div className="glass-card p-6 rounded-3xl border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <Droplets className="text-accent-blue w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-zinc-500">Water</span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center mb-6 h-16 content-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-6 h-8 rounded-md border transition-all",
                  i < healthData.water 
                    ? "bg-accent-blue/20 border-accent-blue/50" 
                    : "border-zinc-800 bg-zinc-950/50"
                )}
              />
            ))}
          </div>
          <button 
            onClick={() => updateHealth({ water: healthData.water + 1 }, 10, "Hydration updated")}
            className="w-full py-2 rounded-xl bg-accent-blue/10 text-accent-blue border border-accent-blue/20 font-bold text-xs hover:bg-accent-blue hover:text-white transition-all"
          >
            Add Glass (+10 XP)
          </button>
        </div>

        {/* Exercise Tracker */}
        <div className="glass-card p-6 rounded-3xl border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <Dumbbell className="text-accent-green w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-zinc-500">Exercise</span>
          </div>
          <div className="text-center mb-6">
            <div className="text-4xl font-black text-zinc-100 mb-1">{healthData.exercise}m</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Minutes</div>
          </div>
          <button 
            onClick={() => updateHealth({ exercise: healthData.exercise + 15 }, 50, "Workout logged")}
            className="w-full py-2 rounded-xl bg-accent-green/10 text-accent-green border border-accent-green/20 font-bold text-xs hover:bg-accent-green hover:text-white transition-all"
          >
            Add 15m (+50 XP)
          </button>
        </div>

        {/* Weight Tracker */}
        <div className="glass-card p-6 rounded-3xl border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <Scale className="text-orange-500 w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-zinc-500">Weight</span>
          </div>
          <div className="text-center mb-6">
            <input 
              type="number" 
              step="0.1"
              value={healthData.weight}
              onChange={(e) => setHealthData({ ...healthData, weight: parseFloat(e.target.value) || 0 })}
              className="text-4xl font-black text-zinc-100 mb-1 bg-transparent border-b border-zinc-800 w-24 text-center focus:outline-none focus:border-orange-500 transition-colors"
            />
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Kilograms</div>
          </div>
          <button 
            onClick={() => updateHealth({ weight: healthData.weight }, 100, "Weight updated")}
            className="w-full py-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 font-bold text-xs hover:bg-orange-500 hover:text-white transition-all"
          >
            Log Weight (+100 XP)
          </button>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border-zinc-800">
        <h3 className="text-xl font-bold mb-8">Weekly Performance Vitals</h3>
        <div className="flex items-end justify-between gap-2 h-48 px-4">
          {days.map((day, idx) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - idx));
            const dateStr = date.toLocaleDateString();
            const dayData = weeklyHistory.find(d => d.lastUpdated === dateStr);
            const height = dayData ? getDayHeight(dayData) : 5;

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full relative group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-500 relative",
                      height > 70 ? "bg-accent-green shadow-[0_0_15px_rgba(16,185,129,0.3)]" : 
                      height > 40 ? "bg-accent-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]" : 
                      "bg-zinc-800"
                    )}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {dayData ? `${Math.round(height)}% Score` : 'No Data'}
                  </div>
                </div>
                <div className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  idx === 6 ? "text-accent-green" : "text-zinc-500"
                )}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
