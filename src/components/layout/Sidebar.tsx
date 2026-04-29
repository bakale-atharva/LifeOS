'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Target, 
  Clock, 
  HeartPulse, 
  Users, 
  Wallet,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Target, label: 'GPS (Goals)', href: '/gps' },
  { icon: Clock, label: 'Time Management', href: '/time' },
  { icon: HeartPulse, label: 'Health OS', href: '/health' },
  { icon: Users, label: 'Relationships', href: '/relationships' },
  { icon: Wallet, label: 'Finance', href: '/finance' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-zinc-800 h-[calc(100vh-64px)] bg-zinc-950 flex flex-col p-4 gap-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
              isActive ? "bg-accent-purple/10 text-accent-purple" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            )}>
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-accent-purple rounded-r-full"
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-accent-purple" : "text-zinc-500"
              )} />
              <span className="font-medium">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
