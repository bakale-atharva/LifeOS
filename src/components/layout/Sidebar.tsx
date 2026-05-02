'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Target, 
  Clock, 
  HeartPulse, 
  Users, 
  Wallet,
  LayoutDashboard,
  Swords,
  UserCircle,
  ShieldAlert,
  Settings,
  Zap,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Zap, label: 'Combat Arena', href: '/combat' },
  { icon: ShieldAlert, label: 'Quests', href: '/quests' },
  { icon: Target, label: 'GPS (Goals)', href: '/gps' },
  { icon: Clock, label: 'Time Management', href: '/time' },
  { icon: HeartPulse, label: 'Health OS', href: '/health' },
  { icon: Users, label: 'Relationships', href: '/relationships' },
  { icon: Wallet, label: 'Finance', href: '/finance' },
  { icon: Package, label: 'Armory', href: '/inventory' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-white/[0.05] h-[calc(100vh-64px)] bg-[#0B0B0B]/40 backdrop-blur-xl flex flex-col p-4 gap-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
              isActive 
                ? "bg-brand-primary/10 text-brand-primary shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]" 
                : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-100"
            )}>
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-brand-primary rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                isActive ? "text-brand-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              <span className={cn(
                "font-semibold tracking-tight transition-colors duration-300",
                isActive ? "text-brand-primary" : "group-hover:text-zinc-100"
              )}>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
