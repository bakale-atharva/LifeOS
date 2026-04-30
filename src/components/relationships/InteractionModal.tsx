'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Phone, Mail, Users, Send } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
}

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (data: { type: string, notes: string }) => void;
  contact: Contact | null;
}

const INTERACTION_TYPES = [
  { id: 'call', label: 'Phone Call', icon: Phone },
  { id: 'text', label: 'Text/DM', icon: MessageSquare },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'meeting', label: 'In-Person', icon: Users },
];

export default function InteractionModal({ isOpen, onClose, onLog, contact }: InteractionModalProps) {
  const [selectedType, setSelectedType] = useState('text');
  const [notes, setNotes] = useState('');

  return (
    <AnimatePresence>
      {isOpen && contact && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[120] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <div className="glass-card p-8 rounded-3xl border-accent-blue/30 bg-zinc-900/90 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <MessageSquare className="text-accent-blue w-6 h-6" />
                  Log Interaction
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <div className="mb-6">
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-2">Target Contact</div>
                <div className="text-xl font-bold text-zinc-100">{contact.name}</div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Interaction Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {INTERACTION_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-medium ${
                          selectedType === type.id 
                            ? 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Notes</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-accent-blue transition-colors text-zinc-100 h-28 text-sm"
                    placeholder="Brief summary of the interaction..."
                  />
                </div>

                <button
                  onClick={() => onLog({ type: selectedType, notes })}
                  className="w-full bg-accent-blue py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-accent-blue/90 transition-all shadow-lg shadow-accent-blue/20 mt-4"
                >
                  <Send className="w-4 h-4" />
                  Submit Interaction (+20 XP)
                </button>
              </div>
            </div>
          </motion.div>
          </div>
          </>
          )}
          </AnimatePresence>  );
}
