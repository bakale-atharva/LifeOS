'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Tag, Clock, Save, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
  id?: string;
  name: string;
  tags: string[];
  frequency: number;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Partial<Contact>) => void;
  onDelete?: (id: string) => void;
  initialData?: Contact | null;
}

export default function ContactModal({ isOpen, onClose, onSave, onDelete, initialData }: ContactModalProps) {
  const [formData, setFormData] = useState<Partial<Contact>>({ name: '', tags: [], frequency: 7 });
  const [tagInput, setTagInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', tags: [], frequency: 7 });
    }
  }, [initialData, isOpen]);

  const handleAddTag = () => {
    if (tagInput && !formData.tags?.includes(tagInput)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  const handleDelete = () => {
    if (confirmDelete) {
      if (initialData?.id && onDelete) onDelete(initialData.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
                    <User className="text-accent-blue w-6 h-6" />
                    {initialData ? 'Edit Contact' : 'New Contact'}
                  </h3>
                  <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-blue transition-colors text-zinc-100"
                      placeholder="Full Name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags?.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-700">
                          {tag}
                          <button onClick={() => removeTag(tag)}><X className="w-3 h-3 hover:text-red-500" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-blue transition-colors text-zinc-100 text-sm"
                        placeholder="Add tag (e.g. Family)"
                      />
                      <button onClick={handleAddTag} className="p-3 bg-zinc-800 rounded-xl border border-zinc-700 hover:border-accent-blue transition-colors">
                        <Tag className="w-5 h-5 text-zinc-400" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Frequency (Days)</label>
                    <div className="flex items-center gap-4">
                      <Clock className="text-zinc-500 w-5 h-5" />
                      <input
                        type="number"
                        value={formData.frequency}
                        onChange={e => setFormData({ ...formData, frequency: parseInt(e.target.value) || 0 })}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-blue transition-colors text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => onSave(formData)}
                      className="flex-1 bg-accent-blue py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent-blue/90 transition-all shadow-lg shadow-accent-blue/20"
                    >
                      <Save className="w-4 h-4" />
                      Save Contact
                    </button>
                    {initialData?.id && onDelete && (
                      <button
                        onClick={handleDelete}
                        className={cn(
                          "p-3 rounded-xl border transition-all flex items-center gap-2",
                          confirmDelete 
                            ? "bg-red-500 text-white border-red-500" 
                            : "border-red-500/20 text-red-500 hover:bg-red-500/10"
                        )}
                      >
                        <Trash2 className="w-5 h-5" />
                        {confirmDelete && <span className="text-xs font-bold uppercase">Confirm?</span>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
