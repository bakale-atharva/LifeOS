'use client';

import { useState, useEffect } from 'react';
import { Settings, History, Database, ShieldCheck, Cpu, ChevronRight } from 'lucide-react';
import { getLogs } from '@/lib/firestoreUtils';
import { motion } from 'framer-motion';

interface LogEntry {
  id: string;
  action: string;
  collection: string;
  details: string;
  timestamp: any;
}

const formatDate = (timestamp: any) => {
  if (!timestamp || !timestamp.seconds) return 'Just now';
  const date = new Date(timestamp.seconds * 1000);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
};

export default function SettingsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs(50);
        setLogs(data as LogEntry[]);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-6xl mx-auto space-y-12"
    >
      {/* Header */}
      <header className="flex items-center gap-6 mb-12">
        <div className="p-4 rounded-[28px] bg-brand-primary/10 border border-brand-primary/20 shadow-lg shadow-brand-primary/10">
          <Settings className="w-10 h-10 text-brand-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-zinc-100 tracking-tighter uppercase">SYSTEM_CONFIG</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">Neural Link Core and Operational Records</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Navigation / Sections */}
        <div className="space-y-8">
          <div className="p-2 rounded-[32px] glass-card border-white/[0.05]">
            <button className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-brand-primary/10 text-brand-primary transition-all border border-brand-primary/20 group">
              <div className="flex items-center gap-4">
                <History className="w-5 h-5" />
                <span className="font-bold text-xs uppercase tracking-widest">Operational Logs</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-zinc-600 transition-all opacity-40 cursor-not-allowed">
              <Database className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-widest">Storage Sync</span>
            </button>
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-zinc-600 transition-all opacity-40 cursor-not-allowed">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-widest">Secure Uplink</span>
            </button>
          </div>

          <div className="p-10 rounded-[40px] glass-card border-white/[0.05] bg-white/[0.01] space-y-8">
            <div className="flex items-center gap-3 text-zinc-500">
              <Cpu className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Hardware_Status</span>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Master Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-black text-[10px] tracking-widest">ONLINE</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Sync Engine</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-black text-[10px] tracking-widest">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Logs */}
        <div className="lg:col-span-2">
          <div className="p-10 rounded-[48px] glass-card border-white/[0.05] flex flex-col min-h-[700px] relative overflow-hidden">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h2 className="text-2xl font-black text-zinc-100 tracking-tight flex items-center gap-4">
                <History className="w-6 h-6 text-brand-primary" />
                ACTIVITY_STREAM
              </h2>
              <span className="text-[9px] font-black text-zinc-600 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05] uppercase tracking-widest">
                Last 50 Events
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Accessing Records...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-800 gap-6 opacity-30">
                <History className="w-16 h-16" />
                <p className="font-bold uppercase tracking-[0.3em] text-[10px]">No activity streams detected</p>
              </div>
            ) : (
              <div className="space-y-3 relative z-10">
                {logs.map((log, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={log.id}
                    className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] hover:border-brand-primary/20 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border tracking-widest ${
                            log.action === 'ADD' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            log.action === 'UPDATE' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :
                            'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                            {log.collection}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 font-medium group-hover:text-zinc-100 transition-colors">
                          {log.details}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-zinc-700 whitespace-nowrap mt-1 uppercase tracking-tighter">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Mesh Gradient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/[0.02] blur-[120px] pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
