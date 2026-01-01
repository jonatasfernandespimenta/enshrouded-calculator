"use client";

import { useState } from "react";
import { CraftingTree } from "./crafting-tree";
import { CraftingTreeView } from "./crafting-tree-view";
import { Button } from "./ui/button";

export function CraftingVisualization() {
  const [viewMode, setViewMode] = useState<"flow" | "tree">("flow");

  return (
    <div className="flex-1 relative flex flex-col">
      {/* Toggle button */}
      <div className="absolute top-4 right-80 z-20 pointer-events-auto">
        <div className="flex gap-1 bg-[#111813]/90 backdrop-blur border border-[#28392e] rounded-lg p-1 shadow-lg">
          <Button
            variant={viewMode === "flow" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("flow")}
            className={`text-xs ${
              viewMode === "flow"
                ? "bg-[#13ec5b]/20 text-[#13ec5b] hover:bg-[#13ec5b]/30"
                : "text-[#9db9a6] hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-1">account_tree</span>
            Graph View
          </Button>
          <Button
            variant={viewMode === "tree" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("tree")}
            className={`text-xs ${
              viewMode === "tree"
                ? "bg-[#13ec5b]/20 text-[#13ec5b] hover:bg-[#13ec5b]/30"
                : "text-[#9db9a6] hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-1">list</span>
            Tree View
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "flow" ? <CraftingTree /> : <CraftingTreeView />}
    </div>
  );
}
