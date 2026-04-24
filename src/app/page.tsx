"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Plus,
  Heart,
  TrendingUp,
  FileText,
  MessageSquare,
  Bell,
  Clock,
} from "lucide-react";

export default function Home() {
  const [goals, setGoals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [latestSleep, setLatestSleep] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: "Julian Dubois",
    title: "Master Admin",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian",
  });
  const [dummyData, setDummyData] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Profile
  useEffect(() => {
    return onSnapshot(doc(db, "profiles", "default"), (doc) => {
      if (doc.exists()) setProfile(doc.data() as any);
    });
  }, []);

  // Fetch Goals for progress summary
  useEffect(() => {
    const q = query(
      collection(db, "goals"),
      orderBy("progress", "desc"),
      limit(3),
    );
    return onSnapshot(q, (snapshot) => {
      setGoals(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // Fetch incomplete tasks for Daily Planner
  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      where("completed", "==", false),
      limit(5),
    );
    return onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // Fetch latest sleep log
  useEffect(() => {
    const q = query(
      collection(db, "sleep_logs"),
      orderBy("timestamp", "desc"),
      limit(1),
    );
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatestSleep(snapshot.docs[0].data());
      } else {
        setLatestSleep(null);
      }
    });
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dummyData.trim()) return;
    setStatus({ type: "loading", message: "Synchronizing..." });
    try {
      await addDoc(collection(db, "dummy_data"), {
        content: dummyData,
        timestamp: serverTimestamp(),
      });
      setStatus({ type: "success", message: "Data Synced" });
      setDummyData("");
      setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
    } catch (error) {
      console.error("Firebase Error:", error);
      setStatus({ type: "error", message: "Sync Failed" });
    }
  };

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "tasks", taskId), { completed: !currentStatus });
  };

  return (
    <main className="flex-1 flex flex-col p-8 space-y-8 overflow-y-auto">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            NEXUS{" "}
            <span className="font-light text-gray-400">
              LifeOS{" "}
              <span className="text-[10px] align-top ml-1 text-teal-400">
                V2.1
              </span>
            </span>
          </h1>
        </div>

        <div className="flex items-center space-x-12">
          <div className="text-right">
            <div className="text-sm font-bold text-white uppercase tracking-wider">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-teal-500 overflow-hidden">
              <img src={profile.avatarUrl} alt="User Avatar" />
            </div>
            <div>
              <div className="text-sm font-bold">{profile.name}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                {profile.title}
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <MessageSquare
                size={16}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <div className="relative">
                <Bell
                  size={16}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-[#0d1117]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 grid-rows-6 gap-6 h-auto lg:h-[800px]">
        {/* Daily Planner Card - LIVE TASKS */}
        <section className="col-span-12 lg:col-span-3 row-span-4 nexus-panel p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Daily Planner</h3>
            <div className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-lg">
              TODAY
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="nexus-subtext">Active Tasks</div>
            <div className="space-y-3">
              {tasks.length === 0 && (
                <div className="text-xs text-gray-500 italic">
                  All clear for today.
                </div>
              )}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-3 rounded-xl border border-transparent hover:bg-white/5 transition-all"
                >
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center border-gray-600 hover:border-teal-400`}
                  >
                    {task.completed && (
                      <Plus className="rotate-45 text-teal-400" size={14} />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white">
                      {task.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-auto w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center self-end shadow-lg hover:rotate-90 transition-transform">
            <Plus className="text-gray-900" size={24} />
          </button>
        </section>

        {/* Goal Progress Card - LIVE GOALS */}
        <section className="col-span-12 lg:col-span-4 row-span-3 nexus-panel p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Goals Progress</h3>
            <span className="text-teal-400 text-xs font-bold">Live Stream</span>
          </div>
          <div className="space-y-6">
            {goals.length === 0 && (
              <div className="text-xs text-gray-500 italic">
                No goals defined yet.
              </div>
            )}
            {goals.map((goal, idx) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-teal-500" : idx === 1 ? "bg-cyan-400" : "bg-amber-400"}`}
                    />
                    <span className="text-xs text-gray-300 uppercase truncate max-w-[150px]">
                      {goal.title}
                    </span>
                  </div>
                  <span className="text-xs font-bold">
                    {goal.progress || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${idx === 0 ? "bg-teal-500" : idx === 1 ? "bg-cyan-400" : "bg-amber-400"}`}
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto p-4 bg-white/5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-500/20 rounded-xl">
                <Clock className="text-teal-400" size={16} />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase">
                  GPS SYSTEM
                </div>
                <div className="text-xs font-bold">Active Tracking</div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Dashboard Card - Placeholder */}
        <section className="col-span-12 lg:col-span-3 row-span-3 nexus-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Health</h3>
            <Heart className="text-rose-500" size={18} fill="currentColor" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <div className="nexus-subtext">Steps</div>
              <div className="text-2xl font-bold">--</div>
            </div>
            <div className="space-y-1">
              <div className="nexus-subtext">Sleep Score</div>
              <div className="text-2xl font-bold">
                {latestSleep ? latestSleep.score : "--"}{" "}
                <span className="text-xs text-teal-400 font-bold uppercase">PTS</span>
              </div>
            </div>
          </div>
          {latestSleep && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                    <span>Rest Quality</span>
                    <span className="text-teal-400">{Math.round((latestSleep.deepSleep / (latestSleep.deepSleep + latestSleep.lightSleep)) * 100)}% Deep</span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full" style={{ width: `${latestSleep.score}%` }} />
                </div>
            </div>
          )}
        </section>

        {/* Database Sync Card (FUNCTIONAL) */}
        <section className="col-span-12 lg:col-span-2 row-span-6 nexus-panel nexus-panel-gold p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-amber-400">Database</h3>
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${status.type === "loading" ? "bg-amber-500" : "bg-green-500"}`}
            />
          </div>
          <form
            onSubmit={handleUpload}
            className="flex-1 flex flex-col space-y-4"
          >
            <div className="nexus-subtext text-amber-500/70">
              Manual Data Entry
            </div>
            <textarea
              value={dummyData}
              onChange={(e) => setDummyData(e.target.value)}
              placeholder="Type dummy data string..."
              className="nexus-input flex-1 resize-none bg-amber-500/5 border-amber-500/20 focus:border-amber-500/50"
            />
            <button
              type="submit"
              disabled={status.type === "loading"}
              className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50"
            >
              {status.type === "loading" ? "SYNCING..." : "UPLOAD DATA"}
            </button>
          </form>
        </section>

        {/* Finance Overview Card - Placeholder */}
        <section className="col-span-12 lg:col-span-4 row-span-3 nexus-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Finance</h3>
            <TrendingUp className="text-teal-400" size={18} />
          </div>
          <div className="nexus-subtext">Balance</div>
          <div className="text-3xl font-bold mb-4">$15,840</div>
        </section>

        {/* Reminders / Notes Cards - Placeholder */}
        <section className="col-span-12 lg:col-span-3 row-span-3 nexus-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Notes</h3>
            <FileText className="text-gray-500" size={18} />
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="text-[10px] text-teal-400 font-bold mb-1">
                RECENT ENTRY
              </div>
              <div className="text-xs text-gray-300 truncate">
                Nexus OS architecture refactoring notes...
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
