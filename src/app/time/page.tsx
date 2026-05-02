'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Clock, Play, Pause, RotateCcw, Calendar as CalendarIcon, Plus, CheckCircle2, Trash2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDocument, getDocuments, deleteDocument, updateDocument } from '@/lib/firestoreUtils';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: any;
}

export default function TimeManagementPage() {
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { addXP, dealDamage } = useStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getDocuments('tasks');
      // Sort by creation date
      const sortedTasks = (data as Task[]).sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return dateB - dateA;
      });
      setTasks(sortedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    work: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    const reward = mode === 'work' ? 150 : 50;
    addXP(reward);
    
    // Combat Integration
    if (mode === 'work') {
      dealDamage(50, 'Deep Work Strike');
    } else {
      dealDamage(10, 'Recovery Phase');
    }

    alert(`${mode.toUpperCase()} session complete! +${reward} XP`);
    resetTimer();
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode]);
  };

  const switchMode = (newMode: 'work' | 'short' | 'long') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(settings[newMode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const taskData = { text: newTask, completed: false };
    try {
      await addDocument('tasks', taskData);
      await fetchTasks();
      setNewTask('');
      addXP(10);
      dealDamage(5, 'Strategy Formulation');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const newStatus = !task.completed;
      await updateDocument('tasks', task.id, { completed: newStatus });
      await fetchTasks();
      if (newStatus) {
        addXP(20);
        dealDamage(15, 'Task Decimation');
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDocument('tasks', id);
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12"
    >
      {/* Pomodoro Section */}
      <div className="lg:col-span-1 space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-12 rounded-[48px] border-white/[0.05] text-center relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <h2 className="text-[10px] font-black mb-10 flex items-center justify-center gap-3 uppercase tracking-[0.4em] text-zinc-500">
              <Clock className="text-brand-primary w-4 h-4" />
              CHRONO_CORE
            </h2>
            
            <div className="flex justify-center gap-2 mb-12">
              {(['work', 'short', 'long'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    mode === m 
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                      : "bg-white/[0.03] text-zinc-600 hover:text-zinc-300"
                  )}
                >
                  {m.replace('short', 'Break').replace('work', 'Focus')}
                </button>
              ))}
            </div>

            <div className="text-[84px] font-black mb-12 font-mono tracking-tighter text-zinc-100 leading-none">
              {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => setIsActive(!isActive)}
                className={cn(
                  "w-20 h-20 rounded-[32px] flex items-center justify-center transition-all shadow-2xl",
                  isActive 
                    ? "bg-white/[0.03] text-zinc-100 hover:bg-white/[0.05]" 
                    : "bg-brand-primary text-white hover:scale-105 shadow-brand-primary/30"
                )}
              >
                {isActive ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current ml-1 w-6 h-6" />}
              </button>
              <button
                onClick={resetTimer}
                className="w-20 h-20 rounded-[32px] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-zinc-600 hover:text-zinc-100 transition-all hover:bg-white/[0.05]"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Animated Background Pulse */}
          {isActive && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.05 }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-brand-primary rounded-full m-auto w-64 h-64 -z-0 blur-[60px]"
            />
          )}
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="p-8 glass-card rounded-[32px] border-brand-primary/10 bg-brand-primary/[0.02]"
        >
           <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-primary mb-4 flex items-center gap-2">
             <Sparkles className="w-3 h-3" />
             Efficiency Yield
           </h4>
           <p className="text-xs text-zinc-500 leading-relaxed font-medium">
             Complete a focus cycle to generate <span className="text-zinc-200">150 XP</span> and execute a <span className="text-zinc-200">Deep Work Strike</span> (50 DMG) on active threats.
           </p>
        </motion.div>
      </div>

      {/* Daily Schedule / Tasks Section */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-card p-12 rounded-[48px] border-white/[0.05] min-h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black flex items-center gap-4 tracking-tighter">
              <CalendarIcon className="text-brand-primary w-8 h-8" />
              FOCUS_SEQUENCES
            </h2>
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-white/[0.03] px-4 py-2 rounded-xl border border-white/[0.05]">Active Protocol</div>
          </div>

          <div className="flex gap-4 mb-10">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="What is our next focus sector?"
              className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary transition-all text-zinc-100 font-bold tracking-tight"
            />
            <button 
              onClick={addTask}
              className="bg-brand-primary p-4 rounded-2xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95"
            >
              <Plus className="text-white w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Syncing task threads...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {tasks.map((task, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    key={task.id}
                    className={cn(
                      "flex items-center gap-5 p-6 rounded-[24px] border transition-all group",
                      task.completed 
                        ? "bg-white/[0.01] border-white/[0.02] text-zinc-600" 
                        : "bg-white/[0.02] border-white/[0.05] hover:border-brand-primary/30 hover:bg-white/[0.04]"
                    )}
                  >
                    <div 
                      onClick={() => toggleTask(task)}
                      className="flex items-center gap-5 flex-1 cursor-pointer"
                    >
                      {task.completed ? (
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-xl border-2 border-zinc-800 group-hover:border-brand-primary/50 transition-all bg-zinc-950" />
                      )}
                      <span className={cn("text-lg font-bold tracking-tight", task.completed && "line-through opacity-40 font-medium")}>
                        {task.text}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {task.completed && (
                        <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">+20 XP Earned</span>
                      )}
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-zinc-700 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {!loading && tasks.length === 0 && (
              <div className="text-center py-32 opacity-30 flex flex-col items-center gap-6">
                <CalendarIcon className="w-16 h-16" />
                <p className="font-bold uppercase tracking-[0.3em] text-[10px]">Trajectory protocols empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
