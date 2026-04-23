"use client";

import { QuestBuilder } from "@/components/game/QuestBuilder";
import { QuestList } from "@/components/game/QuestList";
import { Swords, Info } from "lucide-react";

export default function QuestsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Swords className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-[10px] font-black tracking-[0.3em] text-red-500 uppercase">Mission Control</h2>
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">Quest Log: Combat</h1>
          <p className="text-muted-foreground font-medium max-w-md">Bridge the gap between vision and action using the GPS framework.</p>
        </div>
        
        <QuestBuilder />
      </header>

      <div className="grid gap-8">
        {/* GPS Logic Tooltip */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-4 items-start">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest">GPS Intelligence Briefing</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">[G] GOAL:</span> Specific target and lore. <br />
              <span className="font-bold text-foreground">[P] PLAN:</span> Map your major moves and anticipate hazards. <br />
              <span className="font-bold text-foreground">[S] SYSTEM:</span> Your daily attack pattern to chip away at Boss HP.
            </p>
          </div>
        </div>

        <QuestList />
      </div>
    </div>
  );
}
