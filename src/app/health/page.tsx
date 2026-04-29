'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { HeartPulse, Moon, Droplets, Dumbbell, Plus, Flame, Loader2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDocument, getDocuments, updateDocument } from '@/lib/firestoreUtils';

interface HealthData {
  id?: string;
  sleep: number;
  water: number;
  exercise: number;
  lastUpdated: string;
}

interface Toast {
  id: string;
  message: string;
  xp?: number;
}

export default function HealthOSPage() {
  const [healthData, setHealthData] = useState<HealthData>({ sleep: 7, water: 0, exercise: 0, lastUpdated: new Date().toLocaleDateString() });
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addXP = useStore(state => state.addXP);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const data = await getDocuments('health');
      const today = new Date().toLocaleDateString();
      const todayData = (data as HealthData[]).find(d => d.lastUpdated === today);
      
      if (todayData) {
        setHealthData(todayData);
      } else {
        // Initialize today's record if it doesn't exist
        const newRecord = { sleep: 0, water: 0, exercise: 0, lastUpdated: today };
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
    setHealthData(newData); // Optimistic update
    
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

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      {/* Custom Toast System */}
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
              value={healthData.sleep}
              onChange={(e) => setHealthData({ ...healthData, sleep: parseFloat(e.target.value) || 0 })}
              className="text-5xl font-black text-zinc-100 mb-2 bg-transparent border-b-2 border-zinc-800 w-32 text-center focus:outline-none focus:border-accent-purple transition-colors"
            />
            <div className="text-sm text-zinc-400 mt-2">Hours rested last night</div>
          </div>
          <button 
            onClick={() => {
              const xp = Math.round(healthData.sleep * 10);
              updateHealth({ sleep: healthData.sleep }, xp, `Logged ${healthData.sleep}h sleep`);
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
                  i < healthData.water 
                    ? "bg-accent-blue/20 border-accent-blue text-accent-blue" 
                    : "border-zinc-800 text-zinc-800"
                )}
              >
                <Droplets className="w-4 h-4" />
              </motion.div>
            ))}
          </div>
          <button 
            onClick={() => updateHealth({ water: healthData.water + 1 }, 10, "Hydration levels increased")}
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
            <div className="text-5xl font-black text-zinc-100 mb-2">{healthData.exercise}m</div>
            <div className="text-sm text-zinc-400">Activity today</div>
          </div>
          <div className="space-y-3">
            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent-green"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (healthData.exercise / 60) * 100)}%` }}
              />
            </div>
            <button 
              onClick={() => updateHealth({ exercise: healthData.exercise + 15 }, 50, "Movement session logged")}
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
