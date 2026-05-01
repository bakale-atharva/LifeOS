'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Clock, Play, Pause, RotateCcw, Calendar as CalendarIcon, Plus, CheckCircle2, Trash2, Loader2 } from 'lucide-react';
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
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Pomodoro Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-8 rounded-3xl border-zinc-800 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-center gap-2">
              <Clock className="text-accent-blue" />
              Focus Timer
            </h2>
            
            <div className="flex justify-center gap-2 mb-8">
              {(['work', 'short', 'long'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                    mode === m 
                      ? "bg-accent-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                      : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {m.replace('short', 'Break').replace('work', 'Focus')}
                </button>
              ))}
            </div>

            <div className="text-7xl font-black mb-8 font-mono tracking-tighter text-zinc-100">
              {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsActive(!isActive)}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl",
                  isActive 
                    ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700" 
                    : "bg-accent-blue text-white hover:scale-105 shadow-accent-blue/20"
                )}
              >
                {isActive ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
              </button>
              <button
                onClick={resetTimer}
                className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-all"
              >
                <RotateCcw />
              </button>
            </div>
          </div>
          
          {/* Animated Background Pulse when active */}
          {isActive && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.05 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-accent-blue rounded-full m-auto w-64 h-64 -z-0"
            />
          )}
        </div>
      </div>

      {/* Daily Schedule / Tasks Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-8 rounded-3xl border-zinc-800 min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <CalendarIcon className="text-accent-blue" />
              Focus Sessions
            </h2>
            <div className="text-sm text-zinc-500 font-medium">Today's Schedule</div>
          </div>

          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="What are we focusing on? (+10 XP)"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-all"
            />
            <button 
              onClick={addTask}
              className="bg-accent-blue p-3 rounded-xl hover:bg-accent-blue/90 transition-all shadow-lg shadow-accent-blue/20"
            >
              <Plus className="text-white" />
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
              </div>
            ) : (
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={task.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all group",
                      task.completed 
                        ? "bg-accent-blue/10 border-accent-blue/30 text-zinc-500" 
                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <div 
                      onClick={() => toggleTask(task)}
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="text-accent-blue w-6 h-6" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-zinc-700 group-hover:border-accent-blue transition-colors" />
                      )}
                      <span className={cn("font-medium", task.completed && "line-through")}>
                        {task.text}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {task.completed && <span className="text-xs font-bold text-accent-blue">+20 XP</span>}
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {!loading && tasks.length === 0 && (
              <div className="text-center py-20 text-zinc-600">
                <p>No focus sessions planned yet.</p>
                <p className="text-sm italic">"The secret of getting ahead is getting started."</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
