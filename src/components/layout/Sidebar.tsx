"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Swords, 
  Timer, 
  HeartPulse, 
  Users, 
  Wallet,
  ShoppingBag,
  Settings,
  Terminal
} from "lucide-react";

const menuItems = [
  { name: "Terminal", href: "/", icon: LayoutDashboard },
  { name: "Combat", href: "/quests", icon: Swords },
  { name: "Alchemy", href: "/focus", icon: Timer },
  { name: "Vitality", href: "/health", icon: HeartPulse },
  { name: "Charisma", href: "/relationships", icon: Users },
  { name: "Wealth", href: "/finance", icon: Wallet },
  { name: "Black Market", href: "/shop", icon: ShoppingBag },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r bg-background/20 backdrop-blur-xl hidden md:flex flex-col h-[calc(100vh-80px)] sticky top-20">
      <div className="p-6 flex-1 space-y-8">
        <div className="space-y-4">
          <p className="px-3 text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">Navigation</p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden",
                    isActive 
                      ? "text-primary italic" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1 h-5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                  )}
                  <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className="tracking-tight uppercase">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto">
                      <Terminal className="h-3 w-3 opacity-50" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <p className="px-3 text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">Active Buffs</p>
          <div className="space-y-2 px-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-green-400/80">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              SYSTEM STABLE
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400/80">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              NEURAL SYNC: 98%
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-white/5 bg-white/[0.02]">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-muted-foreground hover:text-foreground transition-colors text-xs font-bold uppercase tracking-widest">
          <Settings className="h-4 w-4" />
          Config Settings
        </button>
      </div>
    </aside>
  );
}
