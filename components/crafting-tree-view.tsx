"use client";

import { useAppStore } from "@/lib/store";
import type { CraftingTreeNode } from "@/lib/resolveCrafting";
import { Input } from "./ui/input";

export function CraftingTreeView() {
  const selectedItem = useAppStore((state) => state.selectedItem);
  const craftingResult = useAppStore((state) => state.craftingResult);
  const targetQuantity = useAppStore((state) => state.targetQuantity);
  const setTargetQuantity = useAppStore((state) => state.setTargetQuantity);
  const expandedNodes = useAppStore((state) => state.expandedNodes);
  const toggleNodeExpanded = useAppStore((state) => state.toggleNodeExpanded);
  const expandAll = useAppStore((state) => state.expandAll);
  const collapseAll = useAppStore((state) => state.collapseAll);

  if (!selectedItem || !craftingResult) {
    return (
      <main className="flex-1 bg-[#0b100d] relative overflow-hidden flex flex-col items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-8xl text-[#9db9a6] mb-6 block opacity-50">
            account_tree
          </span>
          <h2 className="text-white text-2xl font-bold mb-2">No Item Selected</h2>
          <p className="text-[#9db9a6] text-sm max-w-md">
            Select an item from the sidebar or search to see the crafting tree
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#0b100d] relative overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
        <div className="pointer-events-auto bg-[#111813]/90 backdrop-blur-md border border-[#28392e] rounded-lg p-4 shadow-xl max-w-2xl">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-md bg-gradient-to-br from-purple-900 to-indigo-900 border border-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/20">
              <span className="material-symbols-outlined text-white text-3xl">auto_fix</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white leading-none mb-1">
                {selectedItem.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-[#9db9a6] font-body mb-3">
                {selectedItem.category && (
                  <>
                    <span className="bg-[#13ec5b]/20 text-[#13ec5b] px-1.5 py-0.5 rounded">
                      {selectedItem.category}
                    </span>
                    <span>•</span>
                  </>
                )}
                <span>Craftable</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#9db9a6]">Quantity:</label>
                <Input
                  type="number"
                  min="1"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 h-8 bg-[#1c2a21] border-[#28392e] text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={expandAll}
            className="bg-[#111813] border border-[#28392e] text-[#9db9a6] hover:text-white hover:border-[#13ec5b] px-3 py-2 rounded-lg shadow-lg transition-all text-sm font-medium"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="bg-[#111813] border border-[#28392e] text-[#9db9a6] hover:text-white hover:border-[#13ec5b] px-3 py-2 rounded-lg shadow-lg transition-all text-sm font-medium"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto custom-scrollbar pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          <TreeNodeComponent node={craftingResult.tree} isRoot={true} />
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-[#111813]/90 backdrop-blur border border-[#28392e] p-3 rounded-lg flex flex-col gap-2 z-10">
        <div className="text-[10px] uppercase tracking-wide text-[#9db9a6] font-bold mb-1">
          Tree Legend
        </div>
        <div className="flex items-center gap-2 text-xs text-white">
          <div className="size-3 rounded-full bg-[#111813] border-2 border-[#13ec5b] shadow-[0_0_5px_rgba(19,236,91,0.5)]" />
          <span>Target Item</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white">
          <div className="size-3 rounded-sm bg-[#1c2a21] border border-[#28392e]" />
          <span>Sub-Craft</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white">
          <div className="size-3 rounded-sm bg-[#111813] border border-dashed border-[#28392e]" />
          <span>Raw Material</span>
        </div>
      </div>
    </main>
  );
}

function TreeNodeComponent({
  node,
  isRoot = false,
  depth = 0,
}: {
  node: CraftingTreeNode;
  isRoot?: boolean;
  depth?: number;
}) {
  const expandedNodes = useAppStore((state) => state.expandedNodes);
  const toggleNodeExpanded = useAppStore((state) => state.toggleNodeExpanded);

  const isExpanded = expandedNodes.has(node.itemId);
  const hasChildren = node.children.length > 0;

  const getNodeStyle = () => {
    if (isRoot) {
      return "bg-[#111813] border-2 border-[#13ec5b] shadow-[0_0_15px_rgba(19,236,91,0.2)]";
    }
    if (node.isBaseMaterial) {
      return "bg-[#111813] border border-dashed border-[#28392e]";
    }
    return "bg-[#1c2a21] border border-[#28392e] hover:border-[#9db9a6]";
  };

  const getStationColor = (station?: string) => {
    const colors: Record<string, string> = {
      forge: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      kiln: "text-green-400 bg-green-500/10 border-green-500/20",
      alchemist: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      blacksmith: "text-slate-400 bg-slate-500/10 border-slate-500/20",
      smelter: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    };
    return station ? colors[station] || "text-blue-400 bg-blue-500/10 border-blue-500/20" : "";
  };

  return (
    <div className="mb-4">
      {/* Node Card */}
      <div
        className={`${getNodeStyle()} rounded-xl p-4 transition-all ${
          hasChildren ? "cursor-pointer" : ""
        }`}
        onClick={() => hasChildren && toggleNodeExpanded(node.itemId)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {hasChildren && (
              <span
                className={`material-symbols-outlined text-[#9db9a6] transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              >
                chevron_right
              </span>
            )}
            <div className="size-10 rounded bg-[#1c2a21] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#13ec5b]">
                {node.isBaseMaterial ? "inventory_2" : "auto_fix"}
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white truncate">{node.itemName}</span>
                {isRoot && (
                  <span className="text-[10px] text-[#9db9a6] uppercase tracking-wider shrink-0">
                    Target
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9db9a6] mt-1">
                <span>Need: {node.requiredQuantity}</span>
                {!node.isBaseMaterial && (
                  <>
                    <span>•</span>
                    <span>Per Craft: {node.perCraft}</span>
                    <span>•</span>
                    <span>Crafts: {node.craftsNeeded}x</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div
              className={`${
                isRoot ? "bg-[#13ec5b] text-[#102216]" : "bg-[#1c2a21] text-white"
              } font-bold px-3 py-1 rounded text-sm`}
            >
              x{node.requiredQuantity}
            </div>
            {node.station && (
              <span
                className={`px-2 py-0.5 text-[10px] rounded border font-medium ${getStationColor(
                  node.station
                )}`}
              >
                {node.station}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-4 space-y-4 border-l-2 border-[#28392e] pl-4">
          {node.children.map((child) => (
            <TreeNodeComponent key={child.itemId} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
