'use client';

import { motion } from 'framer-motion';
import { User, Calendar, MessageSquare, History, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  tags: string[];
  frequency: number;
  lastInteraction?: any; // Firestore Timestamp
}

interface ContactCardProps {
  contact: Contact;
  onLogInteraction: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
}

export default function ContactCard({ contact, onLogInteraction, onEdit }: ContactCardProps) {
  const getLastInteractionDate = () => {
    if (!contact.lastInteraction) return null;
    return contact.lastInteraction.toDate ? contact.lastInteraction.toDate() : new Date(contact.lastInteraction);
  };

  const lastDate = getLastInteractionDate();
  const daysSince = lastDate ? Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;
  
  const getStatusColor = () => {
    if (daysSince === Infinity) return 'text-zinc-500';
    if (daysSince >= contact.frequency) return 'text-red-500';
    if (daysSince >= contact.frequency * 0.7) return 'text-yellow-500';
    return 'text-accent-green';
  };

  const getStatusBorder = () => {
    if (daysSince === Infinity) return 'border-zinc-800';
    if (daysSince >= contact.frequency) return 'border-red-500/30';
    if (daysSince >= contact.frequency * 0.7) return 'border-yellow-500/30';
    return 'border-accent-green/30';
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      className={cn(
        "glass-card p-6 rounded-[32px] border transition-all group relative overflow-hidden",
        getStatusBorder().includes('green') ? "border-emerald-500/20 shadow-emerald-500/5" : 
        getStatusBorder().includes('red') ? "border-rose-500/20 shadow-rose-500/5" :
        getStatusBorder().includes('yellow') ? "border-amber-500/20 shadow-amber-500/5" :
        "border-white/[0.05]"
      )}
    >
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3.5 rounded-2xl border transition-colors",
            getStatusColor().includes('green') ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
            getStatusColor().includes('red') ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
            getStatusColor().includes('yellow') ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
            "bg-white/[0.02] border-white/[0.05] text-zinc-500"
          )}>
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-lg text-zinc-100 group-hover:text-brand-primary transition-colors cursor-pointer truncate tracking-tight" onClick={() => onEdit(contact)}>
              {contact.name}
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {contact.tags.map(tag => (
                <span key={tag} className="text-[8px] uppercase font-black px-2 py-1 rounded-lg bg-white/[0.03] text-zinc-500 border border-white/[0.05] tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2.5 text-zinc-600 font-bold uppercase tracking-widest">
            <History className="w-3.5 h-3.5" />
            Last Link
          </div>
          <span className={cn("font-black tracking-tight", 
            getStatusColor().includes('green') ? "text-emerald-400" :
            getStatusColor().includes('red') ? "text-rose-400" :
            getStatusColor().includes('yellow') ? "text-amber-400" :
            "text-zinc-500"
          )}>
            {daysSince === Infinity ? 'OFFLINE' : `${daysSince}D AGO`}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2.5 text-zinc-600 font-bold uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" />
            Sync Rate
          </div>
          <span className="text-zinc-300 font-black tracking-tight">EVERY {contact.frequency}D</span>
        </div>

        {daysSince >= contact.frequency && (
          <motion.div 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-[0.1em]"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Operational Sync Overdue
          </motion.div>
        )}
      </div>

      <button
        onClick={() => onLogInteraction(contact)}
        className="w-full py-3.5 rounded-[18px] bg-brand-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
      >
        <MessageSquare className="w-4 h-4 fill-white/10" />
        Record Interaction
      </button>
      
      {/* Dynamic Glow */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-24 h-24 blur-[40px] opacity-20 pointer-events-none transition-colors duration-1000",
        getStatusColor().includes('green') ? "bg-emerald-500" :
        getStatusColor().includes('red') ? "bg-rose-500" :
        getStatusColor().includes('yellow') ? "bg-amber-500" :
        "bg-transparent"
      )} />
    </motion.div>
  );
}
