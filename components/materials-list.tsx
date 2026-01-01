"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/lib/store";

export function MaterialsList() {
  const craftingResult = useAppStore((state) => state.craftingResult);
  const selectedItem = useAppStore((state) => state.selectedItem);
  const showBaseMaterialsOnly = useAppStore((state) => state.showBaseMaterialsOnly);
  const toggleBaseMaterialsOnly = useAppStore((state) => state.toggleBaseMaterialsOnly);
  const collectedMaterials = useAppStore((state) => state.collectedMaterials);
  const toggleMaterialCollected = useAppStore((state) => state.toggleMaterialCollected);
  const getCollectionProgress = useAppStore((state) => state.getCollectionProgress);

  if (!selectedItem || !craftingResult) {
    return (
      <aside className="w-80 bg-[#111813] border-l border-[#28392e] flex flex-col shrink-0 z-20 shadow-2xl">
        <div className="p-6 flex items-center justify-center h-full">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-[#9db9a6] mb-4 block">inventory_2</span>
            <p className="text-[#9db9a6] text-sm">Select an item to see materials</p>
          </div>
        </div>
      </aside>
    );
  }

  const materials = showBaseMaterialsOnly
    ? craftingResult.baseMaterialsOnly
    : craftingResult.totals;

  const progress = getCollectionProgress();

  // Separate base materials and intermediate crafts
  const baseMaterials = Object.entries(materials).filter(([_, data]) => data.isBaseMaterial);
  const intermediateCrafts = Object.entries(craftingResult.totals).filter(
    ([_, data]) => !data.isBaseMaterial && data.station
  );

  return (
    <aside className="w-80 bg-[#111813] border-l border-[#28392e] flex flex-col shrink-0 z-20 shadow-2xl">
      <div className="p-6 border-b border-[#28392e] flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold tracking-tight text-lg">Requirements</h2>
          <button
            className="text-[#13ec5b] text-xs font-bold hover:underline"
            onClick={() => {
              const text = baseMaterials
                .map(([_, data]) => `${data.itemName}: ${data.quantity}`)
                .join("\n");
              navigator.clipboard.writeText(text);
            }}
          >
            COPY
          </button>
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
                strokeDashoffset={100 - progress.percentage}
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[10px] font-bold text-white">
              {progress.percentage}%
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Gathering Progress</span>
            <span className="text-xs text-[#9db9a6]">
              {progress.collected}/{progress.total} items collected
            </span>
          </div>
        </div>
        
        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={showBaseMaterialsOnly}
            onCheckedChange={toggleBaseMaterialsOnly}
            className="rounded bg-[#1c2a21] border-[#9db9a6]/30 data-[state=checked]:bg-[#13ec5b] data-[state=checked]:border-[#13ec5b]"
          />
          <label className="text-sm text-white cursor-pointer" onClick={toggleBaseMaterialsOnly}>
            Base materials only
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* Section: Base Resources */}
        {baseMaterials.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#9db9a6] uppercase tracking-wider mb-3">
              Raw Materials
            </h3>
            <div className="space-y-2">
              {baseMaterials.map(([itemId, data]) => (
                <MaterialItem
                  key={itemId}
                  itemId={itemId}
                  name={data.itemName}
                  amount={data.quantity}
                  checked={collectedMaterials.has(itemId)}
                  onToggle={() => toggleMaterialCollected(itemId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section: Intermediate Crafts */}
        {!showBaseMaterialsOnly && intermediateCrafts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#9db9a6] uppercase tracking-wider mb-3">
              Intermediate Crafts
            </h3>
            <div className="space-y-2">
              {intermediateCrafts.map(([itemId, data]) => (
                <IntermediateItem
                  key={itemId}
                  name={data.itemName}
                  amount={data.quantity}
                  station={data.station}
                />
              ))}
            </div>
          </div>
        )}
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
  itemId,
  name,
  amount,
  checked = false,
  onToggle,
}: {
  itemId: string;
  name: string;
  amount: number;
  checked?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="group flex items-center justify-between p-2 rounded hover:bg-[#1c2a21] transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={onToggle}
          className="rounded bg-[#1c2a21] border-[#9db9a6]/30 data-[state=checked]:bg-[#13ec5b] data-[state=checked]:border-[#13ec5b] size-4"
        />
        <span
          className={`text-sm ${checked ? "text-[#9db9a6] line-through" : "text-white"} group-hover:text-white transition-colors`}
        >
          {name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-mono ${checked ? "text-[#9db9a6]" : "text-white"} group-hover:text-white`}>
          {amount}
        </span>
        <div className="size-6 bg-stone-800 rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-[14px] text-stone-400">inventory_2</span>
        </div>
      </div>
    </div>
  );
}

function IntermediateItem({
  name,
  amount,
  station,
}: {
  name: string;
  amount: number;
  station?: string;
}) {
  const stationColors: Record<string, string> = {
    forge: "bg-orange-500/50",
    kiln: "bg-red-500/50",
    alchemist: "bg-purple-500/50",
    blacksmith: "bg-slate-500/50",
    smelter: "bg-yellow-500/50",
  };

  const color = station ? stationColors[station] || "bg-gray-500/50" : "bg-gray-500/50";

  return (
    <div className="group flex items-center justify-between p-2 rounded hover:bg-[#1c2a21] transition-colors cursor-pointer opacity-70">
      <div className="flex items-center gap-3">
        <span className={`size-2 rounded-full ${color}`} />
        <div className="flex flex-col">
          <span className="text-white text-sm">{name}</span>
          {station && <span className="text-[#9db9a6] text-[10px] capitalize">{station}</span>}
        </div>
      </div>
      <span className="text-sm text-white font-mono">x{amount}</span>
    </div>
  );
}
