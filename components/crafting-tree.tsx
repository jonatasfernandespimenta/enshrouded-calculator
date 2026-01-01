"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CraftingNode } from "./nodes/crafting-node";

const nodeTypes = {
  crafting: CraftingNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "crafting",
    position: { x: 400, y: 50 },
    data: {
      name: "Spire Teleport",
      quantity: 1,
      icon: "castle",
      iconBg: "bg-indigo-900/50",
      iconColor: "text-indigo-300",
      status: "target",
      craftStation: "Alchemist",
      progress: "100% Ready",
    },
  },
  // Level 2
  {
    id: "2",
    type: "crafting",
    position: { x: 100, y: 200 },
    data: {
      name: "Metal Sheets",
      quantity: 20,
      required: 10,
      icon: "grid_on",
      iconBg: "bg-slate-700/50",
      iconColor: "text-slate-300",
      status: "subcraft",
      craftStation: "Forge",
    },
  },
  {
    id: "3",
    type: "crafting",
    position: { x: 400, y: 200 },
    data: {
      name: "Fired Brick",
      quantity: 50,
      required: 20,
      icon: "filter_hdr",
      iconBg: "bg-red-900/30",
      iconColor: "text-red-400",
      status: "subcraft",
      craftStation: "Kiln",
    },
  },
  {
    id: "4",
    type: "crafting",
    position: { x: 700, y: 200 },
    data: {
      name: "Shroud Core",
      quantity: 2,
      required: 2,
      icon: "all_inclusive",
      iconBg: "bg-cyan-900/30",
      iconColor: "text-cyan-400",
      status: "subcraft",
      craftStation: "Alchemist",
    },
  },
  // Level 3
  {
    id: "5",
    type: "crafting",
    position: { x: 20, y: 350 },
    data: {
      name: "Metal Scraps",
      quantity: 40,
      icon: "recycling",
      iconBg: "bg-stone-800",
      iconColor: "text-stone-400",
      status: "raw",
      source: "Loot",
    },
  },
  {
    id: "6",
    type: "crafting",
    position: { x: 180, y: 350 },
    data: {
      name: "Charcoal",
      quantity: 40,
      icon: "local_fire_department",
      iconBg: "bg-gray-800",
      iconColor: "text-gray-400",
      status: "subcraft",
      craftStation: "Kiln",
    },
  },
  {
    id: "7",
    type: "crafting",
    position: { x: 320, y: 350 },
    data: {
      name: "Clay Lump",
      quantity: 50,
      icon: "water_drop",
      iconBg: "bg-amber-800/40",
      iconColor: "text-amber-500",
      status: "raw",
      source: "Gather",
    },
  },
  {
    id: "8",
    type: "crafting",
    position: { x: 460, y: 350 },
    data: {
      name: "Wood Logs",
      quantity: 25,
      icon: "forest",
      iconBg: "bg-amber-900/30",
      iconColor: "text-amber-600",
      status: "raw",
      source: "Gather",
    },
  },
  {
    id: "9",
    type: "crafting",
    position: { x: 620, y: 350 },
    data: {
      name: "Shroud Spores",
      quantity: 20,
      icon: "science",
      iconBg: "bg-cyan-900/20",
      iconColor: "text-cyan-300",
      status: "raw",
      source: "Loot",
    },
  },
  {
    id: "10",
    type: "crafting",
    position: { x: 780, y: 350 },
    data: {
      name: "Shroud Liquid",
      quantity: 20,
      icon: "water_drop",
      iconBg: "bg-cyan-900/20",
      iconColor: "text-cyan-300",
      status: "raw",
      source: "Gather",
    },
  },
  // Level 4
  {
    id: "11",
    type: "crafting",
    position: { x: 140, y: 500 },
    data: {
      name: "Wood Logs",
      quantity: 80,
      icon: "forest",
      iconBg: "bg-amber-900/30",
      iconColor: "text-amber-600",
      status: "raw",
      source: "Gather",
    },
  },
  {
    id: "12",
    type: "crafting",
    position: { x: 240, y: 500 },
    data: {
      name: "Dirt",
      quantity: 20,
      icon: "landscape",
      iconBg: "bg-stone-800",
      iconColor: "text-stone-500",
      status: "raw",
      source: "Gather",
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#28392e" } },
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "#28392e" } },
  { id: "e1-4", source: "1", target: "4", animated: true, style: { stroke: "#28392e" } },
  { id: "e2-5", source: "2", target: "5", style: { stroke: "#28392e" } },
  { id: "e2-6", source: "2", target: "6", style: { stroke: "#28392e" } },
  { id: "e3-7", source: "3", target: "7", style: { stroke: "#28392e" } },
  { id: "e3-8", source: "3", target: "8", style: { stroke: "#28392e" } },
  { id: "e4-9", source: "4", target: "9", style: { stroke: "#28392e" } },
  { id: "e4-10", source: "4", target: "10", style: { stroke: "#28392e" } },
  { id: "e6-11", source: "6", target: "11", style: { stroke: "#28392e" } },
  { id: "e6-12", source: "6", target: "12", style: { stroke: "#28392e" } },
];

export function CraftingTree() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <main className="flex-1 bg-[#0b100d] relative overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
        <div className="pointer-events-auto bg-[#111813]/90 backdrop-blur-md border border-[#28392e] rounded-lg p-4 shadow-xl max-w-md">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-md bg-gradient-to-br from-purple-900 to-indigo-900 border border-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/20">
              <span className="material-symbols-outlined text-white text-3xl">castle</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-none mb-1">
                Ancient Spire Teleport
              </h1>
              <div className="flex items-center gap-2 text-xs text-[#9db9a6]">
                <span className="bg-[#13ec5b]/20 text-[#13ec5b] px-1.5 py-0.5 rounded">
                  Legendary
                </span>
                <span>•</span>
                <span>Base Item</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer</span> 20m
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button className="bg-[#111813] border border-[#28392e] text-[#9db9a6] hover:text-white hover:border-[#13ec5b] p-2 rounded-lg shadow-lg transition-all">
            <span className="material-symbols-outlined">remove</span>
          </button>
          <button className="bg-[#111813] border border-[#28392e] text-[#9db9a6] hover:text-white hover:border-[#13ec5b] p-2 rounded-lg shadow-lg transition-all">
            <span className="material-symbols-outlined">add</span>
          </button>
          <button className="bg-[#111813] border border-[#28392e] text-[#9db9a6] hover:text-white hover:border-[#13ec5b] p-2 rounded-lg shadow-lg transition-all">
            <span className="material-symbols-outlined">center_focus_strong</span>
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0b100d]"
        >
          <Background color="#28392e" gap={16} />
          <Controls className="bg-[#111813] border border-[#28392e]" />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-[#111813]/90 backdrop-blur border border-[#28392e] p-3 rounded-lg flex flex-col gap-2 z-10">
        <div className="text-[10px] uppercase tracking-wide text-[#9db9a6] font-bold mb-1">
          Tree Legend
        </div>
        <div className="flex items-center gap-2 text-xs text-white">
          <div className="size-3 rounded-full bg-[#111813] border border-[#13ec5b] shadow-[0_0_5px_rgba(19,236,91,0.5)]" />
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
