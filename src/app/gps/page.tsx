'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Target, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
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
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', purpose: '', systems: [''] });
  const addXP = useStore(state => state.addXP);

  // In a real app, this would fetch from Firestore. 
  // For now, I'll simulate with local state but use the firestoreUtils structure.
  
  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.purpose) return;
    
    const goalData: Goal = {
      title: newGoal.title,
      purpose: newGoal.purpose,
      systems: newGoal.systems
        .filter(s => s.trim() !== '')
        .map(s => ({ id: Math.random().toString(36).substr(2, 9), label: s, completed: false }))
    };

    // Simulate Firestore add
    setGoals([...goals, { ...goalData, id: Math.random().toString() }]);
    setNewGoal({ title: '', purpose: '', systems: [''] });
    setIsAdding(false);
    addXP(100); // Award XP for setting a goal
  };

  const toggleSystem = (goalId: string, systemId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          systems: goal.systems.map(s => {
            if (s.id === systemId) {
              if (!s.completed) addXP(25); // Award XP for completing a system task
              return { ...s, completed: !s.completed };
            }
            return s;
          })
        };
      }
      return goal;
    }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Target className="text-accent-purple w-8 h-8" />
            GPS Goal Setting
          </h2>
          <p className="text-zinc-400 mt-1">Goal, Purpose, System — Ali Abdaal's Method</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-accent-purple hover:bg-accent-purple/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-accent-purple/20"
        >
          <Plus className="w-5 h-5" />
          Set New Goal
        </button>
      </div>

      {/* Add Goal Modal/Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-8 p-6 glass-card rounded-2xl border-accent-purple/30 bg-zinc-900/80"
          >
            <h3 className="text-xl font-bold mb-4">Initialize New Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Goal Title</label>
                <input 
                  type="text" 
                  value={newGoal.title}
                  onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 focus:outline-none focus:border-accent-purple transition-colors"
                  placeholder="e.g., Master Next.js 14"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Purpose (The Why)</label>
                <textarea 
                  value={newGoal.purpose}
                  onChange={e => setNewGoal({...newGoal, purpose: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 focus:outline-none focus:border-accent-purple transition-colors h-24"
                  placeholder="Why do you want to achieve this?"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Systems (Daily/Weekly Actions)</label>
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 focus:outline-none focus:border-accent-purple transition-colors mb-2"
                    placeholder={`System ${i + 1}`}
                  />
                ))}
                <button 
                  onClick={() => setNewGoal({...newGoal, systems: [...newGoal.systems, '']})}
                  className="text-sm text-accent-purple hover:underline"
                >
                  + Add another system
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleAddGoal}
                  className="bg-accent-purple px-6 py-2 rounded-lg font-bold"
                >
                  Create Goal (+100 XP)
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="text-zinc-400 px-4 py-2 hover:text-zinc-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <motion.div 
            layout
            key={goal.id}
            className="p-6 glass-card rounded-2xl group hover:border-accent-purple/50 transition-all"
          >
            <h4 className="text-xl font-bold mb-2 group-hover:text-accent-purple transition-colors">{goal.title}</h4>
            <p className="text-zinc-400 text-sm mb-6 italic">"{goal.purpose}"</p>
            
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Daily Systems</h5>
              {goal.systems.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => toggleSystem(goal.id!, s.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                    s.completed 
                      ? "bg-accent-green/10 border-accent-green/30 text-accent-green" 
                      : "bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  )}
                >
                  {s.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  <span className={cn(s.completed && "line-through opacity-70")}>{s.label}</span>
                  {s.completed && <span className="ml-auto text-xs font-bold">+25 XP</span>}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
