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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "glass-card p-6 rounded-3xl border transition-all group relative overflow-hidden",
        getStatusBorder()
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-2xl bg-zinc-950 border border-zinc-800", getStatusColor())}>
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-zinc-100 group-hover:text-accent-blue transition-colors cursor-pointer" onClick={() => onEdit(contact)}>
              {contact.name}
            </h4>
            <div className="flex gap-1 mt-1">
              {contact.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-500 border border-zinc-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-500">
            <History className="w-3.5 h-3.5" />
            Last Interaction
          </div>
          <span className={cn("font-bold", getStatusColor())}>
            {daysSince === Infinity ? 'Never' : `${daysSince}d ago`}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            Frequency
          </div>
          <span className="text-zinc-300 font-bold">Every {contact.frequency} days</span>
        </div>

        {daysSince >= contact.frequency && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase">
            <AlertCircle className="w-3.5 h-3.5" />
            Communication Overdue
          </div>
        )}
      </div>

      <button
        onClick={() => onLogInteraction(contact)}
        className="w-full py-2.5 rounded-xl bg-accent-blue/10 text-accent-blue border border-accent-blue/20 font-bold text-xs hover:bg-accent-blue hover:text-white transition-all flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Log Interaction (+20 XP)
      </button>
    </motion.div>
  );
}
