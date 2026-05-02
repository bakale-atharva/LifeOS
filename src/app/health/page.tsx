'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { HeartPulse, Moon, Droplets, Dumbbell, Plus, Flame, Loader2, Sparkles, X, Scale, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDocument, getDocuments, updateDocument, deleteDocument } from '@/lib/firestoreUtils';

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
  const { addXP, dealDamage } = useStore();

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
        const lastRecord = sortedData[sortedData.length - 1];
        const newRecord = { sleep: 0, water: 0, exercise: 0, weight: lastRecord ? lastRecord.weight : 70, lastUpdated: today };
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
      
      // Combat Integration
      if (updates.water) dealDamage(10, 'Hydration Blast');
      if (updates.exercise) dealDamage(25, 'Kinetic Assault');
      if (updates.weight) dealDamage(5, 'Mass Calibration');
    }

    try {
      if (newData.id) {
        await updateDocument('health', newData.id, updates);
      }
    } catch (error) {
      console.error("Error syncing health data:", error);
    }
  };

  const resetMetric = async (metric: keyof HealthData) => {
    const defaultValues: Partial<HealthData> = {
      sleep: 0,
      water: 0,
      exercise: 0,
      weight: 70
    };
    
    const value = defaultValues[metric];
    await updateHealth({ [metric]: value }, 0, `${metric.charAt(0).toUpperCase() + metric.slice(1)} reset`);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-6xl mx-auto relative"
    >
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-card px-6 py-4 rounded-2xl border-brand-primary/20 bg-[#1E293B]/80 shadow-2xl flex items-center gap-4 min-w-[300px]"
            >
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-zinc-100">{toast.message}</p>
                {toast.xp && <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">+{toast.xp} XP Earned</p>}
              </div>
              <button onClick={() => setToasts(toasts.filter(t => t.id !== toast.id))}>
                <X className="w-4 h-4 text-zinc-500 hover:text-zinc-100" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="mb-12">
        <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4">
          <HeartPulse className="text-brand-primary w-10 h-10" />
          HEALTH_OS
        </h2>
        <p className="text-zinc-500 mt-2 font-mono text-[10px] uppercase tracking-[0.3em]">Daily biological optimization • {healthData.lastUpdated}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Sleep Tracker */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card glass-card-hover p-8 rounded-[32px] border-white/[0.05] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <Moon className="text-brand-primary w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sleep Cycles</span>
          </div>
          <div className="text-center mb-8 relative z-10">
            <input 
              type="number" 
              step="0.1"
              value={healthData.sleep}
              onChange={(e) => setHealthData({ ...healthData, sleep: parseFloat(e.target.value) || 0 })}
              className="text-5xl font-black text-zinc-100 bg-transparent border-b-2 border-white/5 w-24 text-center focus:outline-none focus:border-brand-primary transition-colors tracking-tighter"
            />
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-3">Duration (Hrs)</div>
          </div>
          <div className="flex gap-2 relative z-10">
            <button 
              onClick={() => updateHealth({ sleep: healthData.sleep }, Math.round(healthData.sleep * 10), `Logged ${healthData.sleep}h sleep`)}
              className="flex-1 py-3 rounded-2xl bg-brand-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Log Entry
            </button>
            <button 
              onClick={() => resetMetric('sleep')}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Hydration Tracker */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card glass-card-hover p-8 rounded-[32px] border-white/[0.05] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <Droplets className="text-brand-primary w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Hydration</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-8 h-20 content-center relative z-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "w-5 h-7 rounded-lg border transition-all duration-500",
                  i < healthData.water 
                    ? "bg-brand-primary border-brand-primary/50 shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
                    : "border-white/[0.05] bg-white/[0.02]"
                )}
              />
            ))}
          </div>
          <div className="flex gap-2 relative z-10">
            <button 
              onClick={() => updateHealth({ water: healthData.water + 1 }, 10, "Hydration updated")}
              className="flex-1 py-3 rounded-2xl bg-brand-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Add Intake
            </button>
            <button 
              onClick={() => resetMetric('water')}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Exercise Tracker */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card glass-card-hover p-8 rounded-[32px] border-white/[0.05] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <Dumbbell className="text-brand-primary w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Movement</span>
          </div>
          <div className="text-center mb-8 relative z-10">
            <div className="text-5xl font-black text-zinc-100 tracking-tighter">{healthData.exercise}m</div>
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-3">Active Minutes</div>
          </div>
          <div className="flex gap-2 relative z-10">
            <button 
              onClick={() => updateHealth({ exercise: healthData.exercise + 15 }, 50, "Workout logged")}
              className="flex-1 py-3 rounded-2xl bg-brand-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Boost +15m
            </button>
            <button 
              onClick={() => resetMetric('exercise')}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Weight Tracker */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card glass-card-hover p-8 rounded-[32px] border-white/[0.05] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <Scale className="text-brand-primary w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Mass Vitals</span>
          </div>
          <div className="text-center mb-8 relative z-10">
            <input 
              type="number" 
              step="0.1"
              value={healthData.weight}
              onChange={(e) => setHealthData({ ...healthData, weight: parseFloat(e.target.value) || 0 })}
              className="text-5xl font-black text-zinc-100 bg-transparent border-b-2 border-white/5 w-24 text-center focus:outline-none focus:border-brand-primary transition-colors tracking-tighter"
            />
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-3">KILOGRAMS</div>
          </div>
          <div className="flex gap-2 relative z-10">
            <button 
              onClick={() => updateHealth({ weight: healthData.weight }, 100, "Weight updated")}
              className="flex-1 py-3 rounded-2xl bg-brand-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Calibrate
            </button>
            <button 
              onClick={() => resetMetric('weight')}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-10 rounded-[40px] border-white/[0.05]"
      >
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-xl font-bold tracking-tight">BIO_ANALYTICS.LOG</h3>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            Real-time Telemetry
          </div>
        </div>
        
        <div className="flex items-end justify-between gap-4 h-56 px-4">
          {days.map((day, idx) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - idx));
            const dateStr = date.toLocaleDateString();
            const dayData = weeklyHistory.find(d => d.lastUpdated === dateStr);
            const height = dayData ? getDayHeight(dayData) : 5;

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-4">
                <div className="w-full relative group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: 0.5 + (idx * 0.1), ease: "circOut" }}
                    className={cn(
                      "w-full rounded-2xl transition-all duration-500 relative",
                      height > 70 ? "bg-brand-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]" : 
                      height > 40 ? "bg-indigo-400/60 shadow-[0_0_15px_rgba(129,140,248,0.2)]" : 
                      "bg-white/[0.03] border border-white/[0.05]"
                    )}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/[0.05] px-3 py-1.5 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-2xl">
                    {dayData ? `${Math.round(height)}% Score` : 'NO_DATA'}
                  </div>
                </div>
                <div className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  idx === 6 ? "text-brand-primary" : "text-zinc-600"
                )}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
