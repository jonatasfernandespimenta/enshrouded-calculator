"use client";

import { Checkbox } from "@/components/ui/checkbox";

export function MaterialsList() {
  return (
    <aside className="w-80 bg-[#111813] border-l border-[#28392e] flex flex-col shrink-0 z-20 shadow-2xl">
      <div className="p-6 border-b border-[#28392e] flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold tracking-tight text-lg">Requirements</h2>
          <button className="text-[#13ec5b] text-xs font-bold hover:underline">COPY</button>
        </div>
        
        {/* Progress Circle */}
        <div className="flex items-center gap-4 bg-[#1c2a21] p-3 rounded-lg border border-[#28392e]">
          <div className="relative size-12 shrink-0">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle
                className="stroke-current text-white/5"
                cx="18"
                cy="18"
                fill="none"
                r="16"
                strokeWidth="3"
              />
              <circle
                className="stroke-current text-[#13ec5b]"
                cx="18"
                cy="18"
                fill="none"
                r="16"
                strokeDasharray="100"
                strokeDashoffset="65"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[10px] font-bold text-white">
              35%
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Gathering Progress</span>
            <span className="text-xs text-[#9db9a6]">7/20 items collected</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* Section: Base Resources */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#9db9a6] uppercase tracking-wider mb-3">
            Raw Materials
          </h3>
          <div className="space-y-2">
            <MaterialItem name="Metal Scraps" amount={40} icon="recycling" checked />
            <MaterialItem name="Wood Logs" amount={105} icon="forest" iconBg="bg-amber-900/30" iconColor="text-amber-600" />
            <MaterialItem name="Clay" amount={50} icon="water_drop" iconBg="bg-amber-800/40" iconColor="text-amber-500" />
            <MaterialItem name="Shroud Spores" amount={20} icon="science" iconBg="bg-cyan-900/20" iconColor="text-cyan-300" />
            <MaterialItem name="Shroud Liquid" amount={20} icon="water_drop" iconBg="bg-cyan-900/20" iconColor="text-cyan-300" />
            <MaterialItem name="Dirt" amount={20} icon="landscape" />
          </div>
        </div>

        {/* Section: Intermediate */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#9db9a6] uppercase tracking-wider mb-3">
            Intermediate Crafts
          </h3>
          <div className="space-y-2">
            <IntermediateItem name="Fired Brick" amount={50} color="bg-orange-500/50" />
            <IntermediateItem name="Metal Sheets" amount={20} color="bg-slate-500/50" />
            <IntermediateItem name="Charcoal" amount={40} color="bg-stone-500/50" />
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-[#28392e] bg-[#1c2a21]/30">
        <button className="w-full h-12 rounded-lg bg-[#13ec5b] hover:bg-[#10d452] text-[#102216] font-bold text-base shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          Mark Tree as Complete
        </button>
      </div>
    </aside>
  );
}

function MaterialItem({
  name,
  amount,
  icon = "recycling",
  iconBg = "bg-stone-800",
  iconColor = "text-stone-400",
  checked = false,
}: {
  name: string;
  amount: number;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  checked?: boolean;
}) {
  return (
    <div className="group flex items-center justify-between p-2 rounded hover:bg-[#1c2a21] transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <Checkbox
          defaultChecked={checked}
          className="rounded bg-[#1c2a21] border-[#9db9a6]/30 data-[state=checked]:bg-[#13ec5b] data-[state=checked]:border-[#13ec5b] size-4"
        />
        <span className={`text-sm ${checked ? "text-[#9db9a6] line-through" : "text-white"} group-hover:text-white transition-colors`}>
          {name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-mono ${checked ? "text-[#9db9a6]" : "text-white"} group-hover:text-white`}>
          {amount}
        </span>
        <div className={`size-6 ${iconBg} rounded flex items-center justify-center`}>
          <span className={`material-symbols-outlined text-[14px] ${iconColor}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function IntermediateItem({
  name,
  amount,
  color,
}: {
  name: string;
  amount: number;
  color: string;
}) {
  return (
    <div className="group flex items-center justify-between p-2 rounded hover:bg-[#1c2a21] transition-colors cursor-pointer opacity-70">
      <div className="flex items-center gap-3">
        <span className={`size-2 rounded-full ${color}`} />
        <span className="text-white text-sm">{name}</span>
      </div>
      <span className="text-sm text-white font-mono">x{amount}</span>
    </div>
  );
}
