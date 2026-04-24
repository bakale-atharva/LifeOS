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
  serverTimestamp 
} from "firebase/firestore";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";
import { 
  Moon, 
  Plus, 
  Clock, 
  Zzz,
  Info,
  History
} from "lucide-react";

type SleepLog = {
  id: string;
  lightSleep: number; // minutes
  deepSleep: number; // minutes
  awakeTime: number; // minutes
  score: number;
  timestamp: any;
};

export default function HealthPage() {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [lightSleep, setLightSleep] = useState<string>("");
  const [deepSleep, setDeepSleep] = useState<string>("");
  const [awakeTime, setAwakeTime] = useState<string>("");

  useEffect(() => {
    const q = query(collection(db, "sleep_logs"), orderBy("timestamp", "desc"), limit(7));
    return onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SleepLog)));
    });
  }, []);

  const calculateScore = (light: number, deep: number, awake: number) => {
    const totalMinutes = light + deep;
    const idealMinutes = 8 * 60;
    
    // Base score on duration (up to 70 points)
    let durationScore = Math.min((totalMinutes / idealMinutes) * 70, 70);
    
    // Bonus for deep sleep percentage (ideal is >20%)
    const deepPercentage = (deep / (totalMinutes || 1)) * 100;
    let qualityScore = Math.min((deepPercentage / 25) * 30, 30);
    
    // Deduction for awake time
    const awakeDeduction = Math.min(awake / 2, 10);
    
    return Math.round(Math.max(0, Math.min(100, durationScore + qualityScore - awakeDeduction)));
  };

  const addSleepLog = async () => {
    const l = parseInt(lightSleep) || 0;
    const d = parseInt(deepSleep) || 0;
    const a = parseInt(awakeTime) || 0;
    
    if (l === 0 && d === 0) return;

    const score = calculateScore(l, d, a);

    await addDoc(collection(db, "sleep_logs"), {
      lightSleep: l,
      deepSleep: d,
      awakeTime: a,
      score,
      timestamp: serverTimestamp()
    });

    setLightSleep("");
    setDeepSleep("");
    setAwakeTime("");
  };

  const currentLog = logs[0];
  const chartData = currentLog ? [
    { name: "Deep Sleep", value: currentLog.deepSleep, color: "#2dd4bf" },
    { name: "Light Sleep", value: currentLog.lightSleep, color: "#3b82f6" },
    { name: "Awake", value: currentLog.awakeTime, color: "#f87171" },
  ] : [];

  const formatMinutes = (m: number) => {
    const hrs = Math.floor(m / 60);
    const mins = m % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <main className="flex-1 flex flex-col p-8 space-y-8 overflow-y-auto bg-[#0d1117]">
      <header className="flex items-center space-x-3">
        <div className="p-3 bg-teal-500/20 rounded-2xl text-teal-400">
            <Moon size={28} />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">HEALTH & VITALITY</h1>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Circadian Rhythm Optimization</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-4 space-y-6">
            <div className="nexus-panel p-6 space-y-6">
                <div className="flex items-center space-x-2 text-teal-400 font-bold uppercase text-xs tracking-wider">
                    <Plus size={16}/> <span>Log Previous Night</span>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Deep Sleep (mins)</label>
                        <input 
                            type="number"
                            value={deepSleep}
                            onChange={(e) => setDeepSleep(e.target.value)}
                            className="nexus-input w-full" 
                            placeholder="e.g. 120" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Light Sleep (mins)</label>
                        <input 
                            type="number"
                            value={lightSleep}
                            onChange={(e) => setLightSleep(e.target.value)}
                            className="nexus-input w-full" 
                            placeholder="e.g. 300" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Awake Time (mins)</label>
                        <input 
                            type="number"
                            value={awakeTime}
                            onChange={(e) => setAwakeTime(e.target.value)}
                            className="nexus-input w-full" 
                            placeholder="e.g. 15" 
                        />
                    </div>
                    
                    <button 
                        onClick={addSleepLog}
                        className="nexus-btn w-full mt-4 flex items-center justify-center space-x-2"
                    >
                        <Zzz size={18} /> <span>Save Log</span>
                    </button>
                </div>
            </div>

            <div className="nexus-panel p-6 bg-blue-500/5 border-blue-500/20">
                <div className="flex items-start space-x-3">
                    <Info className="text-blue-400 mt-0.5" size={18} />
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Optimizing deep sleep is critical for cognitive recovery and memory consolidation. Aim for at least 20% deep sleep per night.
                    </p>
                </div>
            </div>
        </div>

        {/* Visualization Section */}
        <div className="lg:col-span-8 space-y-8">
            {currentLog ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="nexus-panel p-8 flex flex-col items-center justify-center relative min-h-[400px]">
                        <div className="absolute top-8 left-8 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center space-x-2">
                            <History size={14} /> <span>Latest Session</span>
                        </div>
                        
                        <div className="w-full h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#161b22', border: '1px solid rgba(48, 54, 61, 0.4)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                            <span className="text-4xl font-black text-white">{currentLog.score}</span>
                            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-tighter">Sleep Score</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="nexus-panel p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400"><Clock size={18}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Duration</p>
                                    <p className="text-xl font-bold">{formatMinutes(currentLog.lightSleep + currentLog.deepSleep)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="nexus-panel p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Zzz size={18}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Deep Sleep</p>
                                    <p className="text-xl font-bold">{formatMinutes(currentLog.deepSleep)}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                                {Math.round((currentLog.deepSleep / (currentLog.lightSleep + currentLog.deepSleep)) * 100)}%
                            </span>
                        </div>
                        <div className="nexus-panel p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-500/10 rounded-lg text-gray-400"><Moon size={18}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Light Sleep</p>
                                    <p className="text-xl font-bold">{formatMinutes(currentLog.lightSleep)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="nexus-panel p-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-6 bg-white/5 rounded-full text-gray-600">
                        <Moon size={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">No Sleep Data Detected</h3>
                        <p className="text-gray-500 max-w-xs mx-auto text-sm mt-2">Initialize your health tracking by logging your first sleep session on the left.</p>
                    </div>
                </div>
            )}

            {/* History Table */}
            <div className="nexus-panel overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-wider">Recent Activity</h3>
                    <button className="text-[10px] font-bold text-teal-400 uppercase hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Deep %</th>
                                <th className="px-6 py-4">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {log.timestamp?.toDate().toLocaleDateString() || "Today"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {formatMinutes(log.lightSleep + log.deepSleep)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {Math.round((log.deepSleep / (log.lightSleep + log.deepSleep)) * 100)}%
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 text-[10px] font-black">
                                                {log.score}
                                            </div>
                                            <div className="flex-1 h-1 bg-gray-800 rounded-full w-16 overflow-hidden">
                                                <div className="h-full bg-teal-500" style={{ width: `${log.score}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}
