'use client';

import { useState, useEffect } from 'react';
import { Settings, History, Database, ShieldCheck, Cpu } from 'lucide-react';
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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-accent-purple/10 border border-accent-purple/20">
          <Settings className="w-8 h-8 text-accent-purple" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">System Settings</h1>
          <p className="text-zinc-500">Manage your LifeOS configuration and view activity logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation / Sections */}
        <div className="space-y-4">
          <div className="p-1 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-purple/10 text-accent-purple transition-all border border-accent-purple/20">
              <History className="w-5 h-5" />
              <span className="font-medium">Activity Logs</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800/50 transition-all opacity-50 cursor-not-allowed">
              <Database className="w-5 h-5" />
              <span className="font-medium">Database Sync</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800/50 transition-all opacity-50 cursor-not-allowed">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Security</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 space-y-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-widest">System Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Database</span>
                <span className="text-green-500 font-mono text-xs">ONLINE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Sync Engine</span>
                <span className="text-green-500 font-mono text-xs">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Logs */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-100">Activity Logs</h2>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                Last 50 entries
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 space-y-2">
                <History className="w-12 h-12 opacity-10" />
                <p>No activity recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={log.id}
                    className="p-4 rounded-2xl bg-zinc-800/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            log.action === 'ADD' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-purple-500/10 text-purple-500 border-purple-500/20'
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-xs font-mono text-zinc-500">
                            {log.collection.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300 font-medium line-clamp-1 group-hover:line-clamp-none transition-all">
                          {log.details}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-600 whitespace-nowrap mt-1">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
