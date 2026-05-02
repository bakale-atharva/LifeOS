'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Users, Plus, Loader2, Sparkles, X, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDocument, getDocuments, updateDocument, deleteDocument } from '@/lib/firestoreUtils';
import ContactCard from '@/components/relationships/ContactCard';
import ContactModal from '@/components/relationships/ContactModal';
import InteractionModal from '@/components/relationships/InteractionModal';

interface Contact {
  id: string;
  name: string;
  tags: string[];
  frequency: number;
  lastInteraction?: any;
}

interface Toast {
  id: string;
  message: string;
  xp?: number;
}

export default function RelationshipsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const addXP = useStore(state => state.addXP);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getDocuments('contacts');
      setContacts(data as Contact[]);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, xp?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, xp }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSaveContact = async (data: Partial<Contact>) => {
    try {
      if (editingContact) {
        await updateDocument('contacts', editingContact.id, data);
        showToast(`Updated ${data.name}`);
      } else {
        await addDocument('contacts', data);
        addXP(50);
        showToast(`Added ${data.name}`, 50);
      }
      await fetchContacts();
      setIsContactModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteDocument('contacts', id);
      showToast("Contact deleted");
      await fetchContacts();
      setIsContactModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleLogInteraction = async (interactionData: { type: string, notes: string }) => {
    if (!activeContact) return;
    
    try {
      const now = new Date();
      // 1. Add interaction record
      await addDocument('interactions', {
        contactId: activeContact.id,
        ...interactionData,
        date: now
      });

      // 2. Update contact's lastInteraction
      await updateDocument('contacts', activeContact.id, {
        lastInteraction: now
      });

      addXP(20);
      showToast(`Logged interaction with ${activeContact.name}`, 20);
      
      await fetchContacts();
      setIsInteractionModalOpen(false);
      setActiveContact(null);
    } catch (error) {
      console.error("Error logging interaction:", error);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-7xl mx-auto relative min-h-screen"
    >
      {/* Toasts */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-card px-6 py-4 rounded-2xl border-brand-primary/30 bg-[#1E293B]/80 shadow-2xl flex items-center gap-4 min-w-[300px]"
            >
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-zinc-100">{toast.message}</p>
                {toast.xp && <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">+{toast.xp} XP Earned</p>}
              </div>
              <button onClick={() => setToasts(toasts.filter(t => t.id !== toast.id))}>
                <X className="w-4 h-4 text-zinc-500 hover:text-zinc-100" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-zinc-100 flex items-center gap-4">
            <Users className="text-brand-primary w-10 h-10" />
            SOCIAL_HEALTH
          </h2>
          <p className="text-zinc-500 mt-2 text-[10px] font-mono uppercase tracking-[0.3em]">Manage your connections and maintain interaction loops.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter database..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white/[0.02] border border-white/[0.05] rounded-[18px] py-3 pl-12 pr-6 focus:outline-none focus:border-brand-primary transition-all w-64 text-sm font-medium"
            />
          </div>
          <button 
            onClick={() => {
              setEditingContact(null);
              setIsContactModalOpen(true);
            }}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20"
          >
            <Plus className="w-4 h-4" />
            Initialize
          </button>
        </div>
      </header>

      {loading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] animate-pulse">Syncing social database...</p>
        </div>
      ) : (
        <>
          {filteredContacts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredContacts.map((contact, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={contact.id}
                >
                  <ContactCard 
                    contact={contact} 
                    onLogInteraction={(c) => {
                      setActiveContact(c);
                      setIsInteractionModalOpen(true);
                    }}
                    onEdit={(c) => {
                      setEditingContact(c);
                      setIsContactModalOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="h-[40vh] border border-dashed border-white/[0.05] rounded-[40px] flex flex-col items-center justify-center text-zinc-700 gap-6 opacity-40">
              <Users className="w-12 h-12" />
              <p className="font-bold uppercase tracking-[0.3em] text-[9px]">No records found in database</p>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={handleSaveContact}
        onDelete={handleDeleteContact}
        initialData={editingContact}
      />

      <InteractionModal 
        isOpen={isInteractionModalOpen}
        onClose={() => setIsInteractionModalOpen(false)}
        onLog={handleLogInteraction}
        contact={activeContact}
      />
    </motion.div>
  );
}
