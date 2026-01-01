"use client";

import { useCallback, useEffect, useMemo } from "react";
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
import { useAppStore } from "@/lib/store";
import type { CraftingTreeNode } from "@/lib/resolveCrafting";
import { Input } from "./ui/input";

const nodeTypes = {
  crafting: CraftingNode as any,
} as const;

// Helper to assign positions in a tree layout
function convertTreeToReactFlow(tree: CraftingTreeNode | null) {
  if (!tree) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeIdCounter = 0;
  const nodeMap = new Map<string, string>(); // treeNodeKey -> reactFlowId

  const LEVEL_HEIGHT = 180;
  const MIN_NODE_WIDTH = 250;

  function traverse(
    node: CraftingTreeNode,
    depth: number,
    parentId: string | null,
    parentKey: string
  ) {
    const nodeKey = `${parentKey}-${node.itemId}-${nodeIdCounter}`;
    const nodeId = `node-${nodeIdCounter++}`;
    nodeMap.set(nodeKey, nodeId);

    const isRaw = node.isBaseMaterial;
    const isTarget = depth === 0;
    const status = isTarget ? "target" : isRaw ? "raw" : "subcraft";

    // Icon mapping (simplified)
    let icon = "category";
    let iconBg = "bg-slate-700/50";
    let iconColor = "text-slate-300";

    if (isTarget) {
      icon = "flag";
      iconBg = "bg-indigo-900/50";
      iconColor = "text-indigo-300";
    } else if (isRaw) {
      icon = "inventory_2";
      iconBg = "bg-stone-800";
      iconColor = "text-stone-400";
    } else {
      icon = "construction";
      iconBg = "bg-slate-700/50";
      iconColor = "text-slate-300";
    }

    nodes.push({
      id: nodeId,
      type: "crafting",
      position: { x: 0, y: depth * LEVEL_HEIGHT },
      data: {
        name: node.itemName,
        quantity: node.requiredQuantity,
        icon,
        iconBg,
        iconColor,
        status,
        craftStation: node.station || undefined,
        source: isRaw ? "Gather" : undefined,
      },
    });

    if (parentId) {
      edges.push({
        id: `e-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        animated: depth === 1,
        style: { stroke: "#28392e" },
      });
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child, idx) => {
        traverse(child, depth + 1, nodeId, `${nodeKey}-${idx}`);
      });
    }
  }

  traverse(tree, 0, null, "root");

  // Assign X positions using a simple algorithm
  const levelNodes: Node[][] = [];
  nodes.forEach((node) => {
    const level = node.position.y / LEVEL_HEIGHT;
    if (!levelNodes[level]) levelNodes[level] = [];
    levelNodes[level].push(node);
  });

  levelNodes.forEach((levelNodesArray) => {
    const totalWidth = levelNodesArray.length * MIN_NODE_WIDTH;
    levelNodesArray.forEach((node, idx) => {
      node.position.x = idx * MIN_NODE_WIDTH - totalWidth / 2 + 400;
    });
  });

  return { nodes, edges };
}

export function CraftingTree() {
  const craftingResult = useAppStore((s) => s.craftingResult);
  const selectedItem = useAppStore((s) => s.selectedItem);
  const targetQuantity = useAppStore((s) => s.targetQuantity);
  const setTargetQuantity = useAppStore((s) => s.setTargetQuantity);

  const { nodes: convertedNodes, edges: convertedEdges } = useMemo(
    () => convertTreeToReactFlow(craftingResult?.tree || null),
    [craftingResult]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes(convertedNodes);
    setEdges(convertedEdges);
  }, [convertedNodes, convertedEdges, setNodes, setEdges]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  if (!selectedItem || !craftingResult) {
    return (
      <div className="flex-1 bg-[#0b100d] flex items-center justify-center">
        <p className="text-[#9db9a6] text-lg">Select an item to view crafting tree</p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#0b100d] relative overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
        <div className="pointer-events-auto bg-[#111813]/90 backdrop-blur-md border border-[#28392e] rounded-lg p-4 shadow-xl max-w-md">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-md bg-gradient-to-br from-purple-900 to-indigo-900 border border-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/20">
              <span className="material-symbols-outlined text-white text-3xl">flag</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-none mb-1">
                {craftingResult.tree.itemName}
              </h1>
              <div className="flex items-center gap-2 text-xs text-[#9db9a6]">
                <span className="bg-[#13ec5b]/20 text-[#13ec5b] px-1.5 py-0.5 rounded">
                  Target Item
                </span>
                {craftingResult.tree.station && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{craftingResult.tree.station}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-xs text-[#9db9a6]">Qty:</label>
                <Input
                  type="number"
                  min="1"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Number(e.target.value) || 1)}
                  className="w-20 h-7 text-xs bg-[#0b100d] border-[#28392e] text-white"
                />
              </div>
            </div>
          </div>
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
