"use client";

import { 
  LayoutDashboard, 
  CheckSquare, 
  TrendingUp,
  Users,
  User,
  Menu,
  X,
  Calendar,
  Settings,
  FolderRoot,
  Zap,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Shell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const bottomNavItems = [
    { icon: LayoutDashboard, href: "/", label: "Dashboard" },
    { icon: CheckSquare, href: "/goals", label: "Quests" },
    { icon: TrendingUp, href: "/health", label: "Growth (Stats)" },
    { icon: Users, href: "#", label: "Social" },
    { icon: User, href: "/profile", label: "Profile" },
  ];

  const sidebarItems = [
    { icon: Calendar, href: "#", label: "Calendar" },
    { icon: FolderRoot, href: "#", label: "Projects" },
    { icon: Settings, href: "/profile", label: "Settings" },
  ];

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#05070a] text-white font-sans overflow-x-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-[#0a0d14] border-r border-white/5 z-50 transform transition-transform duration-300 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-ascend-gold rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-[#05070a]" fill="currentColor" />
              </div>
              <span className="text-ascend text-sm tracking-widest text-ascend-gold">LifeOS</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <div className="text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase mb-4 px-2">General</div>
            {sidebarItems.map((item) => (
              <Link 
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5 group"
              >
                <div className="flex items-center space-x-4">
                  <item.icon size={20} className="group-hover:text-ascend-gold transition-colors" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
             <div className="flex items-center space-x-3 p-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 overflow-hidden border border-white/10">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Julian" alt="Profile" />
                </div>
                <div>
                  <p className="text-sm font-bold">Julian Dubois</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Level 7 Pathfinder</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative pb-24">
        {/* Header */}
        <header className="pt-12 pb-8 flex flex-col items-center justify-center space-y-1 relative">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-8 top-12 p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <h1 className="text-4xl md:text-5xl text-ascend text-ascend-gold gold-glow">ASCEND</h1>
          <p className="text-[10px] md:text-xs tracking-[0.5em] text-gray-500 font-medium uppercase">Navigate your existence</p>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8">
          {children}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-2xl z-30">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'text-ascend-gold bg-ascend-gold/5' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <item.icon size={20} className={`${isActive ? 'text-ascend-gold' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`} />
                <span className={`text-xs font-bold tracking-wider hidden md:block ${isActive ? 'text-ascend-gold' : 'text-gray-500 group-hover:text-gray-300'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
