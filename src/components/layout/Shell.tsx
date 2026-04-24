"use client";

import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Settings,
  User,
  Heart,
  ChevronLeft,
  Menu,
  Zap,
  FolderRoot
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [profile, setProfile] = useState({
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian"
  });

  useEffect(() => {
    return onSnapshot(doc(db, "profiles", "default"), (doc) => {
      if (doc.exists()) setProfile(doc.data() as any);
    });
  }, []);

  const navItems = [
    { icon: LayoutDashboard, href: "/", label: "Dashboard" },
    { icon: CheckSquare, href: "/goals", label: "Goals" },
    { icon: Heart, href: "/health", label: "Health" },
    { icon: User, href: "/profile", label: "Profile" },
    { icon: Calendar, href: "#", label: "Calendar" },
    { icon: FolderRoot, href: "#", label: "Projects" },
    { icon: Settings, href: "/profile", label: "Settings" },
  ];

  return (
    <div className="h-screen w-screen flex bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className={`${isExpanded ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col items-center py-8 border-r border-white/5 space-y-8 z-20 bg-[#0d1117]`}>
        <div className="w-full px-4 flex items-center justify-between">
          <div className={`w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)] flex-shrink-0 ${!isExpanded && 'mx-auto'}`}>
            <Zap className="text-gray-900" size={24} />
          </div>
          {isExpanded && <span className="font-bold text-xl tracking-tighter text-teal-400 ml-3 flex-1">LifeOS</span>}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 flex flex-col space-y-2 w-full px-4">
          {navItems.map((item) => (
            <Link 
              key={item.label}
              href={item.href} 
              className={`flex items-center p-3 rounded-xl transition-all duration-300 group ${pathname === item.href ? 'text-teal-400 bg-teal-500/10 border-l-2 border-teal-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={22} className="flex-shrink-0" />
              {isExpanded && <span className="ml-4 font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="w-full px-4 mt-auto">
          <Link href="/profile" className={`flex items-center p-2 rounded-xl hover:bg-white/5 transition-all ${!isExpanded && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 overflow-hidden flex-shrink-0">
               <img src={profile.avatarUrl} alt="Profile" />
            </div>
            {isExpanded && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold truncate">User Profile</p>
                <p className="text-[10px] text-gray-500 uppercase">View Details</p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
