'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Target, Plus, CheckCircle2, Circle, Trash2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDocument, getDocuments, updateDocument, deleteDocument } from '@/lib/firestoreUtils';

interface GoalSystem {
  id: string;
  label: string;
  completed: boolean;
}

interface Goal {
  id?: string;
  title: string;
  purpose: string;
  systems: GoalSystem[];
}

export default function GPSPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', purpose: '', systems: [''] });
  const addXP = useStore(state => state.addXP);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getDocuments('goals');
      setGoals(data as Goal[]);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.purpose) return;
    
    const goalData: Omit<Goal, 'id'> = {
      title: newGoal.title,
      purpose: newGoal.purpose,
      systems: newGoal.systems
        .filter(s => s.trim() !== '')
        .map(s => ({ id: Math.random().toString(36).substr(2, 9), label: s, completed: false }))
    };

    try {
      await addDocument('goals', goalData);
      await fetchGoals();
      setNewGoal({ title: '', purpose: '', systems: [''] });
      setIsAdding(false);
      addXP(100);
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const toggleSystem = async (goalId: string, systemId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedSystems = goal.systems.map(s => {
      if (s.id === systemId) {
        if (!s.completed) addXP(25);
        return { ...s, completed: !s.completed };
      }
      return s;
    });

    try {
      // Optimistic update
      setGoals(goals.map(g => g.id === goalId ? { ...g, systems: updatedSystems } : g));
      await updateDocument('goals', goalId, { systems: updatedSystems });
    } catch (error) {
      console.error("Error updating system:", error);
      await fetchGoals(); // Revert on error
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      setGoals(goals.filter(g => g.id !== id));
      await deleteDocument('goals', id);
    } catch (error) {
      console.error("Error deleting goal:", error);
      await fetchGoals();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-6xl mx-auto"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-zinc-100 flex items-center gap-4">
            <Target className="text-brand-primary w-10 h-10" />
            GOAL_SYSTEM.SYS
          </h2>
          <p className="text-zinc-500 mt-2 text-[10px] font-mono uppercase tracking-[0.3em]">Goal, Purpose, System — Ali Abdaal's Methodology</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-4 h-4" />
          Define Goal
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-16 p-10 glass-card rounded-[40px] border-brand-primary/20 bg-brand-primary/[0.02]"
          >
            <h3 className="text-xl font-bold mb-10 flex items-center gap-4 tracking-tight">
              <Sparkles className="text-brand-primary w-5 h-5" />
              OBJECTIVE_PARAMETERS
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Designation</label>
                  <input 
                    type="text" 
                    value={newGoal.title}
                    onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 focus:outline-none focus:border-brand-primary transition-colors text-zinc-100 text-sm font-bold"
                    placeholder="e.g., Strategic Architecture Mastery"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Intent (The Why)</label>
                  <textarea 
                    value={newGoal.purpose}
                    onChange={e => setNewGoal({...newGoal, purpose: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 focus:outline-none focus:border-brand-primary transition-colors h-32 text-zinc-100 text-sm font-medium leading-relaxed"
                    placeholder="Define the underlying purpose of this trajectory..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Operational Systems</label>
                <div className="space-y-3">
                  {newGoal.systems.map((s, i) => (
                    <input 
                      key={i}
                      type="text" 
                      value={s}
                      onChange={e => {
                        const updated = [...newGoal.systems];
                        updated[i] = e.target.value;
                        setNewGoal({...newGoal, systems: updated});
                      }}
                      className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 focus:outline-none focus:border-brand-primary transition-colors text-zinc-400 text-xs"
                      placeholder={`Action Protocol ${i + 1}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setNewGoal({...newGoal, systems: [...newGoal.systems, '']})}
                  className="mt-4 text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:text-white transition-colors"
                >
                  + Add Protocol
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleAddGoal}
                className="flex-1 bg-brand-primary py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/30"
              >
                Launch Trajectory (+100 XP)
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="px-10 bg-white/[0.03] border border-white/[0.05] py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/[0.05] transition-all"
              >
                Abort
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-6">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] animate-pulse">Syncing neural objectives...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {goals.map((goal, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={goal.id}
              className="p-10 glass-card glass-card-hover rounded-[40px] border-white/[0.05] group relative overflow-hidden"
            >
              <button 
                onClick={() => handleDeleteGoal(goal.id!)}
                className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-zinc-600 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <h4 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight group-hover:text-brand-primary transition-colors">{goal.title}</h4>
              <p className="text-zinc-500 text-sm mb-10 font-medium leading-relaxed italic">"{goal.purpose}"</p>
              
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6 px-1">Daily Protocols</h5>
                {goal.systems.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => toggleSystem(goal.id!, s.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
                      s.completed 
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                        : "bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:border-white/10"
                    )}
                  >
                    {s.completed ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <Circle className="w-5 h-5 shrink-0 text-zinc-700" />}
                    <span className={cn("text-sm font-semibold tracking-tight", s.completed && "line-through opacity-40")}>{s.label}</span>
                    {s.completed && <span className="ml-auto text-[10px] font-black text-emerald-400/50">+25 XP</span>}
                  </div>
                ))}
              </div>
              
              {/* Visual Mesh Background */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-primary/5 blur-[50px] pointer-events-none group-hover:bg-brand-primary/10 transition-all duration-1000" />
            </motion.div>
          ))}
          {goals.length === 0 && (
            <div className="col-span-full h-80 border border-dashed border-white/[0.05] rounded-[48px] flex flex-col items-center justify-center text-zinc-700 gap-6 opacity-40">
              <Target className="w-16 h-16" />
              <p className="font-bold uppercase tracking-[0.3em] text-[10px]">No active trajectories established</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
